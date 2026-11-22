import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  signOut,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';
import { isAdminEmail } from '../types/notesStore';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  authModalOpen: boolean;
  authModalReason: string | null;
  openAuthModal: (reason?: string) => void;
  closeAuthModal: () => void;
  signInWithGoogle: () => Promise<User>;
  signInWithEmail: (email: string, password: string) => Promise<User>;
  signUpWithEmail: (name: string, email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  getIdToken: (forceRefresh?: boolean) => Promise<string | null>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalReason, setAuthModalReason] = useState<string | null>(null);

  const evaluateAdminStatus = useCallback(async (currentUser: User | null) => {
    if (!currentUser) {
      setIsAdmin(false);
      return;
    }

    const emailMatch = currentUser.emailVerified && isAdminEmail(currentUser.email);
    if (emailMatch) {
      setIsAdmin(true);
      return;
    }

    try {
      const adminSnap = await getDoc(doc(db, 'admins', currentUser.uid));
      setIsAdmin(adminSnap.exists());
    } catch {
      // Fall back to email allowlist if admins/{uid} lookup is denied
      setIsAdmin(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      await evaluateAdminStatus(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [evaluateAdminStatus]);

  const openAuthModal = useCallback((reason?: string) => {
    setAuthModalReason(reason || null);
    setAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setAuthModalOpen(false);
    setAuthModalReason(null);
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const cred = await signInWithPopup(auth, googleProvider);
    await evaluateAdminStatus(cred.user);
    return cred.user;
  }, [evaluateAdminStatus]);

  const signInWithEmail = useCallback(
    async (email: string, password: string) => {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      await evaluateAdminStatus(cred.user);
      return cred.user;
    },
    [evaluateAdminStatus]
  );

  const signUpWithEmail = useCallback(
    async (name: string, email: string, password: string) => {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      if (name.trim()) {
        await updateProfile(cred.user, { displayName: name.trim() });
      }
      try {
        await sendEmailVerification(cred.user);
      } catch {
        // Non-blocking verification email attempt
      }
      await evaluateAdminStatus(cred.user);
      return cred.user;
    },
    [evaluateAdminStatus]
  );

  const logout = useCallback(async () => {
    await signOut(auth);
    setIsAdmin(false);
  }, []);

  const getIdToken = useCallback(
    async (forceRefresh = false) => {
      if (!auth.currentUser) return null;
      return auth.currentUser.getIdToken(forceRefresh);
    },
    []
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        authModalOpen,
        authModalReason,
        openAuthModal,
        closeAuthModal,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        logout,
        getIdToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return ctx;
}
