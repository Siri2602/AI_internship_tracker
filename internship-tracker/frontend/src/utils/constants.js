export const STATUS_OPTIONS = [
  'Wishlist',
  'Applied',
  'Phone Screen',
  'Interview',
  'Offer',
  'Rejected',
  'Withdrawn',
];

export const PRIORITY_OPTIONS = ['Low', 'Medium', 'High'];

export const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Remote', 'Hybrid', 'On-site'];

export const EMAIL_TEMPLATE_TYPES = [
  { value: 'follow-up', label: 'Follow-Up Email' },
  { value: 'thank-you', label: 'Thank You Email' },
  { value: 'networking', label: 'Networking Outreach' },
  { value: 'referral-request', label: 'Referral Request' },
  { value: 'withdraw', label: 'Withdraw Application' },
];

export const STATUS_COLORS = {
  Wishlist:      { bg: 'bg-gray-100 dark:bg-gray-800',    text: 'text-gray-600 dark:text-gray-400',   dot: 'bg-gray-400'   },
  Applied:       { bg: 'bg-blue-50 dark:bg-blue-950',     text: 'text-blue-600 dark:text-blue-400',   dot: 'bg-blue-500'   },
  'Phone Screen':{ bg: 'bg-purple-50 dark:bg-purple-950', text: 'text-purple-600 dark:text-purple-400', dot: 'bg-purple-500' },
  Interview:     { bg: 'bg-yellow-50 dark:bg-yellow-950', text: 'text-yellow-600 dark:text-yellow-400', dot: 'bg-yellow-500' },
  Offer:         { bg: 'bg-green-50 dark:bg-green-950',   text: 'text-green-600 dark:text-green-400',  dot: 'bg-green-500'  },
  Rejected:      { bg: 'bg-red-50 dark:bg-red-950',       text: 'text-red-600 dark:text-red-400',      dot: 'bg-red-500'    },
  Withdrawn:     { bg: 'bg-orange-50 dark:bg-orange-950', text: 'text-orange-600 dark:text-orange-400', dot: 'bg-orange-500' },
};

export const PRIORITY_COLORS = {
  Low:    { bg: 'bg-gray-100 dark:bg-gray-800',  text: 'text-gray-600 dark:text-gray-400'  },
  Medium: { bg: 'bg-blue-50 dark:bg-blue-950',   text: 'text-blue-600 dark:text-blue-400'  },
  High:   { bg: 'bg-red-50 dark:bg-red-950',     text: 'text-red-600 dark:text-red-400'    },
};

export const CHART_COLORS = ['#3461f5', '#6366f1', '#a855f7', '#ec4899', '#f59e0b', '#10b981', '#ef4444'];

export const formatDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const formatRelativeDate = (date) => {
  if (!date) return '—';
  const d = new Date(date);
  const now = new Date();
  const diffMs = now - d;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
  return `${Math.floor(diffDays / 365)}y ago`;
};

export const getInitials = (name) =>
  name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?';
