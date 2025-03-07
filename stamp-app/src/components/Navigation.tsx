'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, MessageSquare, Music, BarChart2, User } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();
  
  if (pathname === '/chat') {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/10 backdrop-blur-lg border-t border-white/10">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className={`w-14 flex flex-col items-center ${pathname === '/' ? 'text-purple-400' : 'text-gray-400'} hover:text-purple-400 transition-colors`}>
          <Home className="w-5 h-5" />
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link href="/chat" className={`w-14 flex flex-col items-center ${pathname === '/chat' ? 'text-purple-400' : 'text-gray-400'} hover:text-purple-400 transition-colors`}>
          <MessageSquare className="w-5 h-5" />
          <span className="text-xs mt-1">Chat</span>
        </Link>
        <Link href="/music" className={`w-14 flex flex-col items-center ${pathname === '/music' ? 'text-purple-400' : 'text-gray-400'} hover:text-purple-400 transition-colors`}>
          <Music className="w-5 h-5" />
          <span className="text-xs mt-1">Music</span>
        </Link>
        <Link href="/stats" className={`w-14 flex flex-col items-center ${pathname === '/stats' ? 'text-purple-400' : 'text-gray-400'} hover:text-purple-400 transition-colors`}>
          <BarChart2 className="w-5 h-5" />
          <span className="text-xs mt-1">Stats</span>
        </Link>
        <Link href="/profile" className={`w-14 flex flex-col items-center ${pathname === '/profile' ? 'text-purple-400' : 'text-gray-400'} hover:text-purple-400 transition-colors`}>
          <User className="w-5 h-5" />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </div>
    </nav>
  );
} 