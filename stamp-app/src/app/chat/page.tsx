'use client';

import { useState } from 'react';
import { Send, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

const ChatPage = () => {
  const [messages] = useState([
    {
      id: 1,
      sender: 'Fan #001',
      content: 'Love the new demo! When\'s the next live stream?',
      timestamp: '2:30 PM',
      isArtist: false,
    },
    {
      id: 2,
      sender: 'DJ Dave',
      content: 'Thanks! Planning one for next Friday. Early stamp holders get first access as always! 🎵',
      timestamp: '2:32 PM',
      isArtist: true,
    },
    {
      id: 3,
      sender: 'Fan #042',
      content: 'That bass line in the second track is insane! 🔥',
      timestamp: '2:35 PM',
      isArtist: false,
    },
  ]);

  return (
    <main className="min-h-screen pb-20">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40">
        <div className="max-w-md mx-auto">
          <div className="glass-panel px-4 h-16 flex items-center">
            <Link href="/" className="mr-4 hover:text-purple-400 transition-colors">
              <ChevronLeft className="w-6 h-6" />
            </Link>
            <h1 className="font-space font-bold text-xl flex-1">Chat</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-purple-400">50 stamp holders</span>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="max-w-md mx-auto px-4 pt-20">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.isArtist ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.isArtist
                    ? 'bg-purple-500 bg-opacity-20 border border-purple-500/30'
                    : 'bg-white/5 border border-white/10'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className={`text-sm ${
                    message.isArtist ? 'text-purple-400' : 'text-gray-400'
                  }`}>
                    {message.sender}
                  </span>
                  <span className="text-xs text-gray-500">{message.timestamp}</span>
                </div>
                <p className="mt-1">{message.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Message Input */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <div className="max-w-md mx-auto">
          <div className="glass-panel px-4 py-3">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Message your stamp holders..."
                className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
              <button className="bg-purple-500 hover:bg-purple-600 transition-colors rounded-full p-2">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ChatPage; 