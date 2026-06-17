import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';

export default function Signup() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/auth/signup', form);
      login(res.data);
      alert('Account created successfully!');
      navigate('/');
    } catch (error) {
      alert(error.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center container-custom py-12">
      <div className="bg-surface p-8 rounded-2xl shadow-xl border border-gray-100 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary text-center">Create Account</h1>
          <p className="text-gray-600 mt-2 text-center">Join the Islamic Store family</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input 
              type="text"
              value={form.name} 
              onChange={e=>setForm({...form,name:e.target.value})} 
              placeholder="John Doe" 
              className="input" 
              required
            />
          </div>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input 
              type="tel"
              value={form.phone} 
              onChange={e=>setForm({...form,phone:e.target.value})} 
              placeholder="+91 00000 00000" 
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
            className="btn-accent w-full text-primary py-3 mt-4 disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        
        <p className="text-center mt-6 text-gray-600">
          Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
