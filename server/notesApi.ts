import crypto from 'crypto';
import type express from 'express';
import Razorpay from 'razorpay';
import { FieldValue } from 'firebase-admin/firestore';
import {
  verifyBearerToken,
  isAdminDecodedToken,
  getAdminDb,
  extractErrorMessage,
} from './firebaseAdmin.js';
import { createPresignedUploadUrl, createPresignedPdfReadUrl } from './r2Client.js';

const VALID_SECTIONS = new Set(['class-11-physics', 'class-12-physics', 'jee']);
const SAFE_DOC_ID_RE = /^[a-zA-Z0-9_-]{1,128}$/;

function getRazorpayClient(): { instance: Razorpay; keyId: string; keySecret: string } {
  const keyId = (process.env.RAZORPAY_KEY_ID || '').trim();
  const keySecret = (process.env.RAZORPAY_KEY_SECRET || '').trim();

  if (!keyId || !keySecret) {
    const err = new Error(
      'Razorpay payment gateway is not configured on the server. Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET.'
    );
    (err as Error & { statusCode?: number }).statusCode = 503;
    throw err;
  }

  const instance = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });

  return { instance, keyId, keySecret };
}

export function registerNotesStoreRoutes(app: express.Express) {
  // 1. Admin: Generate Cloudflare R2 Presigned PUT URL for direct browser PDF upload
  app.post('/api/admin/r2-presign-upload', async (req, res) => {
    try {
      const decoded = await verifyBearerToken(req);
      const isAdmin = await isAdminDecodedToken(decoded);
      if (!isAdmin) {
        return res.status(403).json({
          success: false,
          error: 'Forbidden: Only authorized Kashyap Classes admins can upload note PDFs.',
        });
      }

      const { section, fileName, contentType, fileSizeBytes } = req.body || {};
      if (!VALID_SECTIONS.has(section)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid section. Expected class-11-physics, class-12-physics, or jee.',
        });
      }

      if (typeof fileName !== 'string' || !fileName.trim().toLowerCase().endsWith('.pdf')) {
        return res.status(400).json({
          success: false,
          error: 'Only .pdf files are supported for note uploads.',
        });
      }

      const normalizedType = typeof contentType === 'string' ? contentType : 'application/pdf';
      if (normalizedType !== 'application/pdf') {
        return res.status(400).json({
          success: false,
          error: 'Invalid file MIME type. Expected application/pdf.',
        });
      }

      const sizeNum = Number(fileSizeBytes);
      if (!Number.isFinite(sizeNum) || sizeNum <= 0 || sizeNum > 200 * 1024 * 1024) {
        return res.status(400).json({
          success: false,
          error: 'PDF file size must be between 1 byte and 200 MB.',
        });
      }

      const presigned = await createPresignedUploadUrl({
        section,
        fileName: fileName.trim(),
        contentType: 'application/pdf',
      });

      return res.status(200).json({
        success: true,
        ...presigned,
      });
    } catch (err) {
      const { status, message } = extractErrorMessage(err);
      return res.status(status).json({ success: false, error: message });
    }
  });

  // 2. Student Checkout: Create authentic Razorpay Order from Firestore prices
  app.post('/api/create-order', async (req, res) => {
    try {
      const decoded = await verifyBearerToken(req);
      const { itemType, itemId } = req.body || {};

      if (itemType !== 'single' && itemType !== 'bundle') {
        return res.status(400).json({
          success: false,
          error: 'Invalid itemType. Expected "single" or "bundle".',
        });
      }

      if (typeof itemId !== 'string' || !SAFE_DOC_ID_RE.test(itemId)) {
        return res.status(400).json({ success: false, error: 'Invalid itemId format.' });
      }

      const db = getAdminDb();
      const collectionName = itemType === 'single' ? 'notes' : 'bundles';
      const itemSnap = await db.collection(collectionName).doc(itemId).get();

      if (!itemSnap.exists) {
        return res.status(404).json({
          success: false,
          error: `Requested ${itemType} note item was not found.`,
        });
      }

      const itemData = itemSnap.data()!;
      const priceInINR =
        itemType === 'single'
          ? Number(itemData.singlePriceInINR)
          : Number(itemData.bundlePriceInINR);

      if (!Number.isFinite(priceInINR) || priceInINR < 0) {
        return res.status(400).json({
          success: false,
          error: 'Configured price in Firestore is invalid.',
        });
      }

      const targetNoteIds: string[] =
        itemType === 'single'
          ? [itemId]
          : Array.isArray(itemData.includedNoteIds)
          ? itemData.includedNoteIds.filter((id: unknown): id is string => typeof id === 'string')
          : [];

      if (targetNoteIds.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'This bundle contains no notes.',
        });
      }

      // Check existing purchases for this user to avoid duplicate charges
      const existingPurchasesSnap = await db
        .collection('purchases')
        .where('userId', '==', decoded.uid)
        .get();

      const ownedSet = new Set<string>();
      existingPurchasesSnap.forEach((docSnap) => {
        const list = docSnap.data()?.unlockedNoteIds;
        if (Array.isArray(list)) {
          list.forEach((id: unknown) => {
            if (typeof id === 'string') ownedSet.add(id);
          });
        }
      });

      if (targetNoteIds.every((id) => ownedSet.has(id))) {
        return res.status(409).json({
          success: false,
          alreadyOwned: true,
          error: 'You already own this note / all notes included in this bundle.',
        });
      }

      // Support ₹0 free promotional notes/bundles via direct server unlock
      if (priceInINR === 0) {
        const purchaseId = `free_${crypto.randomUUID().replace(/-/g, '').slice(0, 20)}`;
        await db.collection('purchases').doc(purchaseId).set({
          purchaseId,
          userId: decoded.uid,
          unlockedNoteIds: targetNoteIds,
          section: itemData.section,
          purchaseType: itemType,
          itemId,
          itemTitle: itemData.title || 'Physics Notes',
          razorpayOrderId: purchaseId,
          razorpayPaymentId: 'FREE_ACCESS',
          amountPaid: 0,
          purchasedAt: FieldValue.serverTimestamp(),
        });

        return res.status(200).json({
          success: true,
          freeUnlocked: true,
          purchaseId,
          unlockedNoteIds: targetNoteIds,
          section: itemData.section,
        });
      }

      const { instance: razorpay, keyId } = getRazorpayClient();
      const amountPaise = Math.round(priceInINR * 100);
      const shortReceipt = `kc_${Date.now().toString(36)}_${crypto.randomBytes(3).toString('hex')}`;

      const order = await razorpay.orders.create({
        amount: amountPaise,
        currency: 'INR',
        receipt: shortReceipt,
        notes: {
          userId: decoded.uid,
          itemType,
          itemId,
          section: String(itemData.section),
        },
      });

      return res.status(200).json({
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId,
        priceInINR,
        itemTitle: itemData.title || 'Kashyap Classes Physics Notes',
        itemDescription: itemData.description || '',
        section: itemData.section,
      });
    } catch (err) {
      const { status, message } = extractErrorMessage(err);
      return res.status(status).json({ success: false, error: message });
    }
  });

  // 3. Student Checkout: Verify Razorpay HMAC signature & save purchase in Firestore
  app.post('/api/verify-payment', async (req, res) => {
    try {
      const decoded = await verifyBearerToken(req);
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        itemType,
        itemId,
      } = req.body || {};

      if (
        typeof razorpay_order_id !== 'string' ||
        typeof razorpay_payment_id !== 'string' ||
        typeof razorpay_signature !== 'string' ||
        !razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature
      ) {
        return res.status(400).json({
          success: false,
          error: 'Missing Razorpay payment verification parameters.',
        });
      }

      if (itemType !== 'single' && itemType !== 'bundle') {
        return res.status(400).json({ success: false, error: 'Invalid itemType.' });
      }

      if (typeof itemId !== 'string' || !SAFE_DOC_ID_RE.test(itemId)) {
        return res.status(400).json({ success: false, error: 'Invalid itemId format.' });
      }

      const { instance: razorpay, keySecret } = getRazorpayClient();

      // Verify HMAC-SHA256 signature
      const expectedHex = crypto
        .createHmac('sha256', keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      const providedBuf = Buffer.from(razorpay_signature, 'utf8');
      const expectedBuf = Buffer.from(expectedHex, 'utf8');

      if (
        providedBuf.length !== expectedBuf.length ||
        !crypto.timingSafeEqual(providedBuf, expectedBuf)
      ) {
        return res.status(400).json({
          success: false,
          error: 'Razorpay payment signature verification failed.',
        });
      }

      // Confirm order metadata with Razorpay & authoritative item in Firestore
      const order = await razorpay.orders.fetch(razorpay_order_id);
      if (order?.notes?.userId && order.notes.userId !== decoded.uid) {
        return res.status(403).json({
          success: false,
          error: 'Payment order does not belong to the signed-in student account.',
        });
      }

      const resolvedItemType =
        order?.notes?.itemType === 'single' || order?.notes?.itemType === 'bundle'
          ? order.notes.itemType
          : itemType;
      const resolvedItemId =
        typeof order?.notes?.itemId === 'string' && SAFE_DOC_ID_RE.test(order.notes.itemId)
          ? order.notes.itemId
          : itemId;

      const db = getAdminDb();
      const collectionName = resolvedItemType === 'single' ? 'notes' : 'bundles';
      const itemSnap = await db.collection(collectionName).doc(resolvedItemId).get();

      if (!itemSnap.exists) {
        return res.status(404).json({
          success: false,
          error: 'Purchased item record could not be found in Firestore.',
        });
      }

      const itemData = itemSnap.data()!;
      const unlockedNoteIds: string[] =
        resolvedItemType === 'single'
          ? [resolvedItemId]
          : Array.isArray(itemData.includedNoteIds)
          ? itemData.includedNoteIds.filter((id: unknown): id is string => typeof id === 'string')
          : [];

      const authoritativePriceInINR =
        resolvedItemType === 'single'
          ? Number(itemData.singlePriceInINR)
          : Number(itemData.bundlePriceInINR);

      if (Number(order.amount) !== Math.round(authoritativePriceInINR * 100)) {
        return res.status(400).json({
          success: false,
          error: 'Order amount mismatch against authoritative catalog price.',
        });
      }

      const purchaseId = razorpay_order_id.replace(/[^a-zA-Z0-9_-]/g, '_');
      const purchaseDoc = {
        purchaseId,
        userId: decoded.uid,
        unlockedNoteIds,
        section: itemData.section,
        purchaseType: resolvedItemType,
        itemId: resolvedItemId,
        itemTitle: itemData.title || 'Physics Notes',
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        amountPaid: authoritativePriceInINR,
        purchasedAt: FieldValue.serverTimestamp(),
      };

      await db.collection('purchases').doc(purchaseId).set(purchaseDoc, { merge: false });

      return res.status(200).json({
        success: true,
        purchaseId,
        unlockedNoteIds,
        section: itemData.section,
        purchaseType: resolvedItemType,
        amountPaid: authoritativePriceInINR,
      });
    } catch (err) {
      const { status, message } = extractErrorMessage(err);
      return res.status(status).json({ success: false, error: message });
    }
  });

  // 4. Protected PDF Viewer: Verify ownership & issue 15-minute expiring R2 GET URL
  async function handleGetPdfUrl(req: express.Request, res: express.Response) {
    try {
      const decoded = await verifyBearerToken(req);
      const rawNoteId =
        typeof req.body?.noteId === 'string'
          ? req.body.noteId
          : typeof req.query?.noteId === 'string'
          ? req.query.noteId
          : '';
      const noteId = rawNoteId.trim();

      if (!SAFE_DOC_ID_RE.test(noteId)) {
        return res.status(400).json({ success: false, error: 'Invalid noteId.' });
      }

      const db = getAdminDb();
      const isAdmin = await isAdminDecodedToken(decoded);

      if (!isAdmin) {
        const ownershipSnap = await db
          .collection('purchases')
          .where('userId', '==', decoded.uid)
          .where('unlockedNoteIds', 'array-contains', noteId)
          .limit(1)
          .get();

        if (ownershipSnap.empty) {
          return res.status(403).json({
            success: false,
            error: 'Access denied: Please purchase this note or bundle to unlock its PDF.',
          });
        }
      }

      const [noteSnap, privateStorageSnap] = await Promise.all([
        db.collection('notes').doc(noteId).get(),
        db.collection('notes').doc(noteId).collection('private').doc('storage').get(),
      ]);

      if (!noteSnap.exists || !privateStorageSnap.exists) {
        return res.status(404).json({
          success: false,
          error: 'PDF storage reference not found for this note.',
        });
      }

      const storageData = privateStorageSnap.data()!;
      const r2FileKey = storageData.r2FileKey;
      if (typeof r2FileKey !== 'string' || !r2FileKey) {
        return res.status(404).json({
          success: false,
          error: 'R2 file key missing in protected storage record.',
        });
      }

      const { url, expiresInSeconds } = await createPresignedPdfReadUrl({
        r2FileKey,
        fileName: storageData.originalFileName || `${noteSnap.data()?.title || noteId}.pdf`,
      });

      return res.status(200).json({
        success: true,
        url,
        expiresInSeconds,
        title: noteSnap.data()?.title || 'Physics Notes PDF',
        originalFileName: storageData.originalFileName || 'notes.pdf',
      });
    } catch (err) {
      const { status, message } = extractErrorMessage(err);
      return res.status(status).json({ success: false, error: message });
    }
  }

  app.post('/api/get-pdf-url', handleGetPdfUrl);
  app.get('/api/get-pdf-url', handleGetPdfUrl);
}
