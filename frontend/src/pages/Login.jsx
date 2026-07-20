import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import API from '../api/axios';
import { useGoogleLogin } from '@react-oauth/google';
import { HiOutlineEye, HiOutlineEyeSlash, HiOutlineEnvelope, HiOutlineLockClosed, HiArrowLeft } from 'react-icons/hi2';

export default function Login() {
  const { login, checkEmail, loginWithGoogle } = useContext(AuthContext);
  const { showToast }                          = useToast();
  const navigate                               = useNavigate();
  const [searchParams]                         = useSearchParams();
  const resetSuccess = searchParams.get('reset') === 'success';

  const [step, setStep]           = useState('email'); // 'email' | 'password'
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [showPw, setShowPw]       = useState(false);
  const [checking, setChecking]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError]         = useState('');

  // ── Google Sign-In ───────────────────────────────────────────────────────
  const googleSignIn = useGoogleLogin({
    onSuccess: async ({ access_token }) => {
      setGoogleLoading(true);
      setError('');
      try {
        const res = await loginWithGoogle(access_token);
        showToast(`Welcome, ${res.user?.name?.split(' ')[0] || 'back'}!`, 'success');
        navigate(res.user?.role === 'admin' ? '/admin' : '/');
      } catch (err) {
        setError(err.response?.data?.message || 'Google Sign-In failed. Please try again.');
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => {
      setError('Google Sign-In was cancelled or failed. Please try again.');
      setGoogleLoading(false);
    },
    flow: 'implicit',
  });

  // ── Step 1: check email ──────────────────────────────────────────────────
  const handleEmailContinue = async (e) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) { setError('Please enter your email.'); return; }
    if (!/\S+@\S+\.\S+/.test(trimmed)) { setError('Please enter a valid email address.'); return; }

    setChecking(true);
    setError('');
    try {
      const data = await checkEmail(trimmed);

      if (!data.exists) {
        navigate(`/signup?email=${encodeURIComponent(trimmed)}`);
        return;
      }

      // Google-only account — cannot use password flow
      if (data.provider === 'google' && data.exists) {
        setError('This account uses Google Sign-In. Please click "Continue with Google" below.');
        setChecking(false);
        return;
      }

      if (!data.isEmailVerified) {
        navigate(`/verify-email?email=${encodeURIComponent(trimmed)}`);
        return;
      }

      // Verified local account → show password step
      setStep('password');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setChecking(false);
    }
  };

  // ── Step 2: password login ───────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!password) { setError('Please enter your password.'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await API.post('/auth/login', { email, password });
      login(res.data);
      showToast('Welcome back!', 'success');
      navigate(res.data.user?.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      const code = err.response?.data?.code;
      if (code === 'EMAIL_NOT_VERIFIED') {
        showToast('Please verify your email first.', 'info');
        navigate(`/verify-email?email=${encodeURIComponent(email)}`);
        return;
      }
      const msg = err.response?.data?.message || 'Login failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full bg-white border border-[#E8DDD1] rounded-2xl px-5 py-4 text-[#27211E] placeholder:text-[#B8AAA0] font-medium outline-none focus:border-[#8A5A44] focus:ring-2 focus:ring-[#8A5A44]/10 transition-all text-sm shadow-sm";

  return (
    <div className="flex bg-[#FAF8F5] pt-20 min-h-screen">

      {/* ── Left decorative panel ─────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 self-stretch relative overflow-hidden flex-col items-center justify-center p-16 bg-gradient-to-br from-[#F7F2EC] via-[#EEDFD4] to-[#DCC8B8]">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#D8B9A5]/40 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[#C9A646]/10 blur-3xl" />
        <div className="relative z-10 text-center max-w-md">
          <div className="h-24 w-24 rounded-full bg-white/70 border-2 border-[#D8B9A5] flex items-center justify-center text-5xl mx-auto mb-8 shadow-lg">🌙</div>
          <span className="text-[10px] font-black tracking-[0.4em] uppercase text-[#8A5A44] block mb-4">Premium Islamic Store</span>
          <h2 className="text-4xl font-black text-[#3F312B] tracking-tight mb-5 leading-none">Fazaljees</h2>
          <p className="text-[#6F5E55] leading-relaxed font-medium text-lg">
            Discover premium Islamic essentials crafted for your spiritual and everyday lifestyle.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-4">
            {[{ label: '1000+', sub: 'Products' }, { label: '50K+', sub: 'Customers' }, { label: '7+', sub: 'Categories' }].map((s) => (
              <div key={s.label} className="bg-white/60 border border-[#D8B9A5]/60 rounded-2xl p-4 backdrop-blur-sm">
                <p className="text-[#8A5A44] font-black text-xl">{s.label}</p>
                <p className="text-[#9B8C83] text-[10px] font-black uppercase tracking-widest mt-1">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right form panel ─────────────────────────────────────────── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 py-20 lg:py-8">
        <div className="w-full max-w-md">

          {/* Back button (password step only) */}
          {step === 'password' && (
            <button onClick={() => { setStep('email'); setPassword(''); setError(''); }}
              className="flex items-center gap-1.5 text-[#8A5A44] font-bold text-sm mb-8 hover:text-[#6F4736] transition-colors">
              <HiArrowLeft className="text-base" /> Change email
            </button>
          )}

          <div className="mb-8">
            <span className="text-[10px] font-black tracking-[0.35em] uppercase text-[#8A5A44] block mb-3">
              {step === 'email' ? 'Welcome Back' : 'Enter Password'}
            </span>
            <h1 className="text-4xl font-black text-[#27211E] tracking-tight leading-none mb-3">
              {step === 'email' ? 'Sign In' : 'Welcome back'}
            </h1>
            {step === 'password' && (
              <p className="text-[#9B8C83] font-medium text-sm break-all">{email}</p>
            )}
            {step === 'email' && (
              <p className="text-[#9B8C83] font-medium">Enter your email to continue.</p>
            )}
          </div>

          {resetSuccess && (
            <div className="mb-5 p-4 bg-green-50 border border-green-200/60 text-green-700 text-sm rounded-2xl font-medium flex items-start gap-2">
              <span className="mt-0.5">✓</span>
              <span>Password reset successfully. Please sign in with your new password.</span>
            </div>
          )}

          {error && (
            <div className="mb-5 p-4 bg-red-50 border border-red-200/60 text-red-600 text-sm rounded-2xl font-medium">
              {error}
            </div>
          )}

          {/* ── Email step ───────────────────────────────────────────── */}
          {step === 'email' && (
            <form onSubmit={handleEmailContinue} className="space-y-5">
              <div>
                <label className="block text-xs font-black uppercase tracking-[0.2em] text-[#3F312B] mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <HiOutlineEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B8AAA0] text-lg" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError(''); }}
                    placeholder="name@example.com"
                    autoFocus
                    autoComplete="email"
                    required
                    className={`${inputCls} pl-11`}
                  />
                </div>
              </div>

              <button type="submit" disabled={checking}
                className="w-full bg-[#8A5A44] hover:bg-[#6F4736] text-white font-black py-4 rounded-2xl transition-all duration-300 shadow-[0_12px_30px_rgba(138,90,68,0.3)] hover:shadow-[0_18px_40px_rgba(138,90,68,0.4)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 text-sm uppercase tracking-[0.15em]">
                {checking ? 'Checking…' : 'Continue'}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 my-2">
                <div className="flex-1 h-px bg-[#E8DDD1]" />
                <span className="text-[#B8AAA0] text-xs font-bold uppercase tracking-widest">or</span>
                <div className="flex-1 h-px bg-[#E8DDD1]" />
              </div>

              <button
                type="button"
                onClick={() => { setGoogleLoading(true); setError(''); googleSignIn(); }}
                disabled={googleLoading || checking}
                className="w-full flex items-center justify-center gap-3 bg-white border-2 border-[#E8DDD1] hover:border-[#8A5A44]/40 hover:shadow-md text-[#3F312B] font-bold py-3.5 rounded-2xl text-sm shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                {googleLoading ? (
                  <svg className="animate-spin h-5 w-5 text-[#8A5A44]" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  </svg>
                )}
                {googleLoading ? 'Connecting…' : 'Continue with Google'}
              </button>
            </form>
          )}

          {/* ── Password step ────────────────────────────────────────── */}
          {step === 'password' && (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-black uppercase tracking-[0.2em] text-[#3F312B]">
                    Password
                  </label>
                  <Link
                    to={`/forgot-password?email=${encodeURIComponent(email)}`}
                    className="text-xs font-bold text-[#8A5A44] hover:text-[#6F4736] transition-colors">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B8AAA0] text-lg" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError(''); }}
                    placeholder="••••••••"
                    autoFocus
                    autoComplete="current-password"
                    required
                    className={`${inputCls} pl-11 pr-12`}
                  />
                  <button type="button" onClick={() => setShowPw(v => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#B8AAA0] hover:text-[#8A5A44] transition-colors">
                    {showPw ? <HiOutlineEyeSlash className="text-lg" /> : <HiOutlineEye className="text-lg" />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full bg-[#8A5A44] hover:bg-[#6F4736] text-white font-black py-4 rounded-2xl transition-all duration-300 shadow-[0_12px_30px_rgba(138,90,68,0.3)] hover:shadow-[0_18px_40px_rgba(138,90,68,0.4)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 text-sm uppercase tracking-[0.15em]">
                {loading ? 'Signing In…' : 'Sign In'}
              </button>
            </form>
          )}

          <div className="mt-8 pt-8 border-t border-[#E8DDD1] text-center">
            <p className="text-[#9B8C83] font-medium">
              Don't have an account?{' '}
              <Link to="/signup" className="text-[#8A5A44] font-black hover:text-[#6F4736] transition-colors">
                Create Account
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
