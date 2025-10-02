/** @jsxImportSource react */
import React from 'react';
import LylaChat from '../components/LylaChat';

const ChatPage = () => {
  const navigateTo = ((globalThis as any).navigateTo) || (() => {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <button 
            onClick={() => navigateTo('landing')}
            className="text-2xl font-bold text-white hover:text-white/90 transition"
          >
            My Inner Mirror
          </button>
          <button 
            onClick={() => navigateTo('landing')}
            className="text-white/80 hover:text-white transition"
          >
            Back to Home
          </button>
        </div>
      </nav>
      <div className="container mx-auto px-6 py-8">
        <LylaChat />
      </div>
    </div>
  );
};

export default ChatPage;