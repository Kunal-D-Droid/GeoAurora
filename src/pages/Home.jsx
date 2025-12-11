import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { getApiUrl } from '../config/api';

export default function Home() {
  const [earthEvents, setEarthEvents] = useState([]);
  const [spaceWeatherEvents, setSpaceWeatherEvents] = useState([]);
  const [asteroidEvents, setAsteroidEvents] = useState([]);
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
      'Solar Energetic Particles (SEP)': '✨',
      'Near-Earth Asteroid': '🪨',
      'Hazardous Asteroid': '☄️'
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
      'Solar Energetic Particles (SEP)': 'from-pink-500/20 to-purple-500/20 border-pink-400/40',
      'Near-Earth Asteroid': 'from-gray-500/20 to-slate-500/20 border-gray-400/40',
      'Hazardous Asteroid': 'from-red-500/20 to-orange-500/20 border-red-400/40'
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
        const [eonetRes, donkiRes, neoRes] = await Promise.all([
          axios.get(getApiUrl('/api/eonet')),
          axios.get(getApiUrl('/api/donki')),
          axios.get(getApiUrl('/api/neo')),
        ]);
        const earth = eonetRes.data.events?.slice(0, 3) || [];
        const space = Array.isArray(donkiRes.data) ? donkiRes.data.slice(0, 3) : [];
        const asteroids = Array.isArray(neoRes.data) ? neoRes.data.slice(0, 3) : [];
        setEarthEvents(earth);
        setSpaceWeatherEvents(space);
        setAsteroidEvents(asteroids);
        try {
          sessionStorage.setItem('home_eonet_v1', JSON.stringify({ t: Date.now(), data: earth }));
          sessionStorage.setItem('home_donki_v1', JSON.stringify({ t: Date.now(), data: space }));
          sessionStorage.setItem('home_neo_v1', JSON.stringify({ t: Date.now(), data: asteroids }));
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
      const cachedN = sessionStorage.getItem('home_neo_v1');
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
      if (cachedN) {
        const { t, data } = JSON.parse(cachedN);
        if (Date.now() - t <= 15 * 60 * 1000) {
          setAsteroidEvents(data || []);
          seeded = true;
        } else { sessionStorage.removeItem('home_neo_v1'); }
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
      {/* Simple Header */}
      <div className="mb-8 lg:mb-10">
        <div className="flex items-center gap-4 mb-3">
          <span className="text-5xl lg:text-6xl">✨</span>
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white">
              Daily Highlights
            </h1>
            <p className="text-gray-400 text-base lg:text-lg mt-1">
              Real-time updates from NASA APIs
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[500px] relative">
          <div className="data-loader">
            <div className="data-particles">
              <div className="data-particle"></div>
              <div className="data-particle"></div>
              <div className="data-particle"></div>
              <div className="data-particle"></div>
              <div className="data-particle"></div>
              <div className="data-particle"></div>
            </div>
          </div>
          <div className="loading-text">
            <div>Fetching data from NASA APIs</div>
            <div className="loading-dots">...</div>
          </div>
          <div className="progress-steps">
            <div className="progress-step active">
              <div className="progress-step-icon">🌍</div>
              <span>EONET</span>
            </div>
            <div className="progress-step">
              <div className="progress-step-icon">☀️</div>
              <span>DONKI</span>
            </div>
            <div className="progress-step">
              <div className="progress-step-icon">🤖</div>
              <span>AI Processing</span>
            </div>
            <div className="progress-step">
              <div className="progress-step-icon">✨</div>
              <span>Complete</span>
            </div>
          </div>
          <div className="progress-container">
            <div className="progress-bar"></div>
          </div>
          <div className="data-sources">
            <div className="data-source">
              <span>🌍</span>
              <span>EONET</span>
            </div>
            <div className="data-source">
              <span>☀️</span>
              <span>DONKI</span>
            </div>
            <div className="data-source">
              <span>🤖</span>
              <span>AI Processing</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
          {/* Earth Events Panel */}
          <div className="w-full space-y-5">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <img src="/logo.png" alt="Earth Events" className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg" />
                <h2 className="text-xl lg:text-2xl font-bold text-neon-green">
                  Earth Events
                </h2>
              </div>
              <div className="h-px bg-gradient-to-r from-neon-green/50 to-transparent"></div>
            </div>
            <div className="grid grid-cols-1 gap-5">
              {earthEvents.length === 0 && (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-200">No recent Earth events available.</div>
              )}
              {earthEvents.map((event, idx) => {
                const eventType = getEventType(event);
                const icon = getEventIcon(eventType);
                const colorClass = getEventColor(eventType);
                const displayTitle = (event.title || '').length > 60 ? `${event.title.slice(0,60)}…` : (event.title || 'Event');
                const desc = (event.description || '').slice(0, 120);
                const randomImage = earthImages[idx % earthImages.length];
                
                return (
                  <div key={event.id} className={`group relative rounded-xl lg:rounded-2xl overflow-hidden border ${colorClass} bg-gray-800/50 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300`}>
                    <div className="p-4 lg:p-5">
                      {/* Event type and icon */}
                      <div className="flex items-start gap-3 mb-3">
                        <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                          <span className="text-xl">{icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm lg:text-base font-semibold text-gray-200 mb-1">{eventType}</div>
                          <div className="text-xs text-gray-400">{formatDate(event.geometry?.[0]?.date)}</div>
                        </div>
                      </div>
                      
                      {/* Title */}
                      <h3 className="text-base lg:text-lg font-bold text-white mb-2 leading-tight line-clamp-2">{displayTitle}</h3>
                      
                      {/* Description */}
                      <div className="text-sm text-gray-300 mb-4 leading-relaxed line-clamp-2">
                        {desc}{(event.description||'').length>120?'…':''}
                      </div>
                      
                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-white/5">
                        <span className="text-xs uppercase tracking-wide bg-white/5 text-gray-400 border border-white/10 px-2 py-1 rounded-full">
                          EONET
                        </span>
                        <Link 
                          to={`/event/${event.id}`} 
                          state={{ event }} 
                          className="inline-flex items-center gap-2 px-4 py-2 bg-neon-green/20 hover:bg-neon-green/30 text-neon-green font-medium text-sm rounded-lg transition-all duration-200 border border-neon-green/30 hover:border-neon-green/50"
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
          <div className="w-full space-y-5">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl lg:text-4xl">☀️</span>
                <h2 className="text-xl lg:text-2xl font-bold text-solar-yellow">
                  Space Weather
                </h2>
              </div>
              <div className="h-px bg-gradient-to-r from-solar-yellow/50 to-transparent"></div>
            </div>
            <div className="grid grid-cols-1 gap-5">
              {spaceWeatherEvents.length === 0 ? (
                <div className="rounded-xl sm:rounded-2xl border border-yellow-500/40 bg-yellow-500/10 p-4 sm:p-5 text-yellow-200">
                  <div className="flex items-start gap-3">
                    <span className="text-xl">⚠️</span>
                    <div>
                      <div className="font-semibold mb-1">NASA DONKI temporarily unavailable</div>
                      <div className="text-sm">Space weather data couldn't be fetched right now. Please try again in a few minutes.</div>
                    </div>
                  </div>
                </div>
              ) : spaceWeatherEvents.map((sw) => {
                const eventType = getEventType(sw);
                const icon = getEventIcon(eventType);
                const colorClass = getEventColor(eventType);
                const displayTitle = (sw.note || 'Space Weather Event');
                
                return (
                  <div key={sw.activityID || `${sw.startTime}|${sw.note}`} className={`group relative rounded-xl lg:rounded-2xl overflow-hidden border ${colorClass} bg-gray-800/50 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300`}>
                    <div className="p-4 lg:p-5">
                      {/* Event type and icon */}
                      <div className="flex items-start gap-3 mb-3">
                        <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                          <span className="text-xl">{icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm lg:text-base font-semibold text-gray-200 mb-1">{eventType}</div>
                          <div className="text-xs text-gray-400">{formatDate(sw.startTime)}</div>
                        </div>
                      </div>
                      
                      {/* Title */}
                      <h3 className="text-base lg:text-lg font-bold text-white mb-2 leading-tight line-clamp-2">
                        {displayTitle.length>60?displayTitle.slice(0,60)+'…':displayTitle}
                      </h3>
                      
                      {/* Summary */}
                      <div className="text-sm text-gray-300 mb-4 leading-relaxed line-clamp-2">
                        <span className="font-semibold text-aurora-purple">Summary:</span> {(sw.note || '').slice(0, 100)}{(sw.note||'').length>100?'…':''}
                      </div>
                      
                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-white/5">
                        <span className="text-xs uppercase tracking-wide bg-white/5 text-gray-400 border border-white/10 px-2 py-1 rounded-full">
                          DONKI
                        </span>
                        <Link 
                          to={`/event/${sw.activityID || 'space'}`} 
                          state={{ event: sw }} 
                          className="inline-flex items-center gap-2 px-4 py-2 bg-solar-yellow/20 hover:bg-solar-yellow/30 text-solar-yellow font-medium text-sm rounded-lg transition-all duration-200 border border-solar-yellow/30 hover:border-solar-yellow/50"
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

          {/* Asteroids Panel */}
          <div className="w-full space-y-5">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl lg:text-4xl">🪨</span>
                <h2 className="text-xl lg:text-2xl font-bold text-gray-300">
                  Asteroids
                </h2>
              </div>
              <div className="h-px bg-gradient-to-r from-gray-300/50 to-transparent"></div>
            </div>
            <div className="grid grid-cols-1 gap-5">
              {asteroidEvents.length === 0 ? (
                <div className="rounded-xl sm:rounded-2xl border border-gray-500/40 bg-gray-500/10 p-4 sm:p-5 text-gray-200">
                  <div className="flex items-start gap-3">
                    <span className="text-xl">🔍</span>
                    <div>
                      <div className="font-semibold mb-1">No asteroids approaching</div>
                      <div className="text-sm">No near-Earth asteroids in the next 7 days.</div>
                    </div>
                  </div>
                </div>
              ) : asteroidEvents.map((asteroid) => {
                const eventType = asteroid.hazardous ? 'Hazardous Asteroid' : 'Near-Earth Asteroid';
                const icon = getEventIcon(eventType);
                const colorClass = getEventColor(eventType);
                const displayTitle = (asteroid.title || 'Unknown Asteroid');
                const formatDistance = (km) => {
                  if (!km) return 'Unknown';
                  if (km >= 1000000) return `${(km / 1000000).toFixed(2)}M km`;
                  if (km >= 1000) return `${(km / 1000).toFixed(2)}K km`;
                  return `${km.toFixed(0)} km`;
                };
                const formatSize = (min, max) => {
                  if (!min || !max) return 'Unknown';
                  if (min === max) return `${min.toFixed(0)}m`;
                  return `${min.toFixed(0)}-${max.toFixed(0)}m`;
                };
                
                return (
                  <div key={asteroid.activityID || `${asteroid.startTime}|${asteroid.title}`} className={`group relative rounded-xl lg:rounded-2xl overflow-hidden border ${colorClass} bg-gray-800/50 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300`}>
                    <div className="p-4 lg:p-5">
                      {/* Event type and icon */}
                      <div className="flex items-start gap-3 mb-3">
                        <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                          <span className="text-xl">{icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm lg:text-base font-semibold text-gray-200 mb-1">{eventType}</div>
                          <div className="text-xs text-gray-400">{formatDate(asteroid.startTime)}</div>
                        </div>
                        {asteroid.hazardous && (
                          <div className="px-2 py-1 bg-red-500/20 border border-red-500/40 rounded-lg text-red-300 text-xs font-semibold">
                            ⚠️
                          </div>
                        )}
                      </div>
                      
                      {/* Title */}
                      <h3 className="text-base lg:text-lg font-bold text-white mb-3 leading-tight line-clamp-2">
                        {displayTitle.length>60?displayTitle.slice(0,60)+'…':displayTitle}
                      </h3>
                      
                      {/* Asteroid details */}
                      <div className="text-sm text-gray-300 mb-4 space-y-1.5 bg-gray-800/30 rounded-lg p-3 border border-white/5">
                        <div className="flex justify-between"><span className="text-gray-400">Size:</span> <span className="font-medium">{formatSize(asteroid.diameter_min, asteroid.diameter_max)}</span></div>
                        <div className="flex justify-between"><span className="text-gray-400">Distance:</span> <span className="font-medium">{formatDistance(asteroid.miss_distance)}</span></div>
                        <div className="flex justify-between"><span className="text-gray-400">Velocity:</span> <span className="font-medium">{asteroid.velocity?.toFixed(2) || 'Unknown'} km/s</span></div>
                      </div>
                      
                      {/* Footer */}
                      <div className="flex items-center pt-3 border-t border-white/5">
                        <span className="text-xs uppercase tracking-wide bg-white/5 text-gray-400 border border-white/10 px-2 py-1 rounded-full">
                          NEO
                        </span>
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
