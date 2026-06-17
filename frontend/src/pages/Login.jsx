import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/auth/login', form);
      login(res.data);
      alert('Logged in successfully!');
      navigate('/');
    } catch (error) {
      alert(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center container-custom">
      <div className="bg-surface p-8 rounded-2xl shadow-xl border border-gray-100 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Welcome Back</h1>
          <p className="text-gray-600 mt-2">Login to your account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input 
              type="email"
              value={form.email} 
              onChange={e=>setForm({...form,email:e.target.value})} 
              placeholder="name@example.com" 
              className="input" 
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              value={form.password} 
              onChange={e=>setForm({...form,password:e.target.value})} 
              placeholder="••••••••" 
              className="input" 
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="btn-accent w-full text-primary py-3 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>
        
        <p className="text-center mt-6 text-gray-600">
          Don't have an account? <Link to="/signup" className="text-primary font-bold hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
