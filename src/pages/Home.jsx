import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Home() {
  const [earthEvents, setEarthEvents] = useState([]);
  const [spaceWeatherEvents, setSpaceWeatherEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const seededRef = useRef(false);

  // Simple imagery set for Earth event thumbnails
  const earthImages = [
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=60',
    'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=60',
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=60',
    'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=60',
  ];

  const getEventType = (event) => {
    if (event.category) return event.category;
    const text = `${event.title || ''} ${event.description || ''}`.toLowerCase();
    if (/wildfire|fire/.test(text)) return 'Wildfire';
    if (/earthquake|seismic/.test(text)) return 'Earthquake';
    if (/cyclone|hurricane|typhoon|storm/.test(text)) return 'Tropical Cyclone';
    if (/volcano|eruption/.test(text)) return 'Volcanic Activity';
    if (/flood|flooding/.test(text)) return 'Flood';
    return 'Earth Event';
  };

  const getEventIcon = (eventType) => {
    const icons = {
      'Wildfire': '🔥',
      'Earthquake': '🌍',
      'Tropical Cyclone': '🌀',
      'Volcanic Activity': '🌋',
      'Flood': '💧',
      'Coronal Mass Ejection (CME)': '☀️',
      'Solar Flare': '⚡',
      'High-speed Solar Wind / Coronal Hole': '🌪️',
      'Solar Energetic Particles (SEP)': '✨'
    };
    return icons[eventType] || '🌍';
  };

  const getEventColor = (eventType) => {
    const colors = {
      'Wildfire': 'from-orange-500/20 to-red-500/20 border-orange-400/40',
      'Earthquake': 'from-gray-500/20 to-slate-500/20 border-gray-400/40',
      'Tropical Cyclone': 'from-blue-500/20 to-cyan-500/20 border-blue-400/40',
      'Volcanic Activity': 'from-red-500/20 to-orange-500/20 border-red-400/40',
      'Flood': 'from-blue-500/20 to-indigo-500/20 border-blue-400/40',
      'Coronal Mass Ejection (CME)': 'from-purple-500/20 to-blue-500/20 border-purple-400/40',
      'Solar Flare': 'from-yellow-500/20 to-orange-500/20 border-yellow-400/40',
      'High-speed Solar Wind / Coronal Hole': 'from-cyan-500/20 to-blue-500/20 border-cyan-400/40',
      'Solar Energetic Particles (SEP)': 'from-pink-500/20 to-purple-500/20 border-pink-400/40'
    };
    return colors[eventType] || 'from-gray-500/20 to-slate-500/20 border-gray-400/40';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recent';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Recent';
    }
  };

  useEffect(() => {
    let intervalId;
    const fetchData = async () => {
      try {
        if (!seededRef.current) {
          setLoading(true);
        }
        const [eonetRes, donkiRes] = await Promise.all([
          axios.get('https://geoaurora-backend-432163986190.asia-south1.run.app/api/eonet'),
          axios.get('https://geoaurora-backend-432163986190.asia-south1.run.app/api/donki'),
        ]);
        const earth = eonetRes.data.events?.slice(0, 3) || [];
        const space = Array.isArray(donkiRes.data) ? donkiRes.data.slice(0, 3) : [];
        setEarthEvents(earth);
        setSpaceWeatherEvents(space);
        try {
          sessionStorage.setItem('home_eonet_v1', JSON.stringify({ t: Date.now(), data: earth }));
          sessionStorage.setItem('home_donki_v1', JSON.stringify({ t: Date.now(), data: space }));
        } catch {}
      } catch (err) {
        console.error('Home fetch error', err);
      } finally {
        setLoading(false);
      }
    };
    // Seed from cache if fresh (<=15min)
    try {
      const cachedE = sessionStorage.getItem('home_eonet_v1');
      const cachedD = sessionStorage.getItem('home_donki_v1');
      let seeded = false;
      if (cachedE) {
        const { t, data } = JSON.parse(cachedE);
        if (Date.now() - t <= 15 * 60 * 1000) {
          setEarthEvents(data || []);
          seeded = true;
        } else { sessionStorage.removeItem('home_eonet_v1'); }
      }
      if (cachedD) {
        const { t, data } = JSON.parse(cachedD);
        if (Date.now() - t <= 15 * 60 * 1000) {
          setSpaceWeatherEvents(data || []);
          seeded = true;
        } else { sessionStorage.removeItem('home_donki_v1'); }
      }
      if (seeded) {
        seededRef.current = true;
        setLoading(false);
      }
    } catch {}
    fetchData();
    intervalId = setInterval(fetchData, 900000); // 15 minutes
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="p-0">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <span className="text-4xl">✔️</span>
        <div>
          <h1 className="text-3xl font-bold text-aurora-purple">What's today?</h1>
          <p className="text-gray-400 text-sm">Overview of recent Earth and Space events</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-3 text-gray-300">
            <div className="loader"></div>
            <span className="text-lg">dashboard...</span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Earth Events Panel */}
          <div className="w-full">
            <div className="flex items-center gap-3 mb-4 lg:mb-6">
              <img src="/logo.png" alt="Earth Events" className="w-6 h-6 lg:w-8 lg:h-8 rounded-lg" />
              <h2 className="text-lg lg:text-xl font-bold text-neon-green">Earth Events</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-neon-green/50 to-transparent"></div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {earthEvents.map((event, idx) => {
                const eventType = getEventType(event);
                const icon = getEventIcon(eventType);
                const colorClass = getEventColor(eventType);
                const displayTitle = (event.title || '').length > 60 ? `${event.title.slice(0,60)}…` : (event.title || 'Event');
                const desc = (event.description || '').slice(0, 120);
                
                return (
                  <div key={event.id} className={`group relative rounded-xl lg:rounded-2xl overflow-hidden border-2 ${colorClass} bg-gradient-to-br from-gray-800/80 to-gray-900/90 backdrop-blur-xl shadow-[0_20px_40px_-12px_rgba(0,0,0,0.6)] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] transition-all duration-500`}>
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-bl from-white/5 to-transparent rounded-bl-full" />
                    <div className="absolute bottom-0 left-0 w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-tr from-white/5 to-transparent rounded-tr-full" />
                    
                    <div className="p-4 lg:p-5 relative z-10">
                      {/* Event type and icon */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                          <span className="text-xl">{icon}</span>
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-300">{eventType}</div>
                          <div className="text-xs text-gray-400">{formatDate(event.geometry?.[0]?.date)}</div>
                        </div>
                      </div>
                      
                      {/* Title */}
                      <h3 className="text-base lg:text-lg font-bold text-white mb-2 leading-snug">{displayTitle}</h3>
                      
                      {/* Description */}
                      <div className="text-sm lg:text-sm text-gray-200 mb-3 leading-relaxed">
                        {desc}{(event.description||'').length>120?'…':''}
                      </div>
                      
                      {/* Footer */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs uppercase tracking-wide bg-white/5 text-gray-300 border border-white/10 px-2 py-1 rounded-full">EONET</span>
                        <Link 
                          to={`/event/${event.id}`} 
                          state={{ event }} 
                          className="inline-flex items-center gap-2 px-3 lg:px-4 py-2 bg-gradient-to-r from-neon-green/25 to-aurora-purple/25 hover:from-neon-green/35 hover:to-aurora-purple/35 text-white font-semibold text-xs lg:text-sm rounded-lg transition-all duration-300 border border-neon-green/40 hover:border-neon-green/60 min-h-[44px]"
                        >
                          <span>Explore</span>
                          <span>→</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Space Weather Panel */}
          <div className="w-full">
            <div className="flex items-center gap-3 mb-4 lg:mb-6">
              <span className="text-xl lg:text-2xl">☀️</span>
              <h2 className="text-lg lg:text-xl font-bold text-solar-yellow">Space Weather</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-solar-yellow/50 to-transparent"></div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {spaceWeatherEvents.length === 0 ? (
                <div className="text-gray-400 text-center py-8">No space weather events available.</div>
              ) : spaceWeatherEvents.map((sw) => {
                const eventType = getEventType(sw);
                const icon = getEventIcon(eventType);
                const colorClass = getEventColor(eventType);
                const displayTitle = (sw.note || 'Space Weather Event');
                
                return (
                  <div key={sw.activityID || `${sw.startTime}|${sw.note}`} className={`group relative rounded-2xl overflow-hidden border-2 ${colorClass} bg-gradient-to-br from-gray-800/80 to-gray-900/90 backdrop-blur-xl shadow-[0_20px_40px_-12px_rgba(0,0,0,0.6)] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] transition-all duration-500`}>
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-white/5 to-transparent rounded-bl-full" />
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-white/5 to-transparent rounded-tr-full" />
                    
                    <div className="p-5 relative z-10">
                      {/* Event type and icon */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                          <span className="text-xl">{icon}</span>
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-300">{eventType}</div>
                          <div className="text-xs text-gray-400">{formatDate(sw.startTime)}</div>
                        </div>
                      </div>
                      
                      {/* Title */}
                      <h3 className="text-lg font-bold text-white mb-2 leading-snug">
                        {displayTitle.length>60?displayTitle.slice(0,60)+'…':displayTitle}
                      </h3>
                      
                      {/* Summary */}
                      <div className="text-sm text-gray-200 mb-3 leading-relaxed">
                        <span className="font-semibold text-aurora-purple">Summary:</span> {(sw.note || '').slice(0, 100)}{(sw.note||'').length>100?'…':''}
                      </div>
                      
                      {/* Footer */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs uppercase tracking-wide bg-white/5 text-gray-300 border border-white/10 px-2 py-1 rounded-full">DONKI</span>
                        <Link 
                          to={`/event/${sw.activityID || 'space'}`} 
                          state={{ event: sw }} 
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-solar-yellow/25 to-aurora-purple/25 hover:from-solar-yellow/35 hover:to-aurora-purple/35 text-white font-semibold text-sm rounded-lg transition-all duration-300 border border-solar-yellow/40 hover:border-solar-yellow/60"
                        >
                          <span>Explore</span>
                          <span>→</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
