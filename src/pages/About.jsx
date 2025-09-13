import React from 'react';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto p-0">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <img src="/logo.png" alt="GeoAurora" className="w-12 h-12 rounded-lg" />
        <div>
          <h1 className="text-3xl font-bold text-aurora-purple">About GeoAurora</h1>
          <p className="text-gray-400 text-base">Discover the story behind our mission</p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/90 backdrop-blur-xl rounded-2xl p-8 mb-8 border border-white/10 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.6)]">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-aurora-purple/20 rounded-xl border border-aurora-purple/40">
            <span className="text-2xl">🎯</span>
          </div>
          <h2 className="text-2xl font-bold text-white">Our Mission</h2>
        </div>
        <p className="text-lg text-gray-200 leading-relaxed">
          GeoAurora provides real-time Earth and space event monitoring with easy-to-understand explanations. Our mission is to make space and Earth science accessible and exciting for everyone.
        </p>
      </div>

      {/* Features Section */}
      <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/90 backdrop-blur-xl rounded-2xl p-8 mb-8 border border-white/10 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.6)]">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-neon-green/20 rounded-xl border border-neon-green/40">
            <span className="text-2xl">⚙️</span>
          </div>
          <h2 className="text-2xl font-bold text-white">Key Features</h2>
        </div>
        
        <div className="grid grid-cols-1 gap-4 lg:gap-6">
          <div className="bg-gray-900/50 rounded-xl p-4 lg:p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🛰️</span>
              <h3 className="text-lg font-bold text-neon-green">Real-time Data</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Stay updated with the latest Earth events and space weather information as it happens.
            </p>
          </div>
          
          <div className="bg-gray-900/50 rounded-xl p-4 lg:p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🤖</span>
              <h3 className="text-lg font-bold text-solar-yellow">Smart Explanations</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Complex scientific data is transformed into easy-to-understand summaries and interesting facts.
            </p>
          </div>
          
          <div className="bg-gray-900/50 rounded-xl p-4 lg:p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">📊</span>
              <h3 className="text-lg font-bold text-aurora-purple">Interactive Maps</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Explore events on interactive maps and discover detailed information about natural phenomena.
            </p>
          </div>
        </div>
      </div>

      {/* Why It's Cool Section */}
      <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/90 backdrop-blur-xl rounded-2xl p-8 mb-8 border border-white/10 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.6)]">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-solar-yellow/20 rounded-xl border border-solar-yellow/40">
            <span className="text-2xl">✨</span>
          </div>
          <h2 className="text-2xl font-bold text-white">Why It's Cool</h2>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <img src="/logo.png" alt="Earth" className="w-6 h-6 mt-1 rounded" />
              <div>
                <h3 className="font-semibold text-white mb-1">Stay Updated</h3>
                <p className="text-gray-300 text-sm">Get real-time updates on natural events happening around the world</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-solar-yellow text-xl mt-1">📚</span>
              <div>
                <h3 className="font-semibold text-white mb-1">Learn Space Weather</h3>
                <p className="text-gray-300 text-sm">Understand complex space weather phenomena in plain English</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-aurora-purple text-xl mt-1">💡</span>
              <div>
                <h3 className="font-semibold text-white mb-1">Discover Fun Facts</h3>
                <p className="text-gray-300 text-sm">Learn surprising "Did you know?" science facts with every event</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-neon-green text-xl mt-1">🎓</span>
              <div>
                <h3 className="font-semibold text-white mb-1">Perfect for Everyone</h3>
                <p className="text-gray-300 text-sm">Great for students, enthusiasts, or anyone curious about our planet and beyond</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Credits Section */}
      <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/90 backdrop-blur-xl rounded-2xl p-8 mb-8 border border-white/10 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.6)]">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-neon-green/20 rounded-xl border border-neon-green/40">
            <span className="text-2xl">🙏</span>
          </div>
          <h2 className="text-2xl font-bold text-white">Acknowledgments</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🌐</span>
              <div>
                <h3 className="font-semibold text-white">Data Sources</h3>
                <p className="text-gray-300 text-sm">Public scientific data sources</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-2xl">🤖</span>
              <div>
                <h3 className="font-semibold text-white">AI Technology</h3>
                <p className="text-gray-300 text-sm">Advanced AI for content enhancement</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">💻</span>
              <div>
                <h3 className="font-semibold text-white">Technology</h3>
                <p className="text-gray-300 text-sm">Modern web technologies</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-2xl">🖼️</span>
              <div>
                <h3 className="font-semibold text-white">Visual Content</h3>
                <p className="text-gray-300 text-sm">Public domain imagery</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Developer Section */}
      <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/90 backdrop-blur-xl rounded-2xl p-8 mb-8 border border-white/10 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.6)]">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-aurora-purple/20 rounded-xl border border-aurora-purple/40">
            <span className="text-2xl">👨‍💻</span>
          </div>
          <h2 className="text-2xl font-bold text-white">Developer</h2>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-gradient-to-br from-aurora-purple to-neon-green rounded-full flex items-center justify-center overflow-hidden">
            <img 
              src="/me.jpeg" 
              alt="Kunal Das" 
              className="w-full h-full object-cover rounded-full"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <span className="text-2xl font-bold text-white hidden">KD</span>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-1">Kunal Das</h3>
            <p className="text-gray-300 mb-4">Cybersecurity Researcher & Science Enthusiast</p>
            <div className="flex flex-wrap gap-3">
              <a 
                href="mailto:kunal@encryptarx.in" 
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-aurora-purple/25 to-neon-green/25 hover:from-aurora-purple/35 hover:to-neon-green/35 text-white font-semibold text-sm rounded-lg transition-all duration-300 border border-aurora-purple/40 hover:border-aurora-purple/60"
              >
                <span className="text-lg">📧</span>
                <span>Email</span>
              </a>
              <a 
                href="https://kunaldas.tech" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/25 to-purple-500/25 hover:from-blue-500/35 hover:to-purple-500/35 text-white font-semibold text-sm rounded-lg transition-all duration-300 border border-blue-500/40 hover:border-blue-500/60"
              >
                <span className="text-lg">🌐</span>
                <span>Portfolio</span>
              </a>
              <a 
                href="https://www.linkedin.com/in/kunal-das-5qe23" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600/25 to-blue-700/25 hover:from-blue-600/35 hover:to-blue-700/35 text-white font-semibold text-sm rounded-lg transition-all duration-300 border border-blue-600/40 hover:border-blue-600/60"
              >
                <span className="text-lg">💼</span>
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Project Information Section */}
      <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/90 backdrop-blur-xl rounded-2xl p-8 mb-8 border border-white/10 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.6)]">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-solar-yellow/20 rounded-xl border border-solar-yellow/40">
            <span className="text-2xl">🚀</span>
          </div>
          <h2 className="text-2xl font-bold text-white">About This Project</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-aurora-purple text-xl mt-1">🎯</span>
              <div>
                <h3 className="font-semibold text-white mb-1">Project Goal</h3>
                <p className="text-gray-300 text-sm">Making Earth and space science accessible and engaging for everyone through intuitive visualization and clear explanations.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-neon-green text-xl mt-1">⚡</span>
              <div>
                <h3 className="font-semibold text-white mb-1">Live Updates</h3>
                <p className="text-gray-300 text-sm">Stay informed about the latest Earth and space events as they happen with regular data updates.</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-solar-yellow text-xl mt-1">🤖</span>
              <div>
                <h3 className="font-semibold text-white mb-1">Smart Technology</h3>
                <p className="text-gray-300 text-sm">Advanced technology transforms complex data into easy-to-understand summaries and interesting facts.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-blue-400 text-xl mt-1">📊</span>
              <div>
                <h3 className="font-semibold text-white mb-1">Interactive Experience</h3>
                <p className="text-gray-300 text-sm">Explore events on maps, dive into detailed information, and discover the science behind natural phenomena.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="flex flex-wrap gap-4 justify-center">
            <button 
              onClick={() => window.open('mailto:kunal@encryptarx.in?subject=GeoAurora Feedback', '_blank')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-neon-green/25 to-aurora-purple/25 hover:from-neon-green/35 hover:to-aurora-purple/35 text-white font-semibold rounded-lg transition-all duration-300 border border-neon-green/40 hover:border-neon-green/60"
            >
              <span className="text-lg">💬</span>
              <span>Send Feedback</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
