import { PencilIcon, TrashIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { StatusBadge, PriorityBadge } from '../ui';
import { formatDate } from '../../utils/constants';
import clsx from 'clsx';

export default function ApplicationTable({ applications, onEdit, onDelete, selectedIds, onSelect }) {
  const allSelected = applications.length > 0 && applications.every((a) => selectedIds.includes(a._id));

  const toggleAll = () => {
    if (allSelected) {
      applications.forEach((a) => selectedIds.includes(a._id) && onSelect(a._id));
    } else {
      applications.forEach((a) => !selectedIds.includes(a._id) && onSelect(a._id));
    }
  };

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
              <th className="px-4 py-3 text-left w-8">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  className="w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                />
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">Company</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">Role</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400 hidden md:table-cell">Status</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400 hidden lg:table-cell">Priority</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400 hidden lg:table-cell">Applied</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400 hidden xl:table-cell">Deadline</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400 hidden xl:table-cell">Location</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-600 dark:text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {applications.map((app) => (
              <tr
                key={app._id}
                className={clsx(
                  'hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors group',
                  selectedIds.includes(app._id) && 'bg-brand-50 dark:bg-brand-900/10'
                )}
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(app._id)}
                    onChange={() => onSelect(app._id)}
                    className="w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {app.company.charAt(0)}
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">{app.company}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300 max-w-[180px] truncate">{app.role}</td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <StatusBadge status={app.status} />
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <PriorityBadge priority={app.priority} />
                </td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400 hidden lg:table-cell whitespace-nowrap">
                  {formatDate(app.applicationDate)}
                </td>
                <td className="px-4 py-3 hidden xl:table-cell whitespace-nowrap">
                  {app.deadline ? (
                    <span className="text-orange-500 font-medium">{formatDate(app.deadline)}</span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400 hidden xl:table-cell">{app.location || '—'}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {app.jobUrl && (
                      <a
                        href={app.jobUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-all"
                      >
                        <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                      </a>
                    )}
                    <button
                      onClick={() => onEdit(app)}
                      className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-all"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(app._id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
