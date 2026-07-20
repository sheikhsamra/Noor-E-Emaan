import { useState, useEffect, useRef, useContext } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { HiOutlineEnvelope, HiOutlineCheckCircle } from 'react-icons/hi2';

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60;

export default function VerifyEmail() {
  const { verifyEmail, resendVerificationOtp, login } = useContext(AuthContext);
  const { showToast }    = useToast();
  const navigate         = useNavigate();
  const [searchParams]   = useSearchParams();
  const email            = searchParams.get('email') || '';

  const [otp, setOtp]           = useState(Array(OTP_LENGTH).fill(''));
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState(false);
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
  const [resending, setResending] = useState(false);

  const inputRefs = useRef([]);

  // Redirect if no email provided
  useEffect(() => {
    if (!email) navigate('/login');
  }, [email, navigate]);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  // Auto-focus first box on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Auto-submit when all 6 digits filled
  useEffect(() => {
    if (otp.every(d => d !== '')) {
      handleVerify();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // numbers only
    const updated = [...otp];
    updated[index] = value.slice(-1);
    setOtp(updated);
    setError('');
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (otp[index]) {
        const updated = [...otp];
        updated[index] = '';
        setOtp(updated);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
    if (e.key === 'ArrowLeft' && index > 0)            inputRefs.current[index - 1]?.focus();
    if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;
    const updated = [...otp];
    pasted.split('').forEach((ch, i) => { updated[i] = ch; });
    setOtp(updated);
    const nextEmpty = updated.findIndex(d => d === '');
    const focusIdx  = nextEmpty === -1 ? OTP_LENGTH - 1 : nextEmpty;
    inputRefs.current[focusIdx]?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length < OTP_LENGTH) return;
    setLoading(true);
    setError('');
    try {
      const res = await verifyEmail({ email, otp: code });
      if (res.token) {
        setSuccess(true);
        showToast('Email verified! Welcome to Fazaljees.', 'success');
        setTimeout(() => navigate('/'), 1500);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid or expired code. Please try again.';
      setError(msg);
      // Clear OTP boxes on error
      setOtp(Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || resending) return;
    setResending(true);
    setError('');
    try {
      await resendVerificationOtp(email);
      showToast('New verification code sent!', 'success');
      setCountdown(RESEND_COOLDOWN);
      setOtp(Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    } catch (err) {
      const data = err.response?.data;
      if (data?.code === 'OTP_RESEND_TOO_SOON' && data?.waitSeconds) {
        setCountdown(data.waitSeconds);
        setError(`Please wait ${data.waitSeconds} seconds before requesting a new code.`);
      } else {
        setError(data?.message || 'Failed to resend. Please try again.');
      }
    } finally {
      setResending(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center pt-20 px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center mx-auto mb-6">
            <HiOutlineCheckCircle className="text-4xl text-green-500" />
          </div>
          <h2 className="text-3xl font-black text-[#27211E] tracking-tight mb-3">Email Verified!</h2>
          <p className="text-[#9B8C83] font-medium">Redirecting you to the homepage…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center pt-20 px-4">
      <div className="w-full max-w-md">

        {/* Icon */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#F7F2EC] to-[#EEDFD4] border-2 border-[#D8B9A5] flex items-center justify-center mx-auto mb-8 shadow-md">
          <HiOutlineEnvelope className="text-3xl text-[#8A5A44]" />
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <span className="text-[10px] font-black tracking-[0.35em] uppercase text-[#8A5A44] block mb-3">Email Verification</span>
          <h1 className="text-3xl font-black text-[#27211E] tracking-tight leading-none mb-3">Check Your Email</h1>
          <p className="text-[#9B8C83] font-medium text-sm leading-relaxed">
            We sent a 6-digit verification code to<br />
            <strong className="text-[#3F312B] break-all">{email}</strong>
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 p-4 bg-red-50 border border-red-200/60 text-red-600 text-sm rounded-2xl font-medium text-center">
            {error}
          </div>
        )}

        {/* OTP Boxes */}
        <div className="flex gap-2 sm:gap-3 justify-center mb-6" onPaste={handlePaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={el => (inputRefs.current[i] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              disabled={loading}
              className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-black rounded-2xl border-2 outline-none transition-all duration-200 bg-white shadow-sm
                ${digit ? 'border-[#8A5A44] text-[#3F312B] bg-[#F7F2EC]' : 'border-[#E8DDD1] text-[#3F312B]'}
                ${loading ? 'opacity-50 cursor-not-allowed' : 'focus:border-[#8A5A44] focus:ring-2 focus:ring-[#8A5A44]/15 focus:bg-[#F7F2EC]'}
                ${error ? 'border-red-300' : ''}
              `}
            />
          ))}
        </div>

        {/* Verify button */}
        <button
          onClick={handleVerify}
          disabled={loading || otp.some(d => d === '')}
          className="w-full bg-[#8A5A44] hover:bg-[#6F4736] text-white font-black py-4 rounded-2xl transition-all duration-300 shadow-[0_12px_30px_rgba(138,90,68,0.3)] hover:shadow-[0_18px_40px_rgba(138,90,68,0.4)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 text-sm uppercase tracking-[0.15em] mb-6">
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Verifying…
            </span>
          ) : 'Verify Email'}
        </button>

        {/* Resend */}
        <p className="text-center text-sm text-[#9B8C83] font-medium">
          Didn't receive the code?{' '}
          {countdown > 0 ? (
            <span className="text-[#B8AAA0]">Resend in <strong className="text-[#8A5A44]">{countdown}s</strong></span>
          ) : (
            <button
              onClick={handleResend}
              disabled={resending}
              className="text-[#8A5A44] font-black hover:text-[#6F4736] transition-colors disabled:opacity-50">
              {resending ? 'Sending…' : 'Resend code'}
            </button>
          )}
        </p>

        {/* Wrong email? */}
        <p className="text-center text-xs text-[#B8AAA0] font-medium mt-4">
          Wrong email?{' '}
          <Link to="/login" className="text-[#8A5A44] font-black hover:text-[#6F4736] transition-colors">
            Go back
          </Link>
        </p>

      </div>
    </div>
  );
}
