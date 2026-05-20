import { useState } from 'react';
import { SparklesIcon, ClipboardDocumentIcon, CheckIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import api from '../utils/api';
import { useAuthStore } from '../context/authStore';
import { EMAIL_TEMPLATE_TYPES } from '../utils/constants';

export default function AIToolsPage() {
  const { user } = useAuthStore();
  const [form, setForm] = useState({
    type: 'follow-up', company: '', role: '', contactName: '', context: '',
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const setField = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!form.company || !form.role) {
      toast.error('Company and role are required');
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const { data } = await api.post('/ai/email-template', {
        ...form,
        userName: user?.name || 'Applicant',
      });
      setResult(data);
      toast.success('Email template generated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'AI service unavailable. Check your API key.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(`Subject: ${result.subject}\n\n${result.body}`);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 animate-in">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <SparklesIcon className="w-6 h-6 text-brand-600" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Email Generator</h1>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Generate professional emails for every stage of your job search using Claude AI.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="card p-6">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Email Settings</h2>
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="label">Email Type</label>
              <select className="input" value={form.type} onChange={setField('type')}>
                {EMAIL_TEMPLATE_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Company *</label>
              <input className="input" value={form.company} onChange={setField('company')} placeholder="Google" required />
            </div>
            <div>
              <label className="label">Role *</label>
              <input className="input" value={form.role} onChange={setField('role')} placeholder="Software Engineer Intern" required />
            </div>
            <div>
              <label className="label">Contact Name (optional)</label>
              <input className="input" value={form.contactName} onChange={setField('contactName')} placeholder="Jane Smith" />
            </div>
            <div>
              <label className="label">Additional Context (optional)</label>
              <textarea className="input resize-none" rows={3} value={form.context} onChange={setField('context')}
                placeholder="Applied 2 weeks ago via LinkedIn, had initial chat..." />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? (
                <span className="flex items-center gap-2 justify-center">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Generating...
                </span>
              ) : (
                <><SparklesIcon className="w-4 h-4" /> Generate Email</>
              )}
            </button>
          </form>
        </div>

        {/* Result */}
        <div className="card p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Generated Email</h2>
            {result && (
              <button onClick={handleCopy} className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5">
                {copied ? <><CheckIcon className="w-3.5 h-3.5 text-green-500" /> Copied</> : <><ClipboardDocumentIcon className="w-3.5 h-3.5" /> Copy</>}
              </button>
            )}
          </div>

          {loading && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-3">
                <SparklesIcon className="w-10 h-10 text-brand-400 mx-auto animate-pulse-slow" />
                <p className="text-sm text-gray-400">Claude is writing your email...</p>
              </div>
            </div>
          )}

          {result && !loading && (
            <div className="flex-1 space-y-3">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Subject</p>
                <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm text-gray-900 dark:text-white font-medium">
                  {result.subject}
                </div>
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Body</p>
                <div className="px-3 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto">
                  {result.body}
                </div>
              </div>
            </div>
          )}

          {!result && !loading && (
            <div className="flex-1 flex items-center justify-center text-center">
              <div>
                <div className="w-16 h-16 bg-brand-50 dark:bg-brand-900/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <SparklesIcon className="w-8 h-8 text-brand-500" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Fill in the form and generate your email</p>
                <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">Requires Anthropic API key in backend .env</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="card p-5">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Pro Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Follow Up Timing', desc: 'Send follow-ups 1-2 weeks after applying. 80% of offers go to those who follow up.' },
            { title: 'Personalization', desc: 'Mention specific projects or values you admire. Generic emails get deleted.' },
            { title: 'Thank You Notes', desc: 'Send within 24 hours of every interview. It makes you memorable.' },
          ].map((tip) => (
            <div key={tip.title} className="p-4 bg-brand-50 dark:bg-brand-900/20 rounded-xl">
              <p className="text-sm font-semibold text-brand-700 dark:text-brand-300 mb-1">{tip.title}</p>
              <p className="text-xs text-brand-600 dark:text-brand-400">{tip.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
