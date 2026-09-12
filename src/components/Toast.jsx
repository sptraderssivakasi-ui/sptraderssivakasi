import React from 'react';

export default function Toast({ toast }) {
  if (!toast.show) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-night-2/95 backdrop-blur-xl border border-gold/40 text-white px-5 py-3.5 rounded-2xl shadow-glow-gold flex items-center gap-3 animate-slideUp">
      <span className="text-xl shrink-0">{toast.icon || '✅'}</span>
      <span className="text-xs sm:text-sm font-bold text-white tracking-wide">{toast.message}</span>
    </div>
  );
}
