import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';

export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) return setError('All fields are required');
    if (password.length < 6) return setError('Password should be at least 6 characters');
    if (password !== confirm) return setError('Passwords do not match');
    setLoading(true);
    try {
      await API.post('/auth/signup', { email, password });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-700 p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur rounded-xl shadow-2xl p-8 border border-white/10">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Signup</h1>
        {error && <div className="bg-red-500/20 text-red-100 text-sm p-3 rounded mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            className="w-full p-3 rounded bg-white/5 border border-white/10 text-white placeholder:text-white/50"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="w-full p-3 rounded bg-white/5 border border-white/10 text-white placeholder:text-white/50"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            className="w-full p-3 rounded bg-white/5 border border-white/10 text-white placeholder:text-white/50"
            placeholder="Confirm Password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          <button
            disabled={loading}
            className="w-full p-3 rounded bg-indigo-500 hover:bg-indigo-600 text-white font-semibold transition"
          >
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
        <p className="text-white/70 text-sm mt-4 text-center">
          Have an account? <Link className="text-indigo-300" to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
