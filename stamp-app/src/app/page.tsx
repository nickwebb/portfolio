'use client';

import { Fragment } from 'react';
import Navigation from '@/components/Navigation';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function Home() {
  return (
    <Fragment>
      <ErrorBoundary fallback={<div className="text-red-500 p-4">Something went wrong</div>}>
        <main className="min-h-screen relative bg-black text-white">
          {/* Background Pattern */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-1/2 -right-1/2 w-[100rem] h-[100rem] opacity-30">
              <div className="absolute inset-0 bg-gradient-conic from-purple-500/30 via-transparent to-transparent animate-spin-slow" style={{ clipPath: 'polygon(50% 50%, 100% 0, 100% 100%)' }} />
            </div>
            <div className="absolute w-full h-full bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.1),transparent_50%)]" />
          </div>

          <div className="max-w-md mx-auto px-4 pt-20 relative">
            {/* Animated Waveform */}
            <div className="relative h-32 mb-8 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center gap-1">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-purple-400/30 rounded-full animate-waveform"
                    style={{
                      height: `${Math.sin((i / 20) * Math.PI) * 60 + 20}%`,
                      animationDelay: `${i * 0.1}s`
                    }}
                  />
                ))}
              </div>
              <h1 className="font-space text-4xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent relative z-10">
                Stamp
              </h1>
            </div>

            <div className="space-y-6">
              <div className="glass-panel p-6 rounded-2xl transform hover:scale-[1.02] transition-transform">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-space font-bold mb-1">Welcome Back</h2>
                    <p className="text-gray-400">Connect with your favorite artists and fellow music lovers.</p>
                  </div>
                </div>
              </div>
              
              <div className="glass-panel p-6 rounded-2xl transform hover:scale-[1.02] transition-transform">
                <h3 className="text-lg font-space font-bold mb-4 text-purple-400 flex items-center">
                  <span className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </span>
                  Your Latest Activity
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 group">
                    <div className="w-2 h-2 bg-purple-500 rounded-full group-hover:scale-125 transition-transform"></div>
                    <p className="text-sm flex-1 group-hover:text-purple-400 transition-colors">DJ Dave posted a new track</p>
                    <span className="text-xs text-gray-400">Just now</span>
                  </div>
                  <div className="flex items-center space-x-4 group">
                    <div className="relative w-2 h-2">
                      <div className="absolute inset-0 bg-red-400 rounded-full animate-ping opacity-75"></div>
                      <div className="relative w-2 h-2 bg-red-500 rounded-full group-hover:scale-125 transition-transform"></div>
                    </div>
                    <p className="text-sm flex-1 group-hover:text-purple-400 transition-colors flex items-center">
                      Live stream starting in 2 hours
                      <span className="ml-2 text-xs font-medium text-red-400 bg-red-400/10 px-2 py-0.5 rounded-full">LIVE</span>
                    </p>
                    <span className="text-xs text-gray-400">1h ago</span>
                  </div>
                  <div className="flex items-center space-x-4 group">
                    <div className="w-2 h-2 bg-purple-500 rounded-full group-hover:scale-125 transition-transform"></div>
                    <p className="text-sm flex-1 group-hover:text-purple-400 transition-colors">3 new messages in chat</p>
                    <span className="text-xs text-gray-400">2h ago</span>
                  </div>
                </div>
              </div>

              <div className="glass-panel p-6 rounded-2xl transform hover:scale-[1.02] transition-transform">
                <h3 className="text-lg font-space font-bold mb-4 text-purple-400 flex items-center">
                  <span className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </span>
                  Coming Up
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 group">
                    <div className="w-2 h-2 bg-purple-500 rounded-full group-hover:scale-125 transition-transform"></div>
                    <div className="flex-1">
                      <p className="text-sm group-hover:text-purple-400 transition-colors">AMA with DJ Dave</p>
                      <p className="text-xs text-gray-400">Tomorrow, 7:00 PM</p>
                    </div>
                    <span className="text-xs text-purple-400 font-medium hover:bg-purple-500/10 px-3 py-1 rounded-full cursor-pointer transition-all hover:scale-105">Join</span>
                  </div>
                  <div className="flex items-center space-x-4 group">
                    <div className="w-2 h-2 bg-purple-500 rounded-full group-hover:scale-125 transition-transform"></div>
                    <div className="flex-1">
                      <p className="text-sm group-hover:text-purple-400 transition-colors">New Music Friday</p>
                      <p className="text-xs text-gray-400">Friday, 12:00 PM</p>
                    </div>
                    <span className="text-xs text-purple-400 font-medium hover:bg-purple-500/10 px-3 py-1 rounded-full cursor-pointer transition-all hover:scale-105">Remind me</span>
                  </div>
                  <div className="flex items-center space-x-4 group">
                    <div className="w-2 h-2 bg-purple-500 rounded-full group-hover:scale-125 transition-transform"></div>
                    <div className="flex-1">
                      <p className="text-sm group-hover:text-purple-400 transition-colors">Producer Showcase</p>
                      <p className="text-xs text-gray-400">Next Week</p>
                    </div>
                    <span className="text-xs text-purple-400 font-medium hover:bg-purple-500/10 px-3 py-1 rounded-full cursor-pointer transition-all hover:scale-105">RSVP</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Navigation />
        </main>
      </ErrorBoundary>
    </Fragment>
  );
}
