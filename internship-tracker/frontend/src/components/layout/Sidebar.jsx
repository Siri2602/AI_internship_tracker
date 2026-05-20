import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  HomeIcon, BriefcaseIcon, ChartBarIcon, SparklesIcon,
  Cog6ToothIcon, ArrowRightOnRectangleIcon, Bars3Icon,
  XMarkIcon, SunIcon, MoonIcon, ComputerDesktopIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useAuthStore } from '../../context/authStore';
import { useThemeStore } from '../../context/themeStore';
import { getInitials } from '../../utils/constants';

const NAV = [
  { to: '/dashboard', icon: HomeIcon, label: 'Dashboard' },
  { to: '/applications', icon: BriefcaseIcon, label: 'Applications' },
  { to: '/analytics', icon: ChartBarIcon, label: 'Analytics' },
  { to: '/ai-tools', icon: SparklesIcon, label: 'AI Tools' },
  { to: '/settings', icon: Cog6ToothIcon, label: 'Settings' },
];

export default function Sidebar({ children }) {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
            <SparklesIcon className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-gradient">InternIQ</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
              )
            }
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Theme toggle */}
      <div className="px-3 py-2 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
          {[
            { value: 'light', icon: SunIcon },
            { value: 'system', icon: ComputerDesktopIcon },
            { value: 'dark', icon: MoonIcon },
          ].map(({ value, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setTheme(value)}
              className={clsx(
                'flex-1 flex items-center justify-center p-1.5 rounded-lg transition-all',
                theme === value
                  ? 'bg-white dark:bg-gray-700 shadow text-brand-600 dark:text-brand-400'
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              )}
            >
              <Icon className="w-4 h-4" />
            </button>
          ))}
        </div>
      </div>

      {/* User */}
      <div className="px-3 pb-4 pt-2">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <div className="w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {getInitials(user?.name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
          </div>
          <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors" title="Logout">
            <ArrowRightOnRectangleIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="relative z-50 flex flex-col w-64 bg-white dark:bg-gray-900 shadow-xl">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile topbar */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <button onClick={() => setOpen(true)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <Bars3Icon className="w-6 h-6" />
          </button>
          <span className="text-base font-bold text-gradient">InternIQ</span>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
