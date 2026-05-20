import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../../context/authStore';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const { login, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(form.email, form.password);
    if (result.success) {
      toast.success('Welcome back!');
      navigate('/dashboard');
    } else {
      toast.error(result.message);
    }
  };

  const setField = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-slide-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 mb-5">
            <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-200 dark:shadow-brand-900">
              <SparklesIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gradient">InternIQ</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Sign in to track your applications</p>
        </div>

        {/* Card */}
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email address</label>
              <input type="email" className="input" value={form.email} onChange={setField('email')}
                placeholder="you@example.com" required autoFocus />
            </div>
            <div>
              <label className="label">Password</label>
              <input type="password" className="input" value={form.password} onChange={setField('password')}
                placeholder="••••••••" required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full mt-2 py-3">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-brand-600 dark:text-brand-400 font-semibold hover:underline">
                Create one free
              </Link>
            </p>
          </div>
        </div>

        {/* Demo hint */}
        <p className="text-center text-xs text-gray-400 mt-4">
          Demo: any email + password (6+ chars) after registering
        </p>
      </div>
    </div>
  );
}
