'use client';

import React, { useEffect } from 'react';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Add dark mode class to html element
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <React.StrictMode>
      <div className="min-h-screen bg-gradient-to-b from-neutral-900 to-black text-white antialiased overflow-x-hidden dark:bg-black dark:text-white">
        <div className="fixed inset-0 bg-gradient-radial from-purple-500/20 via-transparent to-transparent opacity-50 pointer-events-none" />
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </React.StrictMode>
  );
} 