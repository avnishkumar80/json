import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Defer ResizeObserver callbacks to next animation frame to avoid loop errors.
if (typeof window !== 'undefined' && window.ResizeObserver) {
  const NativeResizeObserver = window.ResizeObserver;
  window.ResizeObserver = class ResizeObserver extends NativeResizeObserver {
    constructor(callback) {
      super((entries, observer) => {
        window.requestAnimationFrame(() => {
          callback(entries, observer);
        });
      });
    }
  };
}

// Suppress ResizeObserver loop error (Chrome dev overlay)
const isResizeObserverError = (msg) =>
  msg.includes('ResizeObserver loop completed with undelivered notifications') ||
  msg.includes('ResizeObserver loop limit exceeded');

const suppressResizeObserverError = (e) => {
  const msg = e.message || (e.detail && e.detail.message) || '';
  if (isResizeObserverError(msg)) {
    e.stopImmediatePropagation();
    e.stopPropagation();
    e.preventDefault();
  }
};

// Capture phase handlers prevent CRA overlay from surfacing the error.
window.addEventListener('error', suppressResizeObserverError, true);
window.addEventListener('unhandledrejection', suppressResizeObserverError, true);
window.onerror = (message, source, lineno, colno, error) => {
  const msg = typeof message === 'string' ? message : (error && error.message) || '';
  return isResizeObserverError(msg);
};

const originalError = console.error;
console.error = (...args) => {
  const firstArg = args[0];
  const msg = typeof firstArg === 'string' ? firstArg : (firstArg && firstArg.message) || '';

  if (isResizeObserverError(msg)) {
    return;
  }
  originalError.call(console, ...args);
};

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
