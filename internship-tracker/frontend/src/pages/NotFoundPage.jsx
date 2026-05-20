import { Link } from 'react-router-dom';
import { HomeIcon } from '@heroicons/react/24/outline';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="text-center animate-slide-up">
        <p className="text-8xl font-black text-gradient mb-4">404</p>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Page not found</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm">
          The page you're looking for doesn't exist.
        </p>
        <Link to="/dashboard" className="btn-primary inline-flex">
          <HomeIcon className="w-4 h-4" /> Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
