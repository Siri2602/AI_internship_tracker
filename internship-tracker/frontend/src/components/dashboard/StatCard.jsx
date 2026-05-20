import clsx from 'clsx';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';

export default function StatCard({ title, value, subtitle, icon: Icon, color = 'brand', trend }) {
  const colors = {
    brand: 'from-brand-500 to-brand-600',
    green: 'from-green-500 to-emerald-600',
    purple: 'from-purple-500 to-indigo-600',
    orange: 'from-orange-500 to-amber-600',
    red: 'from-red-500 to-rose-600',
  };

  return (
    <div className="stat-card animate-in">
      <div className="flex items-start justify-between">
        <div className={clsx('w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center', colors[color])}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        {trend !== undefined && (
          <div className={clsx('flex items-center gap-1 text-xs font-medium', trend >= 0 ? 'text-green-500' : 'text-red-500')}>
            {trend >= 0 ? <ArrowTrendingUpIcon className="w-3.5 h-3.5" /> : <ArrowTrendingDownIcon className="w-3.5 h-3.5" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        {subtitle && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}
