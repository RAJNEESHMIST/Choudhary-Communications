import { useState, useCallback } from 'react';

// Context for toast notifications
export const ToastContext = { listeners: [] };

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now();
    const toast = { id, message, type };

    setToasts((prev) => [...prev, toast]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, showToast, removeToast };
}

export default function Toast({ message, type = 'success', onClose }) {
  const bgColor = {
    success: 'bg-emerald-500',
    error: 'bg-red-500',
    warning: 'bg-amber-500',
    info: 'bg-blue-500'
  }[type] || 'bg-slate-500';

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };

  return (
    <div
      className={`${bgColor} fixed right-4 top-4 animate-in slide-in-from-top flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg`}
    >
      <span className="text-lg">{icons[type]}</span>
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-75">
        ✕
      </button>
    </div>
  );
}

export function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex flex-col gap-2 p-4">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
        </div>
      ))}
    </div>
  );
}
