import { PencilIcon, TrashIcon, ArrowTopRightOnSquareIcon, CalendarIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { StatusBadge, PriorityBadge } from '../ui';
import { formatDate, formatRelativeDate } from '../../utils/constants';

export default function ApplicationCard({ app, onEdit, onDelete, selected, onSelect }) {
  return (
    <div className={clsx(
      'card p-5 transition-all duration-200 hover:shadow-md group',
      selected && 'ring-2 ring-brand-500'
    )}>
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onSelect(app._id)}
          className="mt-1 w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 flex-shrink-0"
        />

        {/* Company avatar */}
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          {app.company.charAt(0).toUpperCase()}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">{app.company}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{app.role}</p>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
              {app.jobUrl && (
                <a href={app.jobUrl} target="_blank" rel="noopener noreferrer"
                  className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-all">
                  <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                </a>
              )}
              <button onClick={() => onEdit(app)}
                className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-all">
                <PencilIcon className="w-4 h-4" />
              </button>
              <button onClick={() => onDelete(app._id)}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all">
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-3">
            <StatusBadge status={app.status} />
            <PriorityBadge priority={app.priority} />
            {app.location && (
              <span className="text-xs text-gray-400 dark:text-gray-500">{app.location}</span>
            )}
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
              <CalendarIcon className="w-3.5 h-3.5" />
              {formatDate(app.applicationDate)}
            </div>
            {app.deadline && (
              <span className="text-xs text-orange-500 font-medium">
                Due {formatDate(app.deadline)}
              </span>
            )}
          </div>

          {app.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {app.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-md">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
