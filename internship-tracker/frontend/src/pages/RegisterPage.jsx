import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../../context/authStore';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const { register, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    const result = await register(form.name, form.email, form.password);
    if (result.success) {
      toast.success('Account created! Welcome to InternIQ 🎉');
      navigate('/dashboard');
    } else {
      toast.error(result.message);
    }
  };

  const setField = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 mb-5">
            <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-200 dark:shadow-brand-900">
              <SparklesIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gradient">InternIQ</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create your account</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Start tracking your internship applications</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <input className="input" value={form.name} onChange={setField('name')} placeholder="Jane Smith" required />
            </div>
            <div>
              <label className="label">Email address</label>
              <input type="email" className="input" value={form.email} onChange={setField('email')} placeholder="you@example.com" required />
            </div>
            <div>
              <label className="label">Password</label>
              <input type="password" className="input" value={form.password} onChange={setField('password')} placeholder="Min. 6 characters" required minLength={6} />
            </div>
            <div>
              <label className="label">Confirm Password</label>
              <input type="password" className="input" value={form.confirm} onChange={setField('confirm')} placeholder="••••••••" required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-brand-600 dark:text-brand-400 font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
