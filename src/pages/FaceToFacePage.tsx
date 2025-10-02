import React from 'react';

const FaceToFacePage = () => {
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
      
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8">
            Face-to-Face with Lyla
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-12">
            Experience revolutionary AI therapy with real-time emotion detection and natural conversation
          </p>
          
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-12 mb-8">
            <div className="text-6xl mb-6">🎥</div>
            <h2 className="text-3xl font-bold text-white mb-4">Video Experience Coming Soon</h2>
            <p className="text-white/80 text-lg mb-8">
              Our revolutionary face-to-face video therapy with emotion detection is in development. 
              For now, enjoy our powerful text-based chat with Lyla.
            </p>
            <button 
              onClick={() => navigateTo('chat')}
              className="px-8 py-4 bg-white text-purple-900 rounded-full font-semibold text-lg hover:bg-white/90 transition transform hover:scale-105"
            >
              Try Text Chat Instead
            </button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
              <div className="text-3xl mb-3">👁️</div>
              <h3 className="text-xl font-bold text-white mb-2">Emotion Detection</h3>
              <p className="text-white/80">Real-time facial expression analysis</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
              <div className="text-3xl mb-3">💬</div>
              <h3 className="text-xl font-bold text-white mb-2">Natural Conversation</h3>
              <p className="text-white/80">Face-to-face like a real friend</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="text-xl font-bold text-white mb-2">Emotional Intelligence</h3>
              <p className="text-white/80">Responses tailored to your state</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaceToFacePage;