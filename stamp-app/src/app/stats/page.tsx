'use client';

import Link from 'next/link';
import { ChevronLeft, Users, PlayCircle, TrendingUp, Clock } from 'lucide-react';

export default function StatsPage() {
  const stats = [
    {
      id: 1,
      label: 'Total Stamp Holders',
      value: '1,234',
      change: '+12%',
      icon: Users,
    },
    {
      id: 2,
      label: 'Total Plays',
      value: '45.2K',
      change: '+8%',
      icon: PlayCircle,
    },
    {
      id: 3,
      label: 'Average Listen Time',
      value: '4:32',
      change: '+15%',
      icon: Clock,
    },
    {
      id: 4,
      label: 'Engagement Rate',
      value: '87%',
      change: '+5%',
      icon: TrendingUp,
    },
  ];

  return (
    <main className="min-h-screen pb-20">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40">
        <div className="max-w-md mx-auto">
          <div className="glass-panel px-4 h-16 flex items-center">
            <Link href="/" className="mr-4 hover:text-purple-400 transition-colors">
              <ChevronLeft className="w-6 h-6" />
            </Link>
            <h1 className="font-space font-bold text-xl flex-1">Stats</h1>
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="max-w-md mx-auto px-4 pt-20">
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.id} className="glass-panel p-4 rounded-xl">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Icon className="w-5 h-5 text-purple-400" />
                  </div>
                  <span className="text-sm text-gray-400">{stat.label}</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold">{stat.value}</span>
                  <span className="text-sm text-green-400">{stat.change}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Growth Chart */}
        <div className="glass-panel p-6 rounded-xl mt-6">
          <h3 className="text-lg font-space font-bold mb-4">Growth Over Time</h3>
          <div className="h-48 flex items-end justify-between">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="w-4 bg-purple-500/20 rounded-t-sm" style={{
                height: `${Math.random() * 60 + 20}%`,
              }}>
                <div 
                  className="w-full bg-purple-500 rounded-t-sm transition-all duration-500"
                  style={{
                    height: `${Math.random() * 100}%`,
                  }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-400">
            <span>Jan</span>
            <span>Dec</span>
          </div>
        </div>
      </div>
    </main>
  );
} 