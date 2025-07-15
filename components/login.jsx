import React, { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { Button } from './ui/button';

// Simple Modal implementation using a portal
const Modal = ({ open, onClose, children }) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-background border border-border rounded-xl shadow-2xl max-w-md w-full p-8 flex flex-col items-center animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

const Login = ({ open, onOpenChange }) => {
  const [error, setError] = useState(null);

  // Close error on modal close
  useEffect(() => {
    if (!open) setError(null);
  }, [open]);

  const handleGoogleLogin = async () => {
    try {
      setError(null);
      await signIn('google', { callbackUrl: '/dashboard' });
    } catch (err) {
      setError('Failed to sign in. Please try again.');
    }
  };

  return (
    <Modal open={open} onClose={() => onOpenChange(false)}>
      <div className="flex flex-col items-center w-full">
        <div className="text-3xl font-bold mb-2 text-primary">Sign in to S3Drive</div>
        <div className="mb-6 text-center text-muted-foreground text-base max-w-xs">
          Use your Google account to continue
        </div>
        <Button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 bg-[#4285F4] hover:bg-[#357ae8] text-white text-lg py-3 rounded-md mb-2 shadow-md transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 48 48" className="mr-2"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C35.64 2.36 30.13 0 24 0 14.82 0 6.73 5.82 2.69 14.09l7.98 6.2C12.13 13.36 17.57 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.01l7.19 5.59C43.98 37.36 46.1 31.45 46.1 24.55z"/><path fill="#FBBC05" d="M10.67 28.29c-1.13-3.36-1.13-6.93 0-10.29l-7.98-6.2C.9 16.36 0 20.06 0 24c0 3.94.9 7.64 2.69 10.2l7.98-6.2z"/><path fill="#EA4335" d="M24 48c6.13 0 11.64-2.03 15.53-5.53l-7.19-5.59c-2.01 1.35-4.59 2.12-8.34 2.12-6.43 0-11.87-3.86-13.33-9.29l-7.98 6.2C6.73 42.18 14.82 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></g></svg>
          Sign in with Google
        </Button>
        {error && <div className="text-red-500 mt-2 text-sm w-full text-center">{error}</div>}
        <Button
          variant="ghost"
          className="mt-4 w-full border border-border text-primary hover:bg-muted"
          onClick={() => onOpenChange(false)}
        >
          Cancel
        </Button>
      </div>
    </Modal>
  );
};

export default Login;