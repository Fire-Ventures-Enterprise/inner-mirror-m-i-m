import React from 'react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
      <div className="text-center text-white p-8">
        <h1 className="text-5xl font-bold mb-4">My Inner Mirror</h1>
        <p className="text-xl mb-8">Your AI companion for self-discovery and emotional growth</p>
        <div className="space-y-4">
          <button className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-opacity-90 transition">
            Get Started
          </button>
          <p className="text-sm opacity-80">Meet Lyla, your personal AI companion</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;