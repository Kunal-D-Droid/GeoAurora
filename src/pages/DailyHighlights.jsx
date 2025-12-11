import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { getApiUrl } from '../config/api';

export default function DailyHighlights() {
  const [earthEvents, setEarthEvents] = useState([]);
  const [spaceEvents, setSpaceEvents] = useState([]);
  const [summaries, setSummaries] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let intervalId;
    const fetchHighlights = async () => {
      try {
        setLoading(true);
        const [eonetRes, donkiRes] = await Promise.all([
      axios.get(getApiUrl('/api/eonet')),
      axios.get(getApiUrl('/api/donki')),
        ]);
        
      const eonetEvents = eonetRes.data.events || [];
      const donkiEvents = donkiRes.data || [];
        
        // Get top 3 from each category
        const earth = eonetEvents.slice(0, 3);
        const space = donkiEvents.slice(0, 3);
        
        setEarthEvents(earth);
        setSpaceEvents(space);
        
        // Cache the data
        try {
          sessionStorage.setItem('highlights_eonet_v1', JSON.stringify({ t: Date.now(), data: earth }));
          sessionStorage.setItem('highlights_donki_v1', JSON.stringify({ t: Date.now(), data: space }));
        } catch {}
      } catch (error) {
        console.error('Error fetching highlights:', error);
      } finally {
        setLoading(false);
      }
    };

    // Seed from cache if fresh (<=15min)
    try {
      const cachedE = sessionStorage.getItem('highlights_eonet_v1');
      const cachedD = sessionStorage.getItem('highlights_donki_v1');
      let seeded = false;
      if (cachedE) {
        const { t, data } = JSON.parse(cachedE);
        if (Date.now() - t <= 15 * 60 * 1000) {
          setEarthEvents(data || []);
          seeded = true;
        } else { sessionStorage.removeItem('highlights_eonet_v1'); }
      }
      if (cachedD) {
        const { t, data } = JSON.parse(cachedD);
        if (Date.now() - t <= 15 * 60 * 1000) {
          setSpaceEvents(data || []);
          seeded = true;
        } else { sessionStorage.removeItem('highlights_donki_v1'); }
      }
      if (seeded) {
        setLoading(false);
      }
    } catch {}
    
    fetchHighlights();
    intervalId = setInterval(fetchHighlights, 900000); // 15 minutes
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const allEvents = [...earthEvents, ...spaceEvents];
    allEvents.forEach(async (event, idx) => {
      if (!summaries[idx]) {
        try {
          const title = typeof event.title === 'string' && event.title.trim() ? event.title : (event.note || 'Event');
          const description = typeof event.description === 'string' ? event.description : undefined;
          const { data } = await axios.post(getApiUrl('/api/summary'), { title, description });
          setSummaries(s => ({ ...s, [idx]: data.summary }));
        } catch (err) {
          setSummaries(s => ({ ...s, [idx]: 'AI summary unavailable.' }));
          console.error('Summary error in DailyHighlights', idx, err);
        }
      }
    });
  }, [earthEvents, spaceEvents]);

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

  if (loading) {
    return (
      <div className="p-0">
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
            <div>Loading today's highlights</div>
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
      </div>
    );
  }

  return (
    <div className="p-0">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <span className="text-4xl">⭐</span>
        <div>
          <h2 className="text-3xl font-bold text-aurora-purple">Daily Highlights</h2>
          <p className="text-gray-400 text-base">Today's most significant Earth and Space events</p>
        </div>
      </div>

      {/* Earth Events Section */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <img src="/logo.png" alt="Earth Events" className="w-8 h-8 rounded-lg" />
          <h3 className="text-2xl font-bold text-neon-green">Earth Events</h3>
          <div className="flex-1 h-px bg-gradient-to-r from-neon-green/50 to-transparent"></div>
        </div>
        
        <div className="grid grid-cols-1 gap-4 lg:gap-6">
          {earthEvents.map((event, idx) => {
            const eventType = getEventType(event);
            const icon = getEventIcon(eventType);
            const colorClass = getEventColor(eventType);
            const summary = summaries[idx] || 'Loading summary...';
            const mainSummary = summary.includes('Fun Fact:') ? summary.split('Fun Fact:')[0].trim() : summary;
            const funFact = summary.includes('Fun Fact:') ? summary.split('Fun Fact:')[1].trim() : '';
            
            return (
              <div key={idx} className={`group relative rounded-xl lg:rounded-2xl overflow-hidden border-2 ${colorClass} bg-gradient-to-br from-gray-800/80 to-gray-900/90 backdrop-blur-xl shadow-[0_20px_40px_-12px_rgba(0,0,0,0.6)] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] transition-all duration-500`}>
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-bl from-white/5 to-transparent rounded-bl-full" />
                <div className="absolute bottom-0 left-0 w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-tr from-white/5 to-transparent rounded-tr-full" />
                
                <div className="p-4 lg:p-6 relative z-10">
                  {/* Event type and icon */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                      <span className="text-2xl">{icon}</span>
                    </div>
                    <div>
                      <div className="text-base font-semibold text-gray-300">{eventType}</div>
                      <div className="text-sm text-gray-400">{formatDate(event.geometry?.[0]?.date)}</div>
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h4 className="text-xl font-bold text-white mb-3 leading-snug">
                    {event.title || event.note || 'Earth Event'}
                  </h4>
                  
                  {/* Summary */}
                  <div className="text-base text-gray-200 mb-4 leading-relaxed">
                    {mainSummary.slice(0, 150)}{mainSummary.length > 150 ? '...' : ''}
                  </div>
                  
                  {/* Fun fact */}
                  {funFact && (
                    <div className="p-3 bg-gradient-to-r from-green-500/15 to-emerald-500/15 rounded-xl border border-green-400/30 mb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">💡</span>
                        <span className="text-sm font-bold text-green-300">Did You Know?</span>
                      </div>
                      <div className="text-sm text-green-100 italic">
                        {funFact.slice(0, 120)}{funFact.length > 120 ? '...' : ''}
                      </div>
                    </div>
                  )}
                  
                  {/* Learn more button */}
                  <Link
                    to={`/event/${event.id || idx}`}
                    state={{ event: { ...event, summary: mainSummary, fact: funFact } }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-neon-green/25 to-aurora-purple/25 hover:from-neon-green/35 hover:to-aurora-purple/35 text-white font-semibold text-base rounded-lg transition-all duration-300 border border-neon-green/40 hover:border-neon-green/60"
                  >
                    <span>Explore</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Space Events Section */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl">☀️</span>
          <h3 className="text-2xl font-bold text-solar-yellow">Space Weather</h3>
          <div className="flex-1 h-px bg-gradient-to-r from-solar-yellow/50 to-transparent"></div>
        </div>
        
        <div className="grid grid-cols-1 gap-4 lg:gap-6">
          {spaceEvents.map((event, idx) => {
            const eventType = getEventType(event);
            const icon = getEventIcon(eventType);
            const colorClass = getEventColor(eventType);
            const summary = summaries[earthEvents.length + idx] || 'Loading summary...';
            const mainSummary = summary.includes('Fun Fact:') ? summary.split('Fun Fact:')[0].trim() : summary;
            const funFact = summary.includes('Fun Fact:') ? summary.split('Fun Fact:')[1].trim() : '';

  return (
              <div key={idx} className={`group relative rounded-2xl overflow-hidden border-2 ${colorClass} bg-gradient-to-br from-gray-800/80 to-gray-900/90 backdrop-blur-xl shadow-[0_20px_40px_-12px_rgba(0,0,0,0.6)] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] transition-all duration-500`}>
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/5 to-transparent rounded-bl-full" />
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-white/5 to-transparent rounded-tr-full" />
                
                <div className="p-6 relative z-10">
                  {/* Event type and icon */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                      <span className="text-2xl">{icon}</span>
                    </div>
                    <div>
                      <div className="text-base font-semibold text-gray-300">{eventType}</div>
                      <div className="text-sm text-gray-400">{formatDate(event.startTime)}</div>
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h4 className="text-xl font-bold text-white mb-3 leading-snug">
                    {event.note || event.title || 'Space Weather Event'}
                  </h4>
                  
                  {/* Summary */}
                  <div className="text-base text-gray-200 mb-4 leading-relaxed">
                    {mainSummary.slice(0, 150)}{mainSummary.length > 150 ? '...' : ''}
                  </div>
                  
                  {/* Fun fact */}
                  {funFact && (
                    <div className="p-3 bg-gradient-to-r from-green-500/15 to-emerald-500/15 rounded-xl border border-green-400/30 mb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">💡</span>
                        <span className="text-sm font-bold text-green-300">Did You Know?</span>
                      </div>
                      <div className="text-sm text-green-100 italic">
                        {funFact.slice(0, 120)}{funFact.length > 120 ? '...' : ''}
                      </div>
                    </div>
                  )}
                  
                  {/* Learn more button */}
                  <Link
                    to={`/event/${event.activityID || idx}`}
                    state={{ event: { ...event, summary: mainSummary, fact: funFact } }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-solar-yellow/25 to-aurora-purple/25 hover:from-solar-yellow/35 hover:to-aurora-purple/35 text-white font-semibold text-base rounded-lg transition-all duration-300 border border-solar-yellow/40 hover:border-solar-yellow/60"
                  >
                    <span>Explore</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
