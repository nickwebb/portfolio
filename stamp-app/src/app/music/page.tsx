'use client';

import Link from 'next/link';
import { ChevronLeft, Play, Clock, Heart } from 'lucide-react';

export default function MusicPage() {
  const tracks = [
    {
      id: 1,
      title: 'Summer Vibes',
      artist: 'DJ Dave',
      duration: '3:45',
      plays: 1234,
      artwork: 'https://images.unsplash.com/photo-1535478044878-3ed83d5456ef?w=300&h=300&q=80',
      genre: 'House',
    },
    {
      id: 2,
      title: 'Night Drive',
      artist: 'DJ Dave',
      duration: '4:20',
      plays: 987,
      artwork: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&h=300&q=80',
      genre: 'Electronic',
    },
    {
      id: 3,
      title: 'Chill Wave',
      artist: 'DJ Dave',
      duration: '3:15',
      plays: 2341,
      artwork: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&h=300&q=80',
      genre: 'Ambient',
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
            <h1 className="font-space font-bold text-xl flex-1">Music</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-purple-400">3 tracks</span>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Track */}
      <div className="max-w-md mx-auto px-4 pt-20">
        <div className="glass-panel rounded-2xl overflow-hidden mb-6">
          <div className="relative aspect-[2/1] overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&h=400&q=80" 
              alt="Featured track"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
              <div className="flex items-center w-full">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-1">Latest Release</h2>
                  <p className="text-sm text-gray-300">Check out the newest tracks</p>
                </div>
                <button className="p-4 bg-purple-500 rounded-full hover:bg-purple-600 transition-colors">
                  <Play className="w-6 h-6" fill="currentColor" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Track List */}
        <div className="space-y-4">
          {tracks.map((track) => (
            <div key={track.id} className="glass-panel p-4 rounded-xl hover:bg-white/5 transition-colors group">
              <div className="flex items-center space-x-4">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                  <img 
                    src={track.artwork} 
                    alt={track.title}
                    className="w-full h-full object-cover"
                  />
                  <button className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-8 h-8" fill="currentColor" />
                  </button>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium group-hover:text-purple-400 transition-colors">{track.title}</h3>
                  <p className="text-sm text-gray-400">{track.artist} • {track.genre}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <span className="block text-sm text-gray-400">{track.plays.toLocaleString()} plays</span>
                    <div className="flex items-center space-x-1 text-sm text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>{track.duration}</span>
                    </div>
                  </div>
                  <button className="p-2 hover:text-purple-400 transition-colors">
                    <Heart className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
} 