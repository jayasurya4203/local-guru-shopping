import React, { useState, useEffect } from 'react';
import { X, Smartphone, Mail, Lock, User, ShieldCheck, CheckCircle2, AlertCircle, RefreshCw, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ onClose, onLoginSuccess }) {
  const { sendPhoneOTP, verifyPhoneOTP, sendEmailVerification, loginUser, registerUser } = useAuth();

  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'otp_verify' | 'admin'
  
  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  
  // OTP & Verification state
  const [otpInput, setOtpInput] = useState('');
  const [otpTimer, setOtpTimer] = useState(300); // 5 minutes (300 seconds)
  const [otpSentDemo, setOtpSentDemo] = useState(null);
  const [otpVerified, setOtpVerified] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Feedback
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    let interval = null;
    if (mode === 'otp_verify' && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    } else if (otpTimer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [mode, otpTimer]);

  const handleSendOTP = async () => {
    if (!mobile || mobile.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }
    setIsSubmitting(true);
    setErrorMsg('');
    const result = await sendPhoneOTP(mobile, email);
    setIsSubmitting(false);

    if (result.success) {
      setOtpSentDemo(result.data.demo_otp);
      setOtpTimer(300);
      setMode('otp_verify');
      const gatewayInfo = result.data.sms_delivered 
        ? `Real-time SMS delivered to ${mobile} via Fast2SMS!` 
        : `OTP generated for ${mobile}. (${result.data.gateway_status})`;
      const emailInfo = result.data.email_delivered ? ' • Also sent to your Gmail inbox!' : '';
      setSuccessMsg(`${gatewayInfo}${emailInfo}`);
    } else {
      setErrorMsg(result.error);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otpInput) {
      setErrorMsg('Please enter the 6-digit OTP code');
      return;
    }
    setIsSubmitting(true);
    setErrorMsg('');
    const result = await verifyPhoneOTP(mobile, otpInput);
    setIsSubmitting(false);

    if (result.success) {
      setOtpVerified(true);
      setSuccessMsg('Phone Number Verified Successfully ✓ (MSG91 / Firebase)');
      setMode('register');
    } else {
      setErrorMsg(result.error);
    }
  };

  const handleSendEmailLink = async () => {
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address first');
      return;
    }
    setErrorMsg('');
    const result = await sendEmailVerification(email);
    if (result.success) {
      setEmailSent(true);
      setSuccessMsg(`Verification email link sent to ${email} (Brevo API)`);
    } else {
      setErrorMsg(result.error);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!otpVerified) {
      setErrorMsg('Mobile OTP verification is required to complete registration.');
      return;
    }
    setIsSubmitting(true);
    setErrorMsg('');
    const result = await registerUser(fullName, email, mobile, password, otpVerified);
    setIsSubmitting(false);

    if (result.success) {
      onLoginSuccess(result.user);
      onClose();
    } else {
      setErrorMsg(result.error);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter your email/mobile and password');
      return;
    }
    setIsSubmitting(true);
    setErrorMsg('');

    if (mode === 'admin') {
      const result = await loginUser(email || 'admin@localguru.com', password);
      setIsSubmitting(false);
      if (result.success && result.user.role === 'admin') {
        onLoginSuccess(result.user);
        onClose();
      } else if (result.success && result.user.role !== 'admin') {
        setErrorMsg('Access denied. This account does not possess administrator privileges.');
      } else {
        setErrorMsg(result.error || 'Invalid admin credentials. Use admin@localguru.com / admin123');
      }
    } else {
      const result = await loginUser(email, password);
      setIsSubmitting(false);
      if (result.success) {
        onLoginSuccess(result.user);
        onClose();
      } else {
        setErrorMsg(result.error);
      }
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl gradient-banner mx-auto flex items-center justify-center text-white font-extrabold text-xl shadow-md mb-2">
            {mode === 'admin' ? <ShieldCheck className="w-6 h-6" /> : 'LG'}
          </div>
          <h3 className="text-xl font-extrabold text-slate-900">
            {mode === 'login' && 'Welcome Back to Local Guru'}
            {mode === 'register' && 'Create Your Verified Account'}
            {mode === 'otp_verify' && 'Mobile OTP Verification'}
            {mode === 'admin' && 'Admin Portal Access'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Real-Time SMS (MSG91/Firebase) & Brevo Email Verification
          </p>
        </div>

        {/* Feedback alerts */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* MODE: LOGIN */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email or Mobile Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="surya@example.com or +91..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-hidden focus:border-indigo-500 transition-colors"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-hidden focus:border-indigo-500 transition-colors"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-md transition-colors text-xs tracking-wider uppercase disabled:bg-indigo-400"
            >
              {isSubmitting ? 'Authenticating...' : 'LOGIN TO MY ACCOUNT'}
            </button>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">New customer?</span>
              <button
                type="button"
                onClick={() => { setMode('register'); setErrorMsg(''); setSuccessMsg(''); }}
                className="font-bold text-indigo-600 hover:underline"
              >
                Create Account & Verify
              </button>
            </div>
          </form>
        )}

        {/* MODE: REGISTER */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Surya Prakash"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-hidden"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Mobile Number (+91 SMS Gateway)
              </label>
              <div className="relative flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="tel"
                    placeholder="9876543210"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    required
                    disabled={otpVerified}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-hidden disabled:bg-slate-100 font-bold"
                  />
                  <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
                {!otpVerified && (
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    disabled={isSubmitting}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] px-3 rounded-xl transition-colors shrink-0"
                  >
                    {isSubmitting ? 'Sending...' : 'SEND OTP'}
                  </button>
                )}
              </div>
            </div>

            {/* Mobile OTP Verified Status Badge */}
            {otpVerified && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-2 text-xs text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-bold">Phone Number Verified via OTP ✓</span>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Address (Brevo Integration)
              </label>
              <div className="relative flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="email"
                    placeholder="surya@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-hidden"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
                <button
                  type="button"
                  onClick={handleSendEmailLink}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] px-2.5 rounded-xl border border-slate-200 shrink-0 flex items-center space-x-1"
                  title="Send verification link"
                >
                  <Send className="w-3 h-3 text-indigo-600" />
                  <span>Verify Email</span>
                </button>
              </div>
              {emailSent && (
                <p className="text-[10px] text-indigo-600 font-semibold mt-1">
                  ✓ Verification link sent to {email}. (Check console/log for link)
                </p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Create Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-hidden"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full gradient-banner text-white font-bold py-2.5 rounded-xl shadow-md text-xs tracking-wider uppercase mt-2 disabled:opacity-50"
            >
              REGISTER & CREATE ACCOUNT
            </button>

            <div className="text-center text-xs text-slate-500 pt-2">
              Already registered?{' '}
              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
                className="font-bold text-indigo-600 hover:underline"
              >
                Sign In Here
              </button>
            </div>
          </form>
        )}

        {/* MODE: OTP VERIFICATION */}
        {mode === 'otp_verify' && (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl text-center space-y-2">
              <Smartphone className="w-8 h-8 text-indigo-600 mx-auto" />
              <p className="text-xs font-bold text-indigo-900">
                Enter 6-digit OTP code sent to <span className="underline font-mono">{mobile}</span>
              </p>
              {otpSentDemo && (
                <div className="inline-block bg-amber-100 text-amber-900 font-mono text-xs font-extrabold px-3 py-1 rounded-lg border border-amber-300">
                  REAL-TIME GENERATED OTP: <span className="tracking-widest text-sm">{otpSentDemo}</span>
                </div>
              )}
              <div className="text-[11px] text-slate-500 flex items-center justify-center space-x-1">
                <RefreshCw className="w-3 h-3 animate-spin text-indigo-600" />
                <span>OTP code valid for {formatTimer(otpTimer)} minutes</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 text-center">
                Enter 6-Digit OTP Code
              </label>
              <input
                type="text"
                maxLength="6"
                placeholder="_ _ _ _ _ _"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                required
                className="w-full text-center tracking-[0.5em] font-extrabold text-xl py-3 bg-slate-50 border-2 border-indigo-200 focus:border-indigo-600 rounded-2xl outline-hidden"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-md text-xs tracking-wider uppercase"
            >
              {isSubmitting ? 'Verifying Code...' : 'VERIFY PHONE OTP'}
            </button>

            <button
              type="button"
              onClick={() => setMode('register')}
              className="w-full text-xs text-slate-500 font-medium hover:underline text-center"
            >
              ← Back to registration form
            </button>
          </form>
        )}

        {/* MODE: ADMIN LOGIN */}
        {mode === 'admin' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
              <span>Admin Credentials: <strong>admin@localguru.com</strong> / <strong>admin123</strong></span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Admin Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@localguru.com"
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-hidden focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Admin Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-hidden focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl shadow-md text-xs tracking-wider uppercase"
            >
              LOGIN TO ADMIN DASHBOARD
            </button>
          </form>
        )}

        {/* Quick Portal Switcher */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center space-x-4 text-xs font-semibold text-slate-500">
          <button
            onClick={() => { setMode(mode === 'admin' ? 'login' : 'admin'); setErrorMsg(''); setSuccessMsg(''); }}
            className="hover:text-indigo-600 transition-colors flex items-center space-x-1"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
            <span>Switch to {mode === 'admin' ? 'Customer Login' : 'Admin Portal'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
