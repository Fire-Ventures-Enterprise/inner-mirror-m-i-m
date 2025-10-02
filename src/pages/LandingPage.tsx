/** @jsxImportSource react */
import React from 'react';

const LandingPage = () => {
  const navigateTo = ((globalThis as any).navigateTo) || (() => {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16">
        <nav className="flex justify-between items-center mb-16">
          <h1 className="text-3xl font-bold text-white">My Inner Mirror</h1>
          <div className="space-x-6">
            <button onClick={() => navigateTo('chat')} className="text-white/80 hover:text-white transition">
              Chat with Lyla
            </button>
            <a href="#about" className="text-white/80 hover:text-white transition">About</a>
            <a href="#features" className="text-white/80 hover:text-white transition">Features</a>
            <a href="#contact" className="text-white/80 hover:text-white transition">Contact</a>
          </div>
        </nav>

        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Discover Your Inner Self with AI
          </h2>
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto">
            Meet Lyla, your compassionate AI companion for emotional growth, self-discovery, and mental wellness. 
            Start your journey towards a better understanding of yourself.
          </p>
          
          <div className="flex gap-4 justify-center mb-16">
            <button 
              onClick={() => navigateTo('chat')}
              className="px-8 py-4 bg-white text-purple-900 rounded-full font-semibold text-lg hover:bg-white/90 transition transform hover:scale-105"
            >
              Start Chatting Free
            </button>
            <a 
              href="#features"
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold text-lg hover:bg-white/10 transition"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Features Grid */}
        <div id="features" className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-24">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 hover:bg-white/20 transition">
            <div className="text-4xl mb-4">🧠</div>
            <h3 className="text-2xl font-bold text-white mb-3">AI-Powered Insights</h3>
            <p className="text-white/80">
              Advanced AI technology that understands and responds to your emotional needs with empathy and intelligence.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 hover:bg-white/20 transition">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-2xl font-bold text-white mb-3">Complete Privacy</h3>
            <p className="text-white/80">
              Your conversations are secure and private. We prioritize your confidentiality and data protection.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 hover:bg-white/20 transition">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-2xl font-bold text-white mb-3">Personal Growth</h3>
            <p className="text-white/80">
              Daily prompts, reflection exercises, and personalized guidance to help you grow emotionally and mentally.
            </p>
          </div>
        </div>

        {/* Testimonial Section */}
        <div className="max-w-4xl mx-auto mt-24 text-center">
          <h3 className="text-3xl font-bold text-white mb-8">What People Are Saying</h3>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8">
            <p className="text-xl text-white/90 italic mb-4">
              "Lyla has been a game-changer for my mental health journey. It's like having a therapist available 24/7."
            </p>
            <p className="text-white/70">- Sarah M., Early User</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-24">
          <h3 className="text-3xl font-bold text-white mb-6">Ready to Begin Your Journey?</h3>
          <button 
            onClick={() => navigateTo('chat')}
            className="inline-block px-12 py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold text-xl hover:from-purple-700 hover:to-pink-700 transition transform hover:scale-105"
          >
            Talk to Lyla Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;