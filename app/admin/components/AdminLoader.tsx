import React from 'react';

export default function AdminLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[350px] gap-3">
      <div className="w-8 h-8 border-4 border-slate-200 border-t-[#6366f1] rounded-full animate-spin"></div>
      <span className="text-xs font-bold text-slate-500 font-sans tracking-wide animate-pulse">Loading...</span>
    </div>
  );
}
