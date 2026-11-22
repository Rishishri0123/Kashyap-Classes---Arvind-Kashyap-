import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User as UserIcon, LogIn, UserPlus, Loader2, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthModal: React.FC = () => {
  const {
    authModalOpen,
    authModalReason,
    closeAuthModal,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    user,
  } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (user && authModalOpen) {
      closeAuthModal();
    }
  }, [user, authModalOpen, closeAuthModal]);

  useEffect(() => {
    setErrorMsg(null);
  }, [mode, authModalOpen]);

  if (!authModalOpen) return null;

  const formatFirebaseAuthError = (err: unknown): string => {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('auth/invalid-credential') || msg.includes('auth/wrong-password') || msg.includes('auth/user-not-found')) {
      return 'Invalid email or password. Please try again.';
    }
    if (msg.includes('auth/email-already-in-use')) {
      return 'An account with this email already exists. Please sign in instead.';
    }
    if (msg.includes('auth/weak-password')) {
      return 'Password must be at least 6 characters long.';
    }
    if (msg.includes('auth/popup-closed-by-user')) {
      return 'Google sign-in popup was closed before completing.';
    }
    if (msg.includes('auth/operation-not-allowed')) {
      return 'Email/Password sign-in is not yet enabled in Firebase Console -> Authentication -> Sign-in method. Please use Google Sign-In or enable Email/Password.';
    }
    return msg.replace('Firebase: ', '');
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setSubmitting(true);
    try {
      await signInWithGoogle();
      closeAuthModal();
    } catch (err) {
      setErrorMsg(formatFirebaseAuthError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim() || !password) {
      setErrorMsg('Please enter both your email and password.');
      return;
    }

    if (mode === 'signup' && password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setSubmitting(true);
    try {
      if (mode === 'login') {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(name, email, password);
      }
      closeAuthModal();
    } catch (err) {
      setErrorMsg(formatFirebaseAuthError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-[#0c2340] text-white px-6 py-4 flex items-center justify-between border-b-2 border-[#ff6600]">
          <div>
            <h2 id="auth-modal-title" className="text-lg font-black font-heading tracking-tight">
              {mode === 'login' ? 'Student & Admin Sign In' : 'Create Student Account'}
            </h2>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Access your purchased Physics Notes PDFs anytime
            </p>
          </div>
          <button
            onClick={closeAuthModal}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
            aria-label="Close sign in dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {authModalReason && (
            <div className="bg-[#fff7f0] border border-[#fed7aa] text-[#0c2340] text-xs font-semibold px-3.5 py-2.5 rounded-xl flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-[#ff6600] shrink-0 mt-0.5" />
              <span>{authModalReason}</span>
            </div>
          )}

          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-800 text-xs font-medium px-3.5 py-2.5 rounded-xl flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Google Sign-In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={submitting}
            className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-slate-300 text-slate-800 font-bold text-sm rounded-xl flex items-center justify-center gap-2.5 shadow-2xs transition-all cursor-pointer disabled:opacity-60"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              OR
            </span>
            <div className="border-t border-slate-200 w-full" />
          </div>

          {/* Tabs: Sign In / Create Account */}
          <div className="grid grid-cols-2 gap-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-[#0c2340] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-white text-[#0c2340] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleEmailSubmit} className="space-y-3">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Student Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff6600]/30 focus:border-[#ff6600]"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff6600]/30 focus:border-[#ff6600]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff6600]/30 focus:border-[#ff6600]"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 px-4 bg-[#ff6600] hover:bg-[#ea580c] text-white font-black text-sm rounded-xl shadow-kc-orange flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : mode === 'login' ? (
                <LogIn className="w-4 h-4" />
              ) : (
                <UserPlus className="w-4 h-4" />
              )}
              <span>
                {submitting
                  ? 'Authenticating...'
                  : mode === 'login'
                  ? 'Sign In with Email'
                  : 'Create Account'}
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
