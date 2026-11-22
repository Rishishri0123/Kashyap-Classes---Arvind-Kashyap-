import crypto from 'crypto';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

interface R2Config {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
}

function readR2Config(): R2Config {
  return {
    accountId: (process.env.R2_ACCOUNT_ID || '').trim(),
    accessKeyId: (process.env.R2_ACCESS_KEY_ID || '').trim(),
    secretAccessKey: (process.env.R2_SECRET_ACCESS_KEY || '').trim(),
    bucketName: (process.env.R2_BUCKET_NAME || '').trim(),
  };
}

export function getR2MissingVars(): string[] {
  const cfg = readR2Config();
  const missing: string[] = [];
  if (!cfg.accountId) missing.push('R2_ACCOUNT_ID');
  if (!cfg.accessKeyId) missing.push('R2_ACCESS_KEY_ID');
  if (!cfg.secretAccessKey) missing.push('R2_SECRET_ACCESS_KEY');
  if (!cfg.bucketName) missing.push('R2_BUCKET_NAME');
  return missing;
}

function createR2Client(): { client: S3Client; bucketName: string } {
  const missing = getR2MissingVars();
  if (missing.length > 0) {
    const err = new Error(
      `Cloudflare R2 storage is not configured. Missing environment variables: ${missing.join(', ')}`
    );
    (err as Error & { statusCode?: number }).statusCode = 503;
    throw err;
  }

  const cfg = readR2Config();
  const client = new S3Client({
    region: 'auto',
    endpoint: `https://${cfg.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: cfg.accessKeyId,
      secretAccessKey: cfg.secretAccessKey,
    },
  });

  return { client, bucketName: cfg.bucketName };
}

export function sanitizePdfFileName(fileName: string): string {
  const base = fileName
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 120);
  if (!base.toLowerCase().endsWith('.pdf')) {
    return `${base || 'notes'}.pdf`;
  }
  return base;
}

export async function createPresignedUploadUrl(params: {
  section: 'class-11-physics' | 'class-12-physics' | 'jee';
  fileName: string;
  contentType: string;
}): Promise<{ uploadUrl: string; r2FileKey: string; expiresInSeconds: number }> {
  const { client, bucketName } = createR2Client();
  const safeName = sanitizePdfFileName(params.fileName);
  const r2FileKey = `notes/${params.section}/${crypto.randomUUID()}-${safeName}`;
  const expiresInSeconds = 600; // 10 minutes to complete browser upload

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: r2FileKey,
    ContentType: params.contentType || 'application/pdf',
  });

  const uploadUrl = await getSignedUrl(client, command, { expiresIn: expiresInSeconds });
  return { uploadUrl, r2FileKey, expiresInSeconds };
}

export async function createPresignedPdfReadUrl(params: {
  r2FileKey: string;
  fileName?: string;
}): Promise<{ url: string; expiresInSeconds: number }> {
  const { client, bucketName } = createR2Client();
  const expiresInSeconds = 900; // Strict 15-minute expiring access link
  const safeName = sanitizePdfFileName(params.fileName || 'kashyap-classes-notes.pdf');

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: params.r2FileKey,
    ResponseContentType: 'application/pdf',
    ResponseContentDisposition: `inline; filename="${safeName}"`,
  });

  const url = await getSignedUrl(client, command, { expiresIn: expiresInSeconds });
  return { url, expiresInSeconds };
}
