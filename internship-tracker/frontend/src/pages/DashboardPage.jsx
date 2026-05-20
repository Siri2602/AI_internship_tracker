import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BriefcaseIcon, TrophyIcon, ChatBubbleLeftRightIcon,
  ArrowTrendingUpIcon, PlusIcon,
} from '@heroicons/react/24/outline';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { useAppStore } from '../context/appStore';
import { useAuthStore } from '../context/authStore';
import { useThemeStore } from '../context/themeStore';
import StatCard from '../components/dashboard/StatCard';
import UpcomingDeadlines from '../components/dashboard/UpcomingDeadlines';
import AIInsights from '../components/dashboard/AIInsights';
import { StatusBadge, LoadingSpinner } from '../components/ui';
import { CHART_COLORS, formatRelativeDate } from '../utils/constants';

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function DashboardPage() {
  const { stats, statsLoading, applications, fetchStats, fetchApplications } = useAppStore();
  const { user } = useAuthStore();
  const { isDark } = useThemeStore();
  const dark = isDark();

  useEffect(() => {
    fetchStats();
    fetchApplications();
  }, []);

  const pieData  = stats?.statusBreakdown?.map((s) => ({ name: s._id, value: s.count })) || [];
  const barData  = stats?.monthlyTrend?.map((m) => ({
    name: MONTH_NAMES[m._id.month - 1],
    Applications: m.count,
  })) || [];

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const tooltipStyle = {
    background: dark ? '#1f2937' : '#fff',
    border: 'none',
    borderRadius: 12,
    fontSize: 13,
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {greeting()}, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
            Here's your application overview
          </p>
        </div>
        <Link to="/applications" className="btn-primary flex-shrink-0">
          <PlusIcon className="w-4 h-4" /> New Application
        </Link>
      </div>

      {statsLoading ? (
        <div className="flex justify-center py-24">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Applied"  value={stats?.total      || 0} icon={BriefcaseIcon}            color="brand"  />
            <StatCard title="Interviews"     value={stats?.interviews || 0} icon={ChatBubbleLeftRightIcon}   color="purple" />
            <StatCard title="Offers"         value={stats?.offers     || 0} icon={TrophyIcon}                color="green"  />
            <StatCard title="Response Rate"  value={`${stats?.responseRate || 0}%`} icon={ArrowTrendingUpIcon} color="orange" />
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Monthly bar */}
            <div className="lg:col-span-3 card p-5">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
                Applications Over Time
              </h2>
              {barData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={dark ? '#1f2937' : '#f0f0f0'} />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: dark ? '#9ca3af' : '#6b7280' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: dark ? '#9ca3af' : '#6b7280' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="Applications" fill="#3461f5" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-52 text-gray-400 text-sm gap-2">
                  <BriefcaseIcon className="w-10 h-10 text-gray-300 dark:text-gray-600" />
                  No data yet — add your first application!
                </div>
              )}
            </div>

            {/* Donut pie */}
            <div className="lg:col-span-2 card p-5">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
                Status Breakdown
              </h2>
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%" cy="42%"
                      innerRadius={55} outerRadius={82}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((entry, i) => (
                        <Cell key={entry.name} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend
                      iconType="circle"
                      iconSize={8}
                      formatter={(v) => <span style={{ fontSize: 11 }}>{v}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-52 text-gray-400 text-sm">
                  No data yet
                </div>
              )}
            </div>
          </div>

          {/* Bottom row: recent activity | deadlines | AI insights */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent activity */}
            <div className="lg:col-span-1 card p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
                <Link to="/applications" className="text-sm text-brand-600 dark:text-brand-400 hover:underline font-medium">
                  View all →
                </Link>
              </div>
              {stats?.recentActivity?.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentActivity.map((app) => (
                    <div
                      key={app._id}
                      className="flex items-center justify-between gap-2 py-2 border-b border-gray-100 dark:border-gray-800 last:border-0"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {app.company.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{app.company}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{formatRelativeDate(app.updatedAt)}</p>
                        </div>
                      </div>
                      <StatusBadge status={app.status} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <BriefcaseIcon className="w-10 h-10 text-gray-300 dark:text-gray-600 mb-2" />
                  <p className="text-sm text-gray-400">No applications yet</p>
                </div>
              )}
            </div>

            {/* Upcoming deadlines */}
            <div className="lg:col-span-1">
              <UpcomingDeadlines applications={applications} />
            </div>

            {/* AI insights */}
            <div className="lg:col-span-1">
              <AIInsights stats={stats} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
