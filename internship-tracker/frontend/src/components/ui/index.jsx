import clsx from 'clsx';
import { STATUS_COLORS, PRIORITY_COLORS } from '../../utils/constants';

export function StatusBadge({ status }) {
  const colors = STATUS_COLORS[status] || STATUS_COLORS['Applied'];
  return (
    <span className={clsx('badge', colors.bg, colors.text)}>
      <span className={clsx('w-1.5 h-1.5 rounded-full', colors.dot)} />
      {status}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  const colors = PRIORITY_COLORS[priority] || PRIORITY_COLORS['Medium'];
  return (
    <span className={clsx('badge', colors.bg, colors.text)}>
      {priority}
    </span>
  );
}

export function LoadingSpinner({ size = 'md' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' };
  return (
    <div className={clsx('animate-spin rounded-full border-2 border-gray-200 border-t-brand-600', sizes[size])} />
  );
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-in">
      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-sm">{description}</p>
      {action}
    </div>
  );
}

export function Modal({ open, onClose, title, children, size = 'md' }) {
  if (!open) return null;
  const sizes = { sm: 'max-w-md', md: 'max-w-2xl', lg: 'max-w-4xl', xl: 'max-w-5xl' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={clsx('relative w-full bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 animate-slide-up overflow-hidden', sizes[size])}>
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <div className="max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
