import React, { useState } from 'react';
import { UserAccount } from '../types';
import { X, Lock, Mail, User, CheckCircle2, ArrowRight } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
  promptReason?: string;
  onSuccess: (user: UserAccount) => void;
}

export const AuthModal: React.FC<Props> = ({
  isOpen,
  onClose,
  initialMode = 'signup',
  promptReason,
  onSuccess
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    if (mode === 'signup') {
      if (!name.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const user: UserAccount = {
        id: `user-${Date.now()}`,
        name: name.trim() || email.split('@')[0],
        email: email.trim(),
        isLoggedIn: true
      };
      onSuccess(user);
      onClose();
    }, 450);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const user: UserAccount = {
        id: `user-google-${Date.now()}`,
        name: 'Google User',
        email: 'user.google@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
        isLoggedIn: true
      };
      onSuccess(user);
      onClose();
    }, 400);
  };

  const handleFacebookLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const user: UserAccount = {
        id: `user-fb-${Date.now()}`,
        name: 'Facebook User',
        email: 'user.facebook@fb.com',
        isLoggedIn: true
      };
      onSuccess(user);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-[#dadce0] dark:border-slate-800 overflow-hidden">
        {/* Close Button */}
        <button
          id="auth-modal-close-btn"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors focus:outline-none cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Header Banner */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/60 text-[#1a73e8] dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-blue-100 dark:border-blue-900/60 shadow-xs">
              <Lock className="w-6 h-6" />
            </div>

            <h2 className="text-xl font-bold text-[#202124] dark:text-white">
              {promptReason || (mode === 'signup' ? 'Create a Free Account' : 'Welcome Back')}
            </h2>

            <p className="text-xs text-[#5f6368] dark:text-slate-400 mt-1.5">
              {promptReason
                ? 'Sign in or create a free account to save multiple resumes and access them anywhere.'
                : mode === 'signup'
                ? 'Sign up in seconds. 100% free with unlimited high-res PDF exports.'
                : 'Log in to access your saved resumes and export PDFs.'}
            </p>
          </div>

          {/* Social Sign In Buttons: Google & Facebook */}
          <div className="space-y-2.5 mb-4">
            <button
              type="button"
              id="auth-google-btn"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-[#dadce0] dark:border-slate-700 rounded-xl text-sm font-semibold text-[#3c4043] dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-xs cursor-pointer"
            >
              {/* Google G SVG */}
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <button
              type="button"
              id="auth-facebook-btn"
              onClick={handleFacebookLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-xl text-sm font-semibold transition-colors shadow-xs cursor-pointer"
            >
              {/* Facebook SVG */}
              <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>Continue with Facebook</span>
            </button>
          </div>

          <div className="flex items-center my-4">
            <div className="flex-1 border-t border-gray-200 dark:border-slate-800" />
            <span className="px-3 text-xs text-gray-400 dark:text-slate-500 font-medium uppercase">or email</span>
            <div className="flex-1 border-t border-gray-200 dark:border-slate-800" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {error && (
              <div className="p-2.5 rounded-lg bg-red-50 dark:bg-rose-950/40 border border-red-200 dark:border-rose-900/60 text-xs text-red-700 dark:text-rose-300 font-medium">
                {error}
              </div>
            )}

            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-[#202124] dark:text-slate-200 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    id="auth-name-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-[#dadce0] dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-[#1a73e8] focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#202124] dark:text-slate-200 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="email"
                  id="auth-email-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-[#dadce0] dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-[#1a73e8] focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#202124] dark:text-slate-200 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="password"
                  id="auth-password-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-[#dadce0] dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-[#1a73e8] focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40"
                  required
                />
              </div>
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-[#202124] dark:text-slate-200 mb-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="password"
                    id="auth-confirm-password-input"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-[#dadce0] dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-[#1a73e8] focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40"
                    required
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              id="auth-submit-btn"
              disabled={isLoading}
              className="w-full mt-2 py-2.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white rounded-xl text-sm font-semibold shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{mode === 'signup' ? 'Create Free Account' : 'Sign In'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle login vs signup */}
          <div className="mt-5 text-center text-xs text-[#5f6368] dark:text-slate-400">
            {mode === 'signup' ? (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  id="auth-switch-to-login"
                  onClick={() => {
                    setMode('login');
                    setError('');
                  }}
                  className="font-bold text-[#1a73e8] dark:text-blue-400 hover:underline cursor-pointer"
                >
                  Log in
                </button>
              </p>
            ) : (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  id="auth-switch-to-signup"
                  onClick={() => {
                    setMode('signup');
                    setError('');
                  }}
                  className="font-bold text-[#1a73e8] dark:text-blue-400 hover:underline cursor-pointer"
                >
                  Create Free Account
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Benefits bar */}
        <div className="bg-gray-50 dark:bg-slate-950 border-t border-[#dadce0] dark:border-slate-800 px-6 py-3 text-[11px] text-[#5f6368] dark:text-slate-400 flex items-center justify-around">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#188038] dark:text-emerald-400" /> 100% Free
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#188038] dark:text-emerald-400" /> Instant PDF Export
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#188038] dark:text-emerald-400" /> Auto-Saved
          </span>
        </div>
      </div>
    </div>
  );
};

