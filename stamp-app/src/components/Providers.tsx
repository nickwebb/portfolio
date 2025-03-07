'use client';

import React from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <React.StrictMode>
      {children}
    </React.StrictMode>
  );
} 