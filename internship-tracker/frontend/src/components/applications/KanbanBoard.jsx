import clsx from 'clsx';
import { STATUS_OPTIONS, STATUS_COLORS, formatDate } from '../../utils/constants';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { PriorityBadge } from '../ui';

function KanbanCard({ app, onEdit, onDelete }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {app.company.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{app.company}</p>
          </div>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button onClick={() => onEdit(app)} className="p-1 text-gray-400 hover:text-brand-600 rounded transition-colors">
            <PencilIcon className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => onDelete(app._id)} className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors">
            <TrashIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 truncate mb-2">{app.role}</p>
      <div className="flex items-center justify-between">
        <PriorityBadge priority={app.priority} />
        <span className="text-xs text-gray-400">{formatDate(app.applicationDate)}</span>
      </div>
      {app.deadline && (
        <p className="text-xs text-orange-500 font-medium mt-1.5">Due {formatDate(app.deadline)}</p>
      )}
    </div>
  );
}

export default function KanbanBoard({ applications, onEdit, onDelete }) {
  const columns = STATUS_OPTIONS.map((status) => ({
    status,
    apps: applications.filter((a) => a.status === status),
    colors: STATUS_COLORS[status],
  }));

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columns.map(({ status, apps, colors }) => (
        <div key={status} className="flex-shrink-0 w-64">
          <div className={clsx('flex items-center justify-between px-3 py-2 rounded-xl mb-3', colors.bg)}>
            <div className="flex items-center gap-2">
              <span className={clsx('w-2 h-2 rounded-full', colors.dot)} />
              <span className={clsx('text-xs font-semibold', colors.text)}>{status}</span>
            </div>
            <span className={clsx('text-xs font-bold px-1.5 py-0.5 rounded-md', colors.bg, colors.text)}>
              {apps.length}
            </span>
          </div>
          <div className="space-y-2">
            {apps.map((app) => (
              <KanbanCard key={app._id} app={app} onEdit={onEdit} onDelete={onDelete} />
            ))}
            {apps.length === 0 && (
              <div className="h-16 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl flex items-center justify-center">
                <p className="text-xs text-gray-400">No applications</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
