import React from 'react';

export default function Toast({ toast }) {
  if (!toast.show) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-night-2 border border-gold/40 text-paper px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
      <span className="text-xl">{toast.icon || '✅'}</span>
      <span className="text-xs sm:text-sm font-bold text-paper">{toast.message}</span>
    </div>
  );
}
