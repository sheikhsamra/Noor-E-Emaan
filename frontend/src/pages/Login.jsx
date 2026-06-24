import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';

export default function Login() {
  const { login } = useContext(AuthContext);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await API.post('/auth/login', form);
      login(res.data);
      showToast('Welcome back! You are now logged in.', 'success');
      navigate(res.data.user?.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-[#FAF8F5] pt-20">

      {/* Left decorative panel — light cream gradient matching hero */}
      <div className="hidden lg:flex lg:w-1/2 self-stretch relative overflow-hidden flex-col items-center justify-center p-16 bg-gradient-to-br from-[#F7F2EC] via-[#EEDFD4] to-[#DCC8B8]">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#D8B9A5]/40 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[#C9A646]/10 blur-3xl" />

        <div className="relative z-10 text-center max-w-md">
          <div className="h-24 w-24 rounded-full bg-white/70 border-2 border-[#D8B9A5] flex items-center justify-center text-5xl mx-auto mb-8 shadow-lg">
            🌙
          </div>
          <span className="text-[10px] font-black tracking-[0.4em] uppercase text-[#8A5A44] block mb-4">
            Premium Islamic Store
          </span>
          <h2 className="text-4xl font-black text-[#3F312B] tracking-tight mb-5 leading-none">
            Noor-E-Emaan
          </h2>
          <p className="text-[#6F5E55] leading-relaxed font-medium text-lg">
            Discover premium Islamic essentials crafted for your spiritual and everyday lifestyle.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-4">
            {[
              { label: '1000+', sub: 'Products' },
              { label: '50K+', sub: 'Customers' },
              { label: '7+', sub: 'Categories' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/60 border border-[#D8B9A5]/60 rounded-2xl p-4 backdrop-blur-sm">
                <p className="text-[#8A5A44] font-black text-xl">{stat.label}</p>
                <p className="text-[#9B8C83] text-[10px] font-black uppercase tracking-widest mt-1">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 py-28 lg:py-8">
        <div className="w-full max-w-md">

          <div className="mb-10">
            <span className="text-[10px] font-black tracking-[0.35em] uppercase text-[#8A5A44] block mb-3">
              Welcome Back
            </span>
            <h1 className="text-4xl font-black text-[#27211E] tracking-tight leading-none mb-3">
              Sign In
            </h1>
            <p className="text-[#9B8C83] font-medium">
              Enter your credentials to access your account.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200/60 text-red-600 text-sm rounded-2xl font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-black uppercase tracking-[0.2em] text-[#3F312B] mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="name@example.com"
                required
                className="w-full bg-white border border-[#E8DDD1] rounded-2xl px-5 py-4 text-[#27211E] placeholder:text-[#B8AAA0] font-medium outline-none focus:border-[#8A5A44] focus:ring-2 focus:ring-[#8A5A44]/10 transition-all text-sm shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-[0.2em] text-[#3F312B] mb-2">
                Password
              </label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                required
                className="w-full bg-white border border-[#E8DDD1] rounded-2xl px-5 py-4 text-[#27211E] placeholder:text-[#B8AAA0] font-medium outline-none focus:border-[#8A5A44] focus:ring-2 focus:ring-[#8A5A44]/10 transition-all text-sm shadow-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#8A5A44] hover:bg-[#6F4736] text-white font-black py-4 rounded-2xl transition-all duration-300 shadow-[0_12px_30px_rgba(138,90,68,0.3)] hover:shadow-[0_18px_40px_rgba(138,90,68,0.4)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 text-sm uppercase tracking-[0.15em] mt-2"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

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
