import { useState, useEffect } from 'react';
import { SparklesIcon, LightBulbIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import api from '../../utils/api';

const TYPE_STYLES = {
  success: {
    icon: CheckCircleIcon,
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-200 dark:border-green-800',
    icon_cls: 'text-green-500',
    title_cls: 'text-green-700 dark:text-green-400',
  },
  warning: {
    icon: ExclamationTriangleIcon,
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    border: 'border-yellow-200 dark:border-yellow-800',
    icon_cls: 'text-yellow-500',
    title_cls: 'text-yellow-700 dark:text-yellow-400',
  },
  info: {
    icon: LightBulbIcon,
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800',
    icon_cls: 'text-blue-500',
    title_cls: 'text-blue-700 dark:text-blue-400',
  },
};

export default function AIInsights({ stats }) {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  const fetchInsights = async () => {
    if (!stats || loading) return;
    setLoading(true);
    try {
      const { data } = await api.post('/ai/insights', { stats });
      setInsights(data.insights || []);
    } catch {
      setInsights([
        { title: 'Keep Applying', description: 'Consistency is key. Aim for 5–10 applications per week to maximize your chances.', type: 'info' },
        { title: 'Follow Up Promptly', description: 'Send a follow-up email 1–2 weeks after applying. Most candidates never do.', type: 'warning' },
        { title: 'Leverage Your Network', description: 'Referrals increase interview chances by up to 9×. Reach out to alumni and connections.', type: 'success' },
      ]);
    } finally {
      setLoading(false);
      setFetched(true);
    }
  };

  useEffect(() => {
    if (stats && !fetched) fetchInsights();
  }, [stats]);

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <SparklesIcon className="w-5 h-5 text-brand-500" />
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">AI Insights</h2>
        </div>
        <button
          onClick={() => { setFetched(false); fetchInsights(); }}
          disabled={loading}
          className="text-xs text-brand-600 dark:text-brand-400 hover:underline font-medium disabled:opacity-50"
        >
          {loading ? 'Analyzing…' : 'Refresh'}
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {insights.map((insight, i) => {
            const style = TYPE_STYLES[insight.type] || TYPE_STYLES.info;
            const Icon = style.icon;
            return (
              <div key={i} className={clsx('p-3.5 rounded-xl border', style.bg, style.border)}>
                <div className="flex items-start gap-2.5">
                  <Icon className={clsx('w-4 h-4 mt-0.5 flex-shrink-0', style.icon_cls)} />
                  <div>
                    <p className={clsx('text-sm font-semibold mb-0.5', style.title_cls)}>{insight.title}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{insight.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
