import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';

export default function Signup() {
  const { login } = useContext(AuthContext);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    try {
      const res = await API.post('/auth/signup', form);
      login(res.data);
      showToast('Account created! Welcome to Noor-E-Emaan.', 'success');
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || 'Signup failed. Please try again.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-white border border-[#E8DDD1] rounded-2xl px-5 py-4 text-[#27211E] placeholder:text-[#B8AAA0] font-medium outline-none focus:border-[#8A5A44] focus:ring-2 focus:ring-[#8A5A44]/10 transition-all text-sm shadow-sm";
  const labelClass = "block text-xs font-black uppercase tracking-[0.2em] text-[#3F312B] mb-2";

  return (
    <div className="flex bg-[#FAF8F5] pt-20">

      {/* Left decorative panel — light cream gradient */}
      <div className="hidden lg:flex lg:w-1/2 self-stretch relative overflow-hidden flex-col items-center justify-center p-16 bg-gradient-to-br from-[#EEDFD4] via-[#F7F2EC] to-[#DCC8B8]">
        <div className="absolute top-0 left-0 w-80 h-80 rounded-full bg-[#D8B9A5]/40 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-[#C9A646]/10 blur-3xl" />

        <div className="relative z-10 text-center max-w-md">
          <div className="h-24 w-24 rounded-full bg-white/70 border-2 border-[#D8B9A5] flex items-center justify-center text-5xl mx-auto mb-8 shadow-lg">
            🌙
          </div>
          <span className="text-[10px] font-black tracking-[0.4em] uppercase text-[#8A5A44] block mb-4">
            Join Our Family
          </span>
          <h2 className="text-4xl font-black text-[#3F312B] tracking-tight mb-5 leading-none">
            Noor-E-Emaan
          </h2>
          <p className="text-[#6F5E55] leading-relaxed font-medium text-lg">
            Create your account and explore our curated collection of premium Islamic essentials.
          </p>

          <div className="mt-10 space-y-3 text-left">
            {[
              '✓  Free delivery on orders over Rs. 3000',
              '✓  Save items to your personal wishlist',
              '✓  Exclusive member-only offers',
              '✓  Order tracking & history',
            ].map((benefit) => (
              <div key={benefit} className="bg-white/50 border border-[#D8B9A5]/50 rounded-xl px-4 py-3">
                <p className="text-[#6F5E55] text-sm font-semibold">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md py-16 lg:py-8">

          <div className="mb-8">
            <span className="text-[10px] font-black tracking-[0.35em] uppercase text-[#8A5A44] block mb-3">
              New Account
            </span>
            <h1 className="text-4xl font-black text-[#27211E] tracking-tight leading-none mb-3">
              Create Account
            </h1>
            <p className="text-[#9B8C83] font-medium">
              Join thousands of Muslims shopping with trust.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200/60 text-red-600 text-sm rounded-2xl font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={labelClass}>Full Name</label>
              <input type="text" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Your Full Name" required className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Email Address</label>
              <input type="email" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="name@example.com" required className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Phone Number</label>
              <input type="tel" value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                placeholder="+92 300 0000000" required className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>
                Password
                <span className="text-[#B8AAA0] font-medium normal-case tracking-normal ml-2">(min. 8 chars)</span>
              </label>
              <input type="password" value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••" required minLength={8} className={inputClass} />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#8A5A44] hover:bg-[#6F4736] text-white font-black py-4 rounded-2xl transition-all duration-300 shadow-[0_12px_30px_rgba(138,90,68,0.3)] hover:shadow-[0_18px_40px_rgba(138,90,68,0.4)] hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0 text-sm uppercase tracking-[0.15em] mt-2"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-[#E8DDD1] text-center">
            <p className="text-[#9B8C83] font-medium">
              Already have an account?{' '}
              <Link to="/login" className="text-[#8A5A44] font-black hover:text-[#6F4736] transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
