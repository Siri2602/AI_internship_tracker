import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        className: 'dark:bg-gray-800 dark:text-white text-sm font-medium',
        duration: 3500,
        style: { borderRadius: '12px', padding: '12px 16px' },
      }}
    />
  </React.StrictMode>
);
