import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { HiOutlineEnvelope, HiOutlineLockClosed } from 'react-icons/hi2';

export default function ForgotPassword() {
  const { forgotPassword } = useContext(AuthContext);
  const navigate           = useNavigate();
  const [searchParams]     = useSearchParams();

  const [email, setEmail]     = useState(searchParams.get('email') || '');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [errorCode, setErrorCode] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) { setError('Please enter your email address.'); return; }
    if (!/\S+@\S+\.\S+/.test(trimmed)) { setError('Please enter a valid email address.'); return; }

    setLoading(true);
    setError('');
    setErrorCode('');
    try {
      await forgotPassword(trimmed);
      navigate(`/verify-reset-otp?email=${encodeURIComponent(trimmed)}`);
    } catch (err) {
      const code = err.response?.data?.code || '';
      setErrorCode(code);
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full bg-white border border-[#E8DDD1] rounded-2xl px-5 py-4 text-[#27211E] placeholder:text-[#B8AAA0] font-medium outline-none focus:border-[#8A5A44] focus:ring-2 focus:ring-[#8A5A44]/10 transition-all text-sm shadow-sm";

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center pt-20 px-4">
      <div className="w-full max-w-md">

        {/* Icon */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#F7F2EC] to-[#EEDFD4] border-2 border-[#D8B9A5] flex items-center justify-center mx-auto mb-8 shadow-md">
          <HiOutlineLockClosed className="text-3xl text-[#8A5A44]" />
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <span className="text-[10px] font-black tracking-[0.35em] uppercase text-[#8A5A44] block mb-3">
            Password Recovery
          </span>
          <h1 className="text-3xl font-black text-[#27211E] tracking-tight leading-none mb-3">
            Forgot Password?
          </h1>
          <p className="text-[#9B8C83] font-medium text-sm leading-relaxed">
            Enter your email and we'll send you a 6-digit reset code.
          </p>
        </div>

        {error && (
          <div className={`mb-5 p-4 border text-sm rounded-2xl font-medium ${
            errorCode === 'GOOGLE_ACCOUNT_ONLY'
              ? 'bg-blue-50 border-blue-200/60 text-blue-700'
              : 'bg-red-50 border-red-200/60 text-red-600'
          }`}>
            {error}
            {errorCode === 'GOOGLE_ACCOUNT_ONLY' && (
              <span className="block mt-1">
                Go back and use{' '}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="underline font-bold hover:opacity-80"
                >
                  Sign in with Google
                </button>
                .
              </span>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <label className="block text-xs font-black uppercase tracking-[0.2em] text-[#3F312B] mb-2">
              Email Address
            </label>
            <div className="relative">
              <HiOutlineEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B8AAA0] text-lg" />
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(''); setErrorCode(''); }}
                placeholder="name@example.com"
                autoFocus
                autoComplete="email"
                required
                className={`${inputCls} pl-11`}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#8A5A44] hover:bg-[#6F4736] text-white font-black py-4 rounded-2xl transition-all duration-300 shadow-[0_12px_30px_rgba(138,90,68,0.3)] hover:shadow-[0_18px_40px_rgba(138,90,68,0.4)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 text-sm uppercase tracking-[0.15em]">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Sending…
              </span>
            ) : 'Send Reset Code'}
          </button>
        </form>

        <p className="text-center text-sm text-[#9B8C83] font-medium mt-8">
          Remember your password?{' '}
          <Link to="/login" className="text-[#8A5A44] font-black hover:text-[#6F4736] transition-colors">
            Back to Login
          </Link>
        </p>

      </div>
    </div>
  );
}
