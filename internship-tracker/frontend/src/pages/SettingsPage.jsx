import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../context/authStore';
import { useThemeStore } from '../context/themeStore';
import api from '../utils/api';
import { getInitials } from '../utils/constants';

export default function SettingsPage() {
  const { user, updateProfile } = useAuthStore();
  const { theme, setTheme } = useThemeStore();

  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [profileLoading, setProfileLoading] = useState(false);
  const [passLoading, setPassLoading] = useState(false);

  const setProfileField = (f) => (e) => setProfile((p) => ({ ...p, [f]: e.target.value }));
  const setPassField = (f) => (e) => setPasswords((p) => ({ ...p, [f]: e.target.value }));

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    const result = await updateProfile({ name: profile.name });
    setProfileLoading(false);
    if (result.success) toast.success('Profile updated!');
    else toast.error(result.message);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    setPassLoading(true);
    try {
      await api.put('/auth/password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      toast.success('Password changed!');
      setPasswords({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6 animate-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Manage your account preferences</p>
      </div>

      {/* Profile */}
      <div className="card p-6">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-5">Profile</h2>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold">
            {getInitials(user?.name)}
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">{user?.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
          </div>
        </div>
        <form onSubmit={handleProfileSave} className="space-y-4">
          <div>
            <label className="label">Full Name</label>
            <input className="input" value={profile.name} onChange={setProfileField('name')} required />
          </div>
          <div>
            <label className="label">Email Address</label>
            <input className="input" value={profile.email} disabled className="input opacity-60 cursor-not-allowed" />
            <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
          </div>
          <button type="submit" disabled={profileLoading} className="btn-primary">
            {profileLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Appearance */}
      <div className="card p-6">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-5">Appearance</h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: 'light', label: 'Light', emoji: '☀️' },
            { value: 'system', label: 'System', emoji: '💻' },
            { value: 'dark', label: 'Dark', emoji: '🌙' },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setTheme(opt.value)}
              className={`p-4 rounded-xl border-2 text-center transition-all ${
                theme === opt.value
                  ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="text-2xl mb-1">{opt.emoji}</div>
              <p className={`text-sm font-medium ${theme === opt.value ? 'text-brand-600 dark:text-brand-400' : 'text-gray-600 dark:text-gray-400'}`}>
                {opt.label}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Password */}
      <div className="card p-6">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-5">Change Password</h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="label">Current Password</label>
            <input type="password" className="input" value={passwords.currentPassword} onChange={setPassField('currentPassword')} required />
          </div>
          <div>
            <label className="label">New Password</label>
            <input type="password" className="input" value={passwords.newPassword} onChange={setPassField('newPassword')} required minLength={6} />
          </div>
          <div>
            <label className="label">Confirm New Password</label>
            <input type="password" className="input" value={passwords.confirm} onChange={setPassField('confirm')} required />
          </div>
          <button type="submit" disabled={passLoading} className="btn-primary">
            {passLoading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* Danger zone */}
      <div className="card p-6 border-red-200 dark:border-red-900">
        <h2 className="text-base font-semibold text-red-600 dark:text-red-400 mb-2">Danger Zone</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Deleting your account will permanently remove all your application data. This cannot be undone.
        </p>
        <button className="btn-danger" onClick={() => toast.error('Please contact support to delete your account.')}>
          Delete Account
        </button>
      </div>
    </div>
  );
}
