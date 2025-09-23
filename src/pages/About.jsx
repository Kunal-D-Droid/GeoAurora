import React from 'react';
import BuyMeCoffeeButton from '../components/BuyMeCoffeeButton';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto p-0">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <img src="/logo.png" alt="GeoAurora" className="w-12 h-12 rounded-lg" />
        <div>
          <h1 className="text-4xl font-bold text-aurora-purple">About GeoAurora</h1>
          <p className="text-gray-400 text-lg">Discover the story behind our mission</p>
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
        <p className="text-lg text-gray-200 leading-relaxed mb-4">
          GeoAurora is an free and open-source platform that provides real-time Earth and space event monitoring with easy-to-understand explanations. Our mission is to make space and Earth science accessible and exciting for everyone, from curious students to professional researchers.
        </p>
        <p className="text-base text-gray-300 leading-relaxed">
          Built with modern web technologies and powered by NASA's open data APIs, GeoAurora transforms complex scientific data into beautiful, interactive visualizations that help people understand the dynamic relationship between our planet and space.
        </p>
      </div>

      {/* Features Section */}
      <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/90 backdrop-blur-xl rounded-2xl p-8 mb-8 border border-white/10 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.6)]">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-neon-green/20 rounded-xl border border-neon-green/40">
            <span className="text-2xl">⚙️</span>
          </div>
          <h2 className="text-3xl font-bold text-white">Key Features</h2>
        </div>
        
        <div className="grid grid-cols-1 gap-4 lg:gap-6">
          <div className="bg-gray-900/50 rounded-xl p-4 lg:p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🛰️</span>
              <h3 className="text-xl font-bold text-neon-green">Real-time Data</h3>
            </div>
            <p className="text-gray-300 text-base leading-relaxed">
              Stay updated with the latest Earth events and space weather information as it happens.
            </p>
          </div>
          
          <div className="bg-gray-900/50 rounded-xl p-4 lg:p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🤖</span>
              <h3 className="text-xl font-bold text-solar-yellow">Smart Explanations</h3>
            </div>
            <p className="text-gray-300 text-base leading-relaxed">
              Complex scientific data is transformed into easy-to-understand summaries and interesting facts.
            </p>
          </div>
          
          <div className="bg-gray-900/50 rounded-xl p-4 lg:p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">📊</span>
              <h3 className="text-xl font-bold text-aurora-purple">Interactive Maps</h3>
            </div>
            <p className="text-gray-300 text-base leading-relaxed">
              Explore events on interactive maps and discover detailed information about natural phenomena.
            </p>
          </div>
        </div>
      </div>

      {/* Open Source Section */}
      <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/90 backdrop-blur-xl rounded-2xl p-8 mb-8 border border-white/10 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.6)]">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-neon-green/20 rounded-xl border border-neon-green/40">
            <span className="text-2xl">🔓</span>
          </div>
          <h2 className="text-3xl font-bold text-white">Open Source & Technology</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-gray-900/50 rounded-xl p-4 border border-white/10">
              <h3 className="text-xl font-bold text-neon-green mb-3">🌐 Open Source</h3>
              <p className="text-gray-300 text-base leading-relaxed mb-3">
                GeoAurora is completely free and available for everyone. We believe in transparency, community collaboration, and making science accessible to everyone.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-neon-green/20 text-neon-green text-xs rounded-full border border-neon-green/40">MIT License</span>
                <span className="px-3 py-1 bg-aurora-purple/20 text-aurora-purple text-xs rounded-full border border-aurora-purple/40">Community Driven</span>
                <span className="px-3 py-1 bg-solar-yellow/20 text-solar-yellow text-xs rounded-full border border-solar-yellow/40">Free to Use</span>
              </div>
            </div>
            
            <div className="bg-gray-900/50 rounded-xl p-4 border border-white/10">
              <h3 className="text-xl font-bold text-solar-yellow mb-3">⚡ Tech Stack</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-300">• React 18</div>
                <div className="text-gray-300">• FastAPI</div>
                <div className="text-gray-300">• Python 3.12</div>
                <div className="text-gray-300">• Tailwind CSS</div>
                <div className="text-gray-300">• Leaflet Maps</div>
                <div className="text-gray-300">• Redis Cache</div>
                <div className="text-gray-300">• NASA APIs</div>
                <div className="text-gray-300">• Gemini AI</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-gray-900/50 rounded-xl p-4 border border-white/10">
              <h3 className="text-xl font-bold text-aurora-purple mb-3">📊 Data Sources</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-blue-400">🌍</span>
                  <span className="text-gray-300 text-base">NASA EONET - Earth events</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400">☀️</span>
                  <span className="text-gray-300 text-base">NASA DONKI - Space weather</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">🤖</span>
                  <span className="text-gray-300 text-base">Google Gemini - AI explanations</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-400">🗄️</span>
                  <span className="text-gray-300 text-base">Redis - Real-time caching</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-900/50 rounded-xl p-4 border border-white/10">
              <h3 className="text-xl font-bold text-blue-400 mb-3">🚀 Deployment</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-blue-400">☁️</span>
                  <span className="text-gray-300 text-base">Google Cloud Run</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-purple-400">📦</span>
                  <span className="text-gray-300 text-base">Docker containers</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">🔄</span>
                  <span className="text-gray-300 text-base">CI/CD with Cloud Build</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </div>

      {/* Why It's Cool Section */}
      <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/90 backdrop-blur-xl rounded-2xl p-8 mb-8 border border-white/10 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.6)]">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-solar-yellow/20 rounded-xl border border-solar-yellow/40">
            <span className="text-2xl">✨</span>
          </div>
          <h2 className="text-3xl font-bold text-white">Why It's Cool</h2>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <img src="/logo.png" alt="Earth" className="w-6 h-6 mt-1 rounded" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Stay Updated</h3>
                <p className="text-gray-300 text-base">Get real-time updates on natural events happening around the world</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-solar-yellow text-xl mt-1">📚</span>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Learn Space Weather</h3>
                <p className="text-gray-300 text-base">Understand complex space weather phenomena in plain English</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-aurora-purple text-xl mt-1">💡</span>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Discover Fun Facts</h3>
                <p className="text-gray-300 text-base">Learn surprising "Did you know?" science facts with every event</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-neon-green text-xl mt-1">🎓</span>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Perfect for Everyone</h3>
                <p className="text-gray-300 text-base">Great for students, enthusiasts, or anyone curious about our planet and beyond</p>
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
          <h2 className="text-3xl font-bold text-white">Acknowledgments</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🌐</span>
              <div>
                <h3 className="text-lg font-semibold text-white">Data Sources</h3>
                <p className="text-gray-300 text-base">Public scientific data sources</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-2xl">🤖</span>
              <div>
                <h3 className="text-lg font-semibold text-white">AI Technology</h3>
                <p className="text-gray-300 text-base">Advanced AI for content enhancement</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">💻</span>
              <div>
                <h3 className="text-lg font-semibold text-white">Technology</h3>
                <p className="text-gray-300 text-base">Modern web technologies</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-2xl">🖼️</span>
              <div>
                <h3 className="text-lg font-semibold text-white">Visual Content</h3>
                <p className="text-gray-300 text-base">Public domain imagery</p>
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
                href="mailto:kunal.das@encryptarx.in" 
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

      {/* Support Section */}
      <div className="bg-gradient-to-br from-yellow-800/40 to-orange-800/40 backdrop-blur-xl rounded-2xl p-8 mb-8 border border-yellow-400/30 shadow-[0_20px_40px_-12px_rgba(251,191,36,0.3)]">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-yellow-500/20 rounded-xl border border-yellow-400/40">
            <span className="text-2xl">☕</span>
          </div>
          <h2 className="text-3xl font-bold text-white">Support the Project</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-yellow-400 text-xl mt-1">💰</span>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Ongoing Costs</h3>
                <p className="text-gray-200 text-base">Running GeoAurora requires continuous investment in cloud services, AI APIs, and data processing to keep the platform live and updated.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-orange-400 text-xl mt-1">🔄</span>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Real-time Data</h3>
                <p className="text-gray-200 text-base">24/7 monitoring and processing of NASA data streams, AI content generation, and global CDN distribution.</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-green-400 text-xl mt-1">🌍</span>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Free for Everyone</h3>
                <p className="text-gray-200 text-base">GeoAurora remains completely free and open-source. Your support helps maintain this service for the global community.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-blue-400 text-xl mt-1">🚀</span>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Future Development</h3>
                <p className="text-gray-200 text-base">Support enables new features, better AI explanations, and expanded data sources for an even better experience.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-500/10 rounded-xl p-6 border border-yellow-400/30">
          <div className="text-center">
            <h3 className="text-xl font-bold text-white mb-3">Help Keep GeoAurora Running</h3>
            <p className="text-gray-200 mb-4">Every contribution, no matter how small, helps cover the operational costs and keeps this educational platform free for everyone.</p>
            <div className="flex justify-center">
              <BuyMeCoffeeButton variant="about" />
            </div>
            <p className="text-sm text-gray-300 mt-3">Thank you for supporting open science and education! 🙏</p>
          </div>
        </div>
      </div>

      {/* Project Information Section */}
      <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/90 backdrop-blur-xl rounded-2xl p-8 mb-8 border border-white/10 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.6)]">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-solar-yellow/20 rounded-xl border border-solar-yellow/40">
            <span className="text-2xl">🚀</span>
          </div>
          <h2 className="text-3xl font-bold text-white">About This Project</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-aurora-purple text-xl mt-1">🎯</span>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Project Goal</h3>
                <p className="text-gray-300 text-base">Making Earth and space science accessible and engaging for everyone through intuitive visualization and clear explanations.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-neon-green text-xl mt-1">⚡</span>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Live Updates</h3>
                <p className="text-gray-300 text-base">Stay informed about the latest Earth and space events as they happen with regular data updates.</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-solar-yellow text-xl mt-1">🤖</span>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Smart Technology</h3>
                <p className="text-gray-300 text-base">Advanced technology transforms complex data into easy-to-understand summaries and interesting facts.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-blue-400 text-xl mt-1">📊</span>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Interactive Experience</h3>
                <p className="text-gray-300 text-base">Explore events on maps, dive into detailed information, and discover the science behind natural phenomena.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="flex flex-wrap gap-4 justify-center">
            <button 
              onClick={() => window.open('https://qldw8mkew9h.typeform.com/to/QISwIHz5', '_blank')}
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
