import { useEffect } from 'react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, Cell, PieChart, Pie, Legend,
} from 'recharts';
import { useAppStore } from '../context/appStore';
import { useThemeStore } from '../context/themeStore';
import { LoadingSpinner } from '../components/ui';
import { CHART_COLORS } from '../utils/constants';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function AnalyticsPage() {
  const { stats, statsLoading, fetchStats } = useAppStore();
  const { isDark } = useThemeStore();
  const dark = isDark();

  useEffect(() => { fetchStats(); }, []);

  const barData = stats?.statusBreakdown?.map((s, i) => ({
    status: s._id, count: s.count, fill: CHART_COLORS[i % CHART_COLORS.length],
  })) || [];

  const areaData = stats?.monthlyTrend?.map((m) => ({
    month: MONTHS[m._id.month - 1], count: m.count,
  })) || [];

  const priorityData = stats?.priorityBreakdown?.map((p, i) => ({
    name: p._id, value: p.count,
  })) || [];

  const tooltipStyle = { background: dark ? '#1f2937' : '#fff', border: 'none', borderRadius: 12, fontSize: 13 };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Insights into your job search</p>
      </div>

      {statsLoading ? (
        <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
      ) : (
        <>
          {/* Summary row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Applications', value: stats?.total || 0, color: 'text-brand-600' },
              { label: 'Interviews Secured', value: stats?.interviews || 0, color: 'text-purple-600' },
              { label: 'Offers Received', value: stats?.offers || 0, color: 'text-green-600' },
              { label: 'Response Rate', value: `${stats?.responseRate || 0}%`, color: 'text-orange-600' },
            ].map((item) => (
              <div key={item.label} className="card p-5 text-center">
                <p className={`text-3xl font-bold ${item.color}`}>{item.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">{item.label}</p>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Status bar */}
            <div className="card p-5">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Applications by Status</h2>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={barData} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={dark ? '#1f2937' : '#f0f0f0'} horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 12, fill: dark ? '#9ca3af' : '#6b7280' }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="status" tick={{ fontSize: 12, fill: dark ? '#9ca3af' : '#6b7280' }} axisLine={false} tickLine={false} width={90} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                    {barData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Area chart */}
            <div className="card p-5">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Monthly Trend</h2>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={areaData} margin={{ left: -20 }}>
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3461f5" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3461f5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={dark ? '#1f2937' : '#f0f0f0'} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: dark ? '#9ca3af' : '#6b7280' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: dark ? '#9ca3af' : '#6b7280' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="count" stroke="#3461f5" strokeWidth={2} fill="url(#areaGrad)" dot={{ fill: '#3461f5', r: 4 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Priority pie */}
            <div className="card p-5">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Priority Distribution</h2>
              {priorityData.length > 0 ? (
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie data={priorityData} cx="50%" cy="45%" outerRadius={90} paddingAngle={4} dataKey="value">
                      {priorityData.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend iconType="circle" iconSize={8} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-52 text-gray-400 text-sm">No data yet</div>
              )}
            </div>

            {/* Funnel-style conversion */}
            <div className="card p-5">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Application Funnel</h2>
              <div className="space-y-3 mt-2">
                {[
                  { label: 'Applied', value: stats?.total || 0, color: 'bg-brand-500', pct: 100 },
                  { label: 'Phone Screen / Interview', value: (stats?.interviews || 0), color: 'bg-purple-500', pct: stats?.total ? Math.round((stats.interviews / stats.total) * 100) : 0 },
                  { label: 'Offers', value: stats?.offers || 0, color: 'bg-green-500', pct: stats?.total ? Math.round((stats.offers / stats.total) * 100) : 0 },
                ].map((row) => (
                  <div key={row.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">{row.label}</span>
                      <span className="text-gray-900 dark:text-white font-semibold">{row.value} <span className="text-gray-400 font-normal">({row.pct}%)</span></span>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div className={`h-full ${row.color} rounded-full transition-all duration-700`} style={{ width: `${row.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
