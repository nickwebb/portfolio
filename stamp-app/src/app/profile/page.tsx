'use client';

import Link from 'next/link';
import { ChevronLeft, Settings, Edit2, Share2 } from 'lucide-react';

export default function ProfilePage() {
  return (
    <main className="min-h-screen pb-20">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40">
        <div className="max-w-md mx-auto">
          <div className="glass-panel px-4 h-16 flex items-center">
            <Link href="/" className="mr-4 hover:text-purple-400 transition-colors">
              <ChevronLeft className="w-6 h-6" />
            </Link>
            <h1 className="font-space font-bold text-xl flex-1">Profile</h1>
            <button className="p-2 hover:text-purple-400 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 pt-20">
        {/* Profile Header */}
        <div className="glass-panel p-6 rounded-xl text-center">
          <div className="relative inline-block">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center text-2xl font-bold mb-4 mx-auto">
              DJ
            </div>
            <button className="absolute bottom-4 right-0 p-2 bg-purple-500 rounded-full hover:bg-purple-600 transition-colors">
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
          <h2 className="text-xl font-bold mb-1">DJ Dave</h2>
          <p className="text-gray-400 text-sm mb-4">Electronic Music Producer</p>
          <button className="flex items-center justify-center space-x-2 mx-auto px-4 py-2 bg-purple-500/20 rounded-full border border-purple-500/30 hover:bg-purple-500/30 transition-colors">
            <Share2 className="w-4 h-4" />
            <span className="text-sm">Share Profile</span>
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="glass-panel p-4 rounded-xl text-center">
            <span className="block text-2xl font-bold">1.2K</span>
            <span className="text-sm text-gray-400">Stamps</span>
          </div>
          <div className="glass-panel p-4 rounded-xl text-center">
            <span className="block text-2xl font-bold">45</span>
            <span className="text-sm text-gray-400">Tracks</span>
          </div>
          <div className="glass-panel p-4 rounded-xl text-center">
            <span className="block text-2xl font-bold">89%</span>
            <span className="text-sm text-gray-400">Rating</span>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-panel p-6 rounded-xl mt-6">
          <h3 className="text-lg font-space font-bold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <p className="text-sm flex-1">Released new track "Summer Vibes"</p>
              <span className="text-xs text-gray-400">2h ago</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <p className="text-sm flex-1">Started a live stream session</p>
              <span className="text-xs text-gray-400">1d ago</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <p className="text-sm flex-1">Updated profile information</p>
              <span className="text-xs text-gray-400">3d ago</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 