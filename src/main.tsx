import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';


// Global Client Exceptional Error Safeguards
window.addEventListener('unhandledrejection', (event) => {
  const reasonStr = String(event.reason?.message || event.reason || '');
  if (reasonStr.includes('WebSocket') || reasonStr.includes('vite') || reasonStr.includes('closed without opened')) {
    event.preventDefault();
    return;
  }
  console.warn('[Aurelius Client Safeguard] Handled Async Promise Rejection:', event.reason);
  event.preventDefault();
});

window.addEventListener('error', (event) => {
  const msg = String(event.error?.message || event.message || '');
  if (msg.includes('WebSocket') || msg.includes('vite')) {
    event.preventDefault();
    return;
  }
  console.warn('[Aurelius Client Safeguard] Handled Window Runtime Error:', event.error || event.message);
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

// Register Service Worker for offline PWA installation only in production
if ('serviceWorker' in navigator) {
  if (import.meta.env.DEV) {
    // In dev mode, unregister any active service workers so preview loads cleanly
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister();
      }
    });
  } else {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').then(
        (reg) => {
          console.log('Aurelius Swarm ServiceWorker registered:', reg.scope);
        },
        (err) => {
          console.warn('ServiceWorker registration error:', err);
        }
      );
    });
  }
}
