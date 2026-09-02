import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { HiOutlineEye, HiOutlineEyeSlash, HiOutlineEnvelope, HiOutlineLockClosed, HiOutlineUser } from 'react-icons/hi2';

function passwordStrength(pw) {
  const checks = {
    length:    pw.length >= 8,
    uppercase: /[A-Z]/.test(pw),
    lowercase: /[a-z]/.test(pw),
    number:    /[0-9]/.test(pw),
  };
  const passed = Object.values(checks).filter(Boolean).length;
  return { checks, score: passed };
}

export default function Signup() {
  const { signup }       = useContext(AuthContext);
  const { showToast }    = useToast();
  const navigate         = useNavigate();
  const [searchParams]   = useSearchParams();

  const prefillEmail = searchParams.get('email') || '';

  const [form, setForm] = useState({ name: '', email: prefillEmail, password: '', confirmPassword: '' });
  const [showPw, setShowPw]     = useState(false);
  const [showCpw, setShowCpw]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [errors, setErrors]     = useState({});

  const inputCls = "w-full bg-white border border-[#E8DDD1] rounded-2xl px-5 py-4 text-[#27211E] placeholder:text-[#B8AAA0] font-medium outline-none focus:border-[#8A5A44] focus:ring-2 focus:ring-[#8A5A44]/10 transition-all text-sm shadow-sm";
  const labelCls = "block text-xs font-black uppercase tracking-[0.2em] text-[#3F312B] mb-2";

  const set = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors(er => ({ ...er, [field]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())            e.name = 'Name is required.';
    if (!form.email.trim())           e.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email address.';
    const { checks } = passwordStrength(form.password);
    if (!checks.length)    e.password = 'Password must be at least 8 characters.';
    else if (!checks.uppercase) e.password = 'Password must contain at least one uppercase letter.';
    else if (!checks.lowercase) e.password = 'Password must contain at least one lowercase letter.';
    else if (!checks.number)    e.password = 'Password must contain at least one number.';
    if (form.confirmPassword !== form.password) e.confirmPassword = 'Passwords do not match.';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await signup({
        name:            form.name.trim(),
        email:           form.email.trim().toLowerCase(),
        password:        form.password,
        confirmPassword: form.confirmPassword,
      });
      showToast('Account created! Please verify your email.', 'success');
      navigate(`/verify-email?email=${encodeURIComponent(form.email.trim().toLowerCase())}`);
    } catch (err) {
      const code = err.response?.data?.code;
      const msg  = err.response?.data?.message || 'Signup failed. Please try again.';
      if (code === 'EMAIL_ALREADY_EXISTS') {
        setErrors({ email: msg });
      } else if (err.response?.data?.errors) {
        const serverErrors = {};
        err.response.data.errors.forEach(({ field, message }) => { serverErrors[field] = message; });
        setErrors(serverErrors);
      } else {
        showToast(msg, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const { checks, score } = passwordStrength(form.password);
  const strengthColors = ['#E8DDD1', '#EF4444', '#F97316', '#EAB308', '#22C55E'];
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];

  return (
    <div className="flex bg-[#FAF8F5] pt-20 min-h-screen">

      {/* ── Left decorative panel ──────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 self-stretch relative overflow-hidden flex-col items-center justify-center p-16 bg-gradient-to-br from-[#EEDFD4] via-[#F7F2EC] to-[#DCC8B8]">
        <div className="absolute top-0 left-0 w-80 h-80 rounded-full bg-[#D8B9A5]/40 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-[#C9A646]/10 blur-3xl" />
        <div className="relative z-10 text-center max-w-md">
          <div className="h-24 w-24 rounded-full bg-white/70 border-2 border-[#D8B9A5] flex items-center justify-center text-5xl mx-auto mb-8 shadow-lg">🌙</div>
          <span className="text-[10px] font-black tracking-[0.4em] uppercase text-[#8A5A44] block mb-4">Join Our Family</span>
          <h2 className="text-4xl font-black text-[#3F312B] tracking-tight mb-5 leading-none">Fazaljees</h2>
          <p className="text-[#6F5E55] leading-relaxed font-medium text-lg">
            Create your account and explore our curated collection of premium Islamic essentials.
          </p>
          <div className="mt-10 space-y-3 text-left">
            {['✓  Free delivery on orders over Rs. 3000', '✓  Save items to your personal wishlist', '✓  Exclusive member-only offers', '✓  Order tracking & history'].map(b => (
              <div key={b} className="bg-white/50 border border-[#D8B9A5]/50 rounded-xl px-4 py-3">
                <p className="text-[#6F5E55] text-sm font-semibold">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right form panel ──────────────────────────────────────── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md py-16 lg:py-8">

          <div className="mb-8">
            <span className="text-[10px] font-black tracking-[0.35em] uppercase text-[#8A5A44] block mb-3">New Account</span>
            <h1 className="text-4xl font-black text-[#27211E] tracking-tight leading-none mb-3">Create Account</h1>
            <p className="text-[#9B8C83] font-medium">Join thousands of Muslims shopping with trust.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>

            {/* Name */}
            <div>
              <label className={labelCls}>Full Name</label>
              <div className="relative">
                <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B8AAA0] text-lg" />
                <input type="text" value={form.name} onChange={set('name')}
                  placeholder="Your Full Name" autoComplete="name"
                  className={`${inputCls} pl-11 ${errors.name ? 'border-red-400' : ''}`} />
              </div>
              {errors.name && <p className="mt-1.5 text-red-500 text-xs font-medium">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className={labelCls}>Email Address</label>
              <div className="relative">
                <HiOutlineEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B8AAA0] text-lg" />
                <input type="email" value={form.email} onChange={set('email')}
                  placeholder="name@example.com" autoComplete="email"
                  className={`${inputCls} pl-11 ${errors.email ? 'border-red-400' : ''}`} />
              </div>
              {errors.email && <p className="mt-1.5 text-red-500 text-xs font-medium">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className={labelCls}>
                Password <span className="text-[#B8AAA0] font-medium normal-case tracking-normal ml-1">(min. 8 chars)</span>
              </label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B8AAA0] text-lg" />
                <input type={showPw ? 'text' : 'password'} value={form.password} onChange={set('password')}
                  placeholder="••••••••" autoComplete="new-password"
                  className={`${inputCls} pl-11 pr-12 ${errors.password ? 'border-red-400' : ''}`} />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#B8AAA0] hover:text-[#8A5A44] transition-colors">
                  {showPw ? <HiOutlineEyeSlash className="text-lg" /> : <HiOutlineEye className="text-lg" />}
                </button>
              </div>

              {/* Strength bar */}
              {form.password && (
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
              {errors.password && <p className="mt-1.5 text-red-500 text-xs font-medium">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className={labelCls}>Confirm Password</label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B8AAA0] text-lg" />
                <input type={showCpw ? 'text' : 'password'} value={form.confirmPassword} onChange={set('confirmPassword')}
                  placeholder="••••••••" autoComplete="new-password"
                  className={`${inputCls} pl-11 pr-12 ${errors.confirmPassword ? 'border-red-400' : ''}`} />
                <button type="button" onClick={() => setShowCpw(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#B8AAA0] hover:text-[#8A5A44] transition-colors">
                  {showCpw ? <HiOutlineEyeSlash className="text-lg" /> : <HiOutlineEye className="text-lg" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1.5 text-red-500 text-xs font-medium">{errors.confirmPassword}</p>}
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-[#8A5A44] hover:bg-[#6F4736] text-white font-black py-4 rounded-2xl transition-all duration-300 shadow-[0_12px_30px_rgba(138,90,68,0.3)] hover:shadow-[0_18px_40px_rgba(138,90,68,0.4)] hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0 text-sm uppercase tracking-[0.15em] mt-2">
              {loading ? 'Creating Account…' : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-[#E8DDD1] text-center">
            <p className="text-[#9B8C83] font-medium">
              Already have an account?{' '}
              <Link to="/login" className="text-[#8A5A44] font-black hover:text-[#6F4736] transition-colors">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
