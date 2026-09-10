'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { X, Mail, Phone, Lock, User, CheckCircle2, Loader2, Sparkles } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    signInWithEmail,
    signUpWithEmail,
    signInWithPhone,
    verifyPhoneOtp,
  } = useAuth();

  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [method, setMethod] = useState<'email' | 'phone'>('email');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // Status states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const resetForm = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setOtpSent(false);
    setOtp('');
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      if (authMode === 'signup') {
        if (!fullName.trim()) {
          setErrorMsg('Please enter your full name');
          setIsLoading(false);
          return;
        }
        const { error } = await signUpWithEmail(email, password, fullName, phone);
        if (error) throw error;
        setSuccessMsg('Account created successfully! Welcome to Calway.');
      } else {
        const { error } = await signInWithEmail(email, password);
        if (error) throw error;
        setSuccessMsg('Welcome back to Calway!');
      }

      setTimeout(() => {
        setIsLoading(false);
        closeAuthModal();
        resetForm();
      }, 1200);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed. Please check your credentials.';
      setErrorMsg(msg);
      setIsLoading(false);
    }
  };

  const handlePhoneSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.replace(/\D/g, '').length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const { error } = await signInWithPhone(phone);
      if (error) throw error;
      setOtpSent(true);
      setSuccessMsg('OTP sent to +91 ' + phone.replace(/\D/g, ''));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send OTP. Please try email sign in.';
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) {
      setErrorMsg('Please enter the 6-digit OTP');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const { error } = await verifyPhoneOtp(phone, otp);
      if (error) throw error;
      setSuccessMsg('Phone verified! Welcome to Calway.');
      setTimeout(() => {
        setIsLoading(false);
        closeAuthModal();
        resetForm();
      }, 1200);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid or expired OTP. Please try again.';
      setErrorMsg(msg);
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-brand-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            closeAuthModal();
            resetForm();
          }}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center mt-1">
          <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center mx-auto mb-2.5 text-2xl shadow-2xs">
            🥬
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-brand-950 tracking-tight">
            {authMode === 'signin' ? 'Welcome Back to CALWAY' : 'Join the Kolkata Dawn Run'}
          </h2>
          <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
            {authMode === 'signin'
              ? 'Sign in to access your saved addresses, track morning drops, and view orders'
              : 'Create an account for zero cold storage morning vegetable deliveries'}
          </p>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="my-4 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-emerald-900 text-xs font-bold animate-in zoom-in-95">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="my-4 p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs font-bold animate-in shake">
            {errorMsg}
          </div>
        )}

        {/* Auth Method Tabs (Email vs Phone) */}
        {!successMsg && (
          <div className="mt-4 flex items-center p-1 bg-gray-100 rounded-2xl text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setMethod('email');
                resetForm();
              }}
              className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                method === 'email'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Mail className="w-3.5 h-3.5 text-brand-600" />
              <span>Email & Password</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMethod('phone');
                resetForm();
              }}
              className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                method === 'phone'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Phone className="w-3.5 h-3.5 text-brand-600" />
              <span>Mobile OTP</span>
            </button>
          </div>
        )}

        {/* METHOD 1: EMAIL & PASSWORD */}
        {!successMsg && method === 'email' && (
          <form onSubmit={handleEmailAuth} className="mt-4 space-y-3">
            {authMode === 'signup' && (
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ananya Sen"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="email"
                  required
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                />
              </div>
            </div>

            {authMode === 'signup' && (
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Mobile Number (For Delivery Updates)
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs font-bold text-gray-500 border-r border-gray-200 pr-1.5">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="98300 12345"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-14 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-black text-sm rounded-xl shadow-md shadow-brand-600/25 transition-all flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{authMode === 'signin' ? 'Sign In to Calway' : 'Create Account'}</span>
            </button>
          </form>
        )}

        {/* METHOD 2: PHONE NUMBER OTP */}
        {!successMsg && method === 'phone' && (
          <div className="mt-4">
            {!otpSent ? (
              <form onSubmit={handlePhoneSendOtp} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Mobile Number
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-xs font-bold text-gray-500 border-r border-gray-200 pr-2">
                      +91
                    </span>
                    <input
                      type="tel"
                      pattern="[0-9]{10}"
                      maxLength={10}
                      required
                      placeholder="98300 12345"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      className="w-full pl-16 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                      autoFocus
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || phone.length < 10}
                  className="w-full mt-2 py-3 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-black text-sm rounded-xl shadow-md shadow-brand-600/25 transition-all flex items-center justify-center gap-2"
                >
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Send OTP via SMS</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handlePhoneVerifyOtp} className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                      Enter 6-Digit OTP
                    </label>
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-[11px] font-bold text-brand-600 hover:underline"
                    >
                      Change Number
                    </button>
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="w-full py-2.5 px-4 text-center tracking-[0.5em] text-lg font-black bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || otp.length < 6}
                  className="w-full mt-2 py-3 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-black text-sm rounded-xl shadow-md shadow-brand-600/25 transition-all flex items-center justify-center gap-2"
                >
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Verify & Sign In</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* Toggle between Sign In and Sign Up */}
        {!successMsg && (
          <div className="mt-4 pt-3 border-t border-gray-100 text-center">
            {authMode === 'signin' ? (
              <p className="text-xs text-gray-500">
                New to Calway?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    resetForm();
                  }}
                  className="font-bold text-brand-700 hover:underline"
                >
                  Create an account
                </button>
              </p>
            ) : (
              <p className="text-xs text-gray-500">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signin');
                    resetForm();
                  }}
                  className="font-bold text-brand-700 hover:underline"
                >
                  Sign in here
                </button>
              </p>
            )}
          </div>
        )}

        {/* Mandi Fresh Guarantee Footer */}
        <div className="mt-3 text-center">
          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            100% Zero Cold Storage Mandi Produce
          </span>
        </div>
      </div>
    </div>
  );
};
