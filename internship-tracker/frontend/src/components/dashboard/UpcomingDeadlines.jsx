import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BellAlertIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { formatDate } from '../../utils/constants';

export default function UpcomingDeadlines({ applications = [] }) {
  const upcoming = useMemo(() => {
    const now = new Date();
    const soon = new Date();
    soon.setDate(soon.getDate() + 14); // next 14 days

    return applications
      .filter(
        (a) =>
          a.deadline &&
          new Date(a.deadline) >= now &&
          new Date(a.deadline) <= soon &&
          !['Rejected', 'Withdrawn', 'Offer'].includes(a.status)
      )
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
      .slice(0, 5);
  }, [applications]);

  const urgency = (deadline) => {
    const days = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
    if (days <= 2) return { label: `${days}d left`, cls: 'text-red-500 bg-red-50 dark:bg-red-900/20' };
    if (days <= 7) return { label: `${days}d left`, cls: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20' };
    return { label: `${days}d left`, cls: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' };
  };

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BellAlertIcon className="w-5 h-5 text-orange-500" />
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Upcoming Deadlines</h2>
          {upcoming.length > 0 && (
            <span className="badge bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
              {upcoming.length}
            </span>
          )}
        </div>
        <Link to="/applications" className="text-sm text-brand-600 dark:text-brand-400 hover:underline font-medium">
          View all →
        </Link>
      </div>

      {upcoming.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <CalendarDaysIcon className="w-10 h-10 text-gray-300 dark:text-gray-600 mb-2" />
          <p className="text-sm text-gray-400 dark:text-gray-500">No deadlines in the next 14 days</p>
        </div>
      ) : (
        <div className="space-y-2">
          {upcoming.map((app) => {
            const { label, cls } = urgency(app.deadline);
            return (
              <div
                key={app._id}
                className="flex items-center justify-between gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {app.company.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{app.company}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{app.role}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className={clsx('text-xs font-semibold px-2 py-0.5 rounded-full', cls)}>{label}</span>
                  <span className="text-xs text-gray-400">{formatDate(app.deadline)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
