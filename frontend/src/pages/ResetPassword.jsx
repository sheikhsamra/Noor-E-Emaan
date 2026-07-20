import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { HiOutlineEye, HiOutlineEyeSlash, HiOutlineLockClosed } from 'react-icons/hi2';

const RESET_TOKEN_KEY = 'fazaljees_reset_token';

function passwordStrength(pw) {
  const checks = {
    length:    pw.length >= 8,
    uppercase: /[A-Z]/.test(pw),
    lowercase: /[a-z]/.test(pw),
    number:    /[0-9]/.test(pw),
  };
  return { checks, score: Object.values(checks).filter(Boolean).length };
}

export default function ResetPassword() {
  const { resetPassword } = useContext(AuthContext);
  const { showToast }     = useToast();
  const navigate          = useNavigate();

  const [newPassword, setNewPassword]         = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw, setShowPw]                   = useState(false);
  const [showCpw, setShowCpw]                 = useState(false);
  const [loading, setLoading]                 = useState(false);
  const [errors, setErrors]                   = useState({});

  // Gate: must have a reset token from the OTP step
  useEffect(() => {
    const token = sessionStorage.getItem(RESET_TOKEN_KEY);
    if (!token) navigate('/forgot-password', { replace: true });
  }, [navigate]);

  const inputCls = "w-full bg-white border border-[#E8DDD1] rounded-2xl px-5 py-4 text-[#27211E] placeholder:text-[#B8AAA0] font-medium outline-none focus:border-[#8A5A44] focus:ring-2 focus:ring-[#8A5A44]/10 transition-all text-sm shadow-sm";
  const labelCls = "block text-xs font-black uppercase tracking-[0.2em] text-[#3F312B] mb-2";

  const validate = () => {
    const e = {};
    const { checks } = passwordStrength(newPassword);
    if      (!checks.length)    e.newPassword = 'Password must be at least 8 characters.';
    else if (!checks.uppercase) e.newPassword = 'Password must contain at least one uppercase letter.';
    else if (!checks.lowercase) e.newPassword = 'Password must contain at least one lowercase letter.';
    else if (!checks.number)    e.newPassword = 'Password must contain at least one number.';
    if (confirmPassword !== newPassword) e.confirmPassword = 'Passwords do not match.';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const resetToken = sessionStorage.getItem(RESET_TOKEN_KEY);
    if (!resetToken) { navigate('/forgot-password', { replace: true }); return; }

    setLoading(true);
    setErrors({});
    try {
      await resetPassword({ resetToken, newPassword, confirmPassword });
      // Clear the token — it's single-use and the flow is complete
      sessionStorage.removeItem(RESET_TOKEN_KEY);
      showToast('Password reset! Please sign in with your new password.', 'success');
      navigate('/login?reset=success', { replace: true });
    } catch (err) {
      const code = err.response?.data?.code;
      const msg  = err.response?.data?.message || 'Password reset failed. Please try again.';

      if (code === 'SAME_AS_OLD_PASSWORD') {
        setErrors({ newPassword: msg });
      } else if (code === 'INVALID_RESET_TOKEN' || code === 'RESET_TOKEN_EXPIRED' || code === 'RESET_TOKEN_ALREADY_USED') {
        // Token invalid/expired/used — clear and redirect
        sessionStorage.removeItem(RESET_TOKEN_KEY);
        showToast(msg, 'error');
        navigate('/forgot-password', { replace: true });
      } else if (err.response?.data?.errors) {
        const serverErrors = {};
        err.response.data.errors.forEach(({ field, message }) => { serverErrors[field] = message; });
        setErrors(serverErrors);
      } else {
        setErrors({ general: msg });
      }
    } finally {
      setLoading(false);
    }
  };

  const { checks, score } = passwordStrength(newPassword);
  const strengthColors = ['#E8DDD1', '#EF4444', '#F97316', '#EAB308', '#22C55E'];

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center pt-20 px-4">
      <div className="w-full max-w-md py-8">

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
            Create New Password
          </h1>
          <p className="text-[#9B8C83] font-medium text-sm leading-relaxed">
            Choose a strong password you haven't used before.
          </p>
        </div>

        {errors.general && (
          <div className="mb-5 p-4 bg-red-50 border border-red-200/60 text-red-600 text-sm rounded-2xl font-medium">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>

          {/* New Password */}
          <div>
            <label className={labelCls}>New Password</label>
            <div className="relative">
              <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B8AAA0] text-lg" />
              <input
                type={showPw ? 'text' : 'password'}
                value={newPassword}
                onChange={e => { setNewPassword(e.target.value); setErrors(er => ({ ...er, newPassword: '' })); }}
                placeholder="••••••••"
                autoFocus
                autoComplete="new-password"
                className={`${inputCls} pl-11 pr-12 ${errors.newPassword ? 'border-red-400' : ''}`}
              />
              <button type="button" onClick={() => setShowPw(v => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#B8AAA0] hover:text-[#8A5A44] transition-colors">
                {showPw ? <HiOutlineEyeSlash className="text-lg" /> : <HiOutlineEye className="text-lg" />}
              </button>
            </div>

            {/* Strength bar */}
            {newPassword && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1.5">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="flex-1 h-1 rounded-full transition-all duration-300"
                      style={{ background: i <= score ? strengthColors[score] : '#E8DDD1' }} />
                  ))}
                </div>
                <div className="flex gap-3 flex-wrap">
                  {[
                    { key: 'length',    label: '8+ chars' },
                    { key: 'uppercase', label: 'Uppercase' },
                    { key: 'lowercase', label: 'Lowercase' },
                    { key: 'number',    label: 'Number' },
                  ].map(({ key, label }) => (
                    <span key={key} className={`text-[10px] font-bold ${checks[key] ? 'text-green-600' : 'text-[#B8AAA0]'}`}>
                      {checks[key] ? '✓' : '○'} {label}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {errors.newPassword && <p className="mt-1.5 text-red-500 text-xs font-medium">{errors.newPassword}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className={labelCls}>Confirm Password</label>
            <div className="relative">
              <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B8AAA0] text-lg" />
              <input
                type={showCpw ? 'text' : 'password'}
                value={confirmPassword}
                onChange={e => { setConfirmPassword(e.target.value); setErrors(er => ({ ...er, confirmPassword: '' })); }}
                placeholder="••••••••"
                autoComplete="new-password"
                className={`${inputCls} pl-11 pr-12 ${errors.confirmPassword ? 'border-red-400' : ''}`}
              />
              <button type="button" onClick={() => setShowCpw(v => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#B8AAA0] hover:text-[#8A5A44] transition-colors">
                {showCpw ? <HiOutlineEyeSlash className="text-lg" /> : <HiOutlineEye className="text-lg" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="mt-1.5 text-red-500 text-xs font-medium">{errors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#8A5A44] hover:bg-[#6F4736] text-white font-black py-4 rounded-2xl transition-all duration-300 shadow-[0_12px_30px_rgba(138,90,68,0.3)] hover:shadow-[0_18px_40px_rgba(138,90,68,0.4)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 text-sm uppercase tracking-[0.15em]">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Resetting…
              </span>
            ) : 'Reset Password'}
          </button>
        </form>

      </div>
    </div>
  );
}
