import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import EventCard from '../components/EventCard';
import ResponsiveMapView from '../components/ResponsiveMapView';

export default function EarthEvents() {
  const [events, setEvents] = useState([]);
  const [summaries, setSummaries] = useState({});
  const [autoDescriptions, setAutoDescriptions] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  // Event type configurations with enhanced visual styling
  const eventTypeConfig = {
    'Wildfire': {
      gradient: 'from-orange-900/40 via-red-800/30 to-yellow-900/40',
      borderColor: 'border-orange-400/70',
      hoverShadow: 'hover:shadow-[0_0_30px_rgba(251,146,60,0.6),0_25px_50px_-12px_rgba(251,146,60,0.4)]',
      icon: '🔥',
      bgPattern: 'bg-[radial-gradient(ellipse_at_top_right,rgba(251,146,60,0.2),transparent_50%),radial-gradient(ellipse_at_center,rgba(239,68,68,0.1),transparent_70%)]',
      cardStyle: 'ring-2 ring-orange-400/40 shadow-[0_0_20px_rgba(251,146,60,0.3)]'
    },
    'Earthquake': {
      gradient: 'from-gray-900/40 via-slate-800/30 to-zinc-900/40',
      borderColor: 'border-gray-400/70',
      hoverShadow: 'hover:shadow-[0_0_30px_rgba(156,163,175,0.6),0_25px_50px_-12px_rgba(156,163,175,0.4)]',
      icon: '🌍',
      bgPattern: 'bg-[radial-gradient(ellipse_at_center,rgba(156,163,175,0.2),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(107,114,128,0.1),transparent_60%)]',
      cardStyle: 'ring-2 ring-gray-400/40 shadow-[0_0_20px_rgba(156,163,175,0.3)]'
    },
    'Tropical Cyclone': {
      gradient: 'from-blue-900/40 via-cyan-800/30 to-teal-900/40',
      borderColor: 'border-blue-400/70',
      hoverShadow: 'hover:shadow-[0_0_30px_rgba(59,130,246,0.6),0_25px_50px_-12px_rgba(59,130,246,0.4)]',
      icon: '🌀',
      bgPattern: 'bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.2),transparent_50%),radial-gradient(ellipse_at_top_left,rgba(6,182,212,0.1),transparent_60%)]',
      cardStyle: 'ring-2 ring-blue-400/40 shadow-[0_0_20px_rgba(59,130,246,0.3)]'
    },
    'Volcanic Activity': {
      gradient: 'from-red-900/40 via-orange-800/30 to-yellow-900/40',
      borderColor: 'border-red-400/70',
      hoverShadow: 'hover:shadow-[0_0_30px_rgba(239,68,68,0.6),0_25px_50px_-12px_rgba(239,68,68,0.4)]',
      icon: '🌋',
      bgPattern: 'bg-[radial-gradient(ellipse_at_bottom_right,rgba(239,68,68,0.2),transparent_50%),radial-gradient(ellipse_at_center,rgba(251,146,60,0.1),transparent_70%)]',
      cardStyle: 'ring-2 ring-red-400/40 shadow-[0_0_20px_rgba(239,68,68,0.3)]'
    },
    'Flood': {
      gradient: 'from-blue-900/40 via-indigo-800/30 to-purple-900/40',
      borderColor: 'border-blue-400/70',
      hoverShadow: 'hover:shadow-[0_0_30px_rgba(59,130,246,0.6),0_25px_50px_-12px_rgba(59,130,246,0.4)]',
      icon: '💧',
      bgPattern: 'bg-[radial-gradient(ellipse_at_top_left,rgba(59,130,246,0.2),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(99,102,241,0.1),transparent_60%)]',
      cardStyle: 'ring-2 ring-blue-400/40 shadow-[0_0_20px_rgba(59,130,246,0.3)]'
    },
    'Landslide': {
      gradient: 'from-amber-900/40 via-yellow-800/30 to-orange-900/40',
      borderColor: 'border-amber-400/70',
      hoverShadow: 'hover:shadow-[0_0_30px_rgba(245,158,11,0.6),0_25px_50px_-12px_rgba(245,158,11,0.4)]',
      icon: '⛰️',
      bgPattern: 'bg-[radial-gradient(ellipse_at_bottom_left,rgba(245,158,11,0.2),transparent_50%),radial-gradient(ellipse_at_center,rgba(251,191,36,0.1),transparent_70%)]',
      cardStyle: 'ring-2 ring-amber-400/40 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
    }
  };

  // Detect event type from title and description
  const getEventType = (event) => {
    const text = `${event.title || ''} ${event.description || ''}`.toLowerCase();
    if (/wildfire|fire/.test(text)) return 'Wildfire';
    if (/earthquake|seismic|quake/.test(text)) return 'Earthquake';
    if (/cyclone|hurricane|typhoon|storm/.test(text)) return 'Tropical Cyclone';
    if (/volcano|eruption|volcanic/.test(text)) return 'Volcanic Activity';
    if (/flood|flooding/.test(text)) return 'Flood';
    if (/landslide|slide/.test(text)) return 'Landslide';
    return 'Wildfire'; // Default fallback
  };

  // Deduplication for fun facts
  const isDuplicateFact = (fact) => {
    if (!fact || fact.length < 20) return true;
    
    // Normalize fact for comparison
    const normalized = fact.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    
    // Check for generic phrases
    const genericPhrases = [
      'wildfires are caused by',
      'satellites orbit earth',
      'earthquakes are caused by',
      'this is a common',
      'this type of event',
      'these events typically',
      'this phenomenon occurs',
      'this is an example of',
      'wildfire is a natural',
      'satellite is an artificial'
    ];
    
    return genericPhrases.some(phrase => normalized.includes(phrase));
  };

  // Poll /api/eonet every 15 minutes (900,000 ms) for realtime updates
  useEffect(() => {
    let intervalId;
    const fetchEvents = () => {
      setRefreshing(true);
      axios.get('https://geoaurora-backend-432163986190.asia-south1.run.app/api/eonet').then(res => {
        // Fetch more events (e.g., 30) to ensure we can display 15 valid ones
        setEvents((prevEvents) => {
          const newEvents = res.data.events || [];
          // If the new events are different, update; else, keep previous
          if (JSON.stringify(prevEvents.map(e => e.id)) !== JSON.stringify(newEvents.map(e => e.id))) {
            const next = newEvents.slice(0, 30); // fetch more for filtering
            try { sessionStorage.setItem('eonet_cache_v1', JSON.stringify({ t: Date.now(), data: next })); } catch {}
            return next;
          }
          return prevEvents;
        });
      }).finally(() => setRefreshing(false));
    };
    // Seed from cache if fresh (<=15min)
    try {
      const cached = sessionStorage.getItem('eonet_cache_v1');
      if (cached) {
        const { t, data } = JSON.parse(cached);
        if (Date.now() - t <= 15 * 60 * 1000) {
          setEvents(data || []);
        } else {
          sessionStorage.removeItem('eonet_cache_v1');
        }
      }
    } catch {}
    fetchEvents();
    intervalId = setInterval(fetchEvents, 900000); // 15 min
    return () => clearInterval(intervalId);
  }, []);


  useEffect(() => {
    // Only summarize the first 30 events with a valid, non-empty string title
    // Seed summaries from cache
    try {
      const cachedSumm = sessionStorage.getItem('eonet_summaries_v1');
      if (cachedSumm) {
        const obj = JSON.parse(cachedSumm);
        setSummaries(prev => ({ ...obj, ...prev }));
      }
    } catch {}
    events.slice(0, 30).forEach(async (event) => {
      const validTitle = typeof event.title === 'string' && event.title.trim().length > 0;
      if (!summaries[event.id] && validTitle) {
        try {
          const { title } = event;
          // Only send description if it's a string, else undefined
          const description = typeof event.description === 'string' ? event.description : undefined;
          const { data } = await axios.post('https://geoaurora-backend-432163986190.asia-south1.run.app/api/summary', { title, description });
          setSummaries(s => {
            const next = { ...s, [event.id]: data.summary };
            try { sessionStorage.setItem('eonet_summaries_v1', JSON.stringify(next)); } catch {}
            return next;
          });
        } catch (err) {
          setSummaries(s => {
            const next = { ...s, [event.id]: 'AI summary unavailable.' };
            try { sessionStorage.setItem('eonet_summaries_v1', JSON.stringify(next)); } catch {}
            return next;
          });
          console.error('Summary error for event', event.id, err);
        }
      } else if (!validTitle) {
        console.warn('Skipping event with invalid title:', event);
      }
    });
  }, [events]);

  // Auto-enrich sparse descriptions with backend + session cache
  useEffect(() => {
    events.slice(0, 30).forEach(async (event) => {
      const id = event.id || '';
      const baseDesc = typeof event.description === 'string' ? event.description : '';
      const short = !baseDesc || baseDesc.trim().length < 40;
      if (!short) return;
      if (autoDescriptions[id]) return;
      const cacheKey = `auto_enrich:${id.toLowerCase()}`;
      try {
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed?.description) {
            setAutoDescriptions(s => ({ ...s, [id]: parsed.description }));
            return;
          }
        }
      } catch {}
      try {
        const { data } = await axios.post('https://geoaurora-backend-432163986190.asia-south1.run.app/api/auto_enrich', {
          id,
          title: event.title,
          description: baseDesc || undefined,
        });
        if (data?.description) {
          setAutoDescriptions(s => ({ ...s, [id]: data.description }));
          try { sessionStorage.setItem(cacheKey, JSON.stringify({ description: data.description })); } catch {}
        }
      } catch (e) {
        // ignore
      }
    });
  }, [events]);

  // Image helper: per-event Unsplash source by category/title, cached in session
  const getEventImage = (event, idx) => {
    const id = event.id || `idx-${idx}`;
    const cacheKey = `img:${id}`;
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) return cached;
    } catch {}
    const text = `${event.category || ''} ${event.title || ''}`.toLowerCase();
    let topic = 'earth nature';
    if (/wildfire|fire/.test(text)) topic = 'wildfire fire forest';
    else if (/earthquake|seismic|quake/.test(text)) topic = 'earthquake fault tectonic';
    else if (/volcan/.test(text)) topic = 'volcano eruption lava';
    else if (/storm|cyclone|hurricane|typhoon/.test(text)) topic = 'storm clouds lightning';
    else if (/flood/.test(text)) topic = 'flood river overflow';
    else if (/landslide/.test(text)) topic = 'landslide mountain debris';
    // Use Unsplash source endpoint (no API key) with query and a stable seed param
    const seed = encodeURIComponent(id.toLowerCase());
    const url = `https://source.unsplash.com/featured/800x400/?${encodeURIComponent(topic)}&sig=${seed}`;
    try { sessionStorage.setItem(cacheKey, url); } catch {}
    return url;
  };

  return (
    <div className="p-0">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Earth Events" className="w-12 h-12 rounded-lg" />
          <h2 className="text-3xl font-bold text-aurora-purple">Earth Events</h2>
        </div>
        {refreshing && (
          <div className="flex items-center gap-2 text-gray-300">
            <div className="loader"></div>
            <span className="text-sm">latest events…</span>
          </div>
        )}
      </div>
      {/* Cache freshness */}
      <div className="mb-4 text-sm text-gray-400">
        Updated {(() => {
          try {
            const cached = sessionStorage.getItem('eonet_cache_v1');
            if (cached) {
              const { t } = JSON.parse(cached);
              const mins = Math.floor((Date.now() - t) / 60000);
              return `${mins} minute${mins !== 1 ? 's' : ''} ago`;
            }
          } catch {}
          return 'just now';
        })()}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {(() => {
          const seenFunFacts = new Set();
          const genericPhrases = [
            'cm es can travel at speeds',
            'solar flares are as explosive',
            'geomagnetic storm',
            'wildfires can create their own weather',
            'typhoons can reach wind speeds'
          ];
          return events.slice(0, 30).map((event, idx) => {
          let summary = summaries[event.id];
          const unprofessionalPhrases = [
            "i'm sorry",
            "i am sorry",
            "as an ai",
            "as a language model",
            "missing information",
            "insufficient information",
            "not enough information",
            "unable to provide",
            "cannot provide",
            "no information available",
            "no data available",
            "unavailable",
            "i do not have",
            "i don't have",
            "i cannot",
            "i can't",
            "apologize",
            "AI summary unavailable."
          ];
          const isUnprofessional =
            typeof summary === 'string' &&
            unprofessionalPhrases.some(phrase => summary.toLowerCase().includes(phrase));
          const hasValidSummary = summary && summary !== 'Loading summary...' && !isUnprofessional;
          // Try to split on 'Fun Fact:'
          let mainSummary = '', funFact = '';
          if (hasValidSummary) {
            [mainSummary, funFact] = summary.split(/Fun Fact:/);
          }
          let displayFunFact = '';
          if (funFact) {
            const norm = funFact.toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').trim();
            const isGeneric = genericPhrases.some(p => norm.includes(p));
            const isDuplicate = norm && seenFunFacts.has(norm);
            const isDuplicateByNewLogic = isDuplicateFact(funFact);
            if (!isGeneric && !isDuplicate && !isDuplicateByNewLogic) {
              displayFunFact = funFact.trim();
              seenFunFacts.add(norm);
            }
          }
          // Find source link (first link in sources array, fallback to NASA EONET event page)
          let sourceUrl = '';
          if (event.sources && event.sources.length > 0 && event.sources[0].url) {
            sourceUrl = event.sources[0].url;
          } else if (event.id) {
            sourceUrl = `https://eonet.gsfc.nasa.gov/event/${event.id.replace('EONET_', '')}`;
          }
          const displayTitle = (event.title || '').length > 90 ? `${event.title.slice(0, 90)}…` : (event.title || 'Event');
          const cleanText = (t = '') => {
            return (t || '')
              .replace(/null Miles[^,]*,?/gi, '')
              .replace(/\bnull\b/gi, '')
              .replace(/\s{2,}/g, ' ')
              .replace(/^[,\s]+|[,\s]+$/g, '')
              .trim();
          };

          const cleanedDesc = cleanText(autoDescriptions[event.id] || event.description || '');

          // Get event type and configuration
          const eventType = getEventType(event);
          const config = eventTypeConfig[eventType] || eventTypeConfig['Wildfire'];
          
          // Do not skip; if no text yet, show a lightweight placeholder
          return (
            <div key={event.id} className={`group relative rounded-3xl flex flex-col overflow-hidden border-2 ${config.borderColor} ${config.cardStyle} bg-gradient-to-br ${config.gradient} backdrop-blur-xl shadow-[0_20px_40px_-12px_rgba(0,0,0,0.6)] ${config.hoverShadow} transition-all duration-700`}>
              {/* Enhanced background pattern */}
              <div className={`absolute inset-0 ${config.bgPattern} opacity-60`} />
              
              {/* Decorative corner elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/5 to-transparent rounded-bl-full" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/5 to-transparent rounded-tr-full" />
              
              <div className="relative h-48 w-full overflow-hidden">
                <ResponsiveMapView events={[event]} heightClass="h-48" zoom={3} className="!rounded-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/95 via-gray-900/40 to-transparent" />
                
                {/* Enhanced event type badge */}
                <div className="absolute top-4 left-4 flex items-center gap-3">
                  <div className="p-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                    <span className="text-3xl">{config.icon}</span>
                  </div>
                  <div className="px-4 py-2 bg-white/15 backdrop-blur-md rounded-xl text-white text-sm font-semibold border border-white/25 shadow-lg">
                    {eventType}
                  </div>
                </div>
                
                {/* Enhanced EONET badge */}
                <div className="absolute top-4 right-4">
                  <div className="px-3 py-2 bg-white/15 backdrop-blur-md rounded-xl text-white text-xs font-bold border border-white/25 shadow-lg">
                    EONET
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute top-1/2 right-4 w-1 h-16 bg-gradient-to-b from-white/30 to-transparent rounded-full" />
                <div className="absolute bottom-1/3 right-8 w-1 h-12 bg-gradient-to-b from-white/20 to-transparent rounded-full" />
              </div>
              
              <div className="p-6 flex-1 flex flex-col relative z-10">
                {/* Enhanced timestamp */}
                <div className="flex items-center gap-2 text-sm text-gray-300 mb-3">
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                    <span className="text-lg">🕐</span>
                    <span className="font-medium">{event.geometry?.[0]?.date?.slice(0,16).replace('T',' ') || 'Recent Event'}</span>
                  </div>
                </div>
                
                {/* Enhanced title */}
                <h3 className="text-xl font-bold text-white leading-snug mb-3">{displayTitle}</h3>
                
                {/* Enhanced description */}
                <div className="text-base text-gray-100 mb-4 leading-relaxed font-medium">
                  {(() => {
                    const txt = (hasValidSummary ? (mainSummary || '') : cleanedDesc);
                    if (txt && txt.length > 0) return txt.slice(0, 200) + (txt.length > 200 ? '…' : '');
                    return 'Details loading…';
                  })()}
                </div>
                
                {/* Enhanced footer */}
                <div className="mt-auto flex items-center justify-end pt-4 border-t border-white/15">
                  <Link
                    to={`/event/${event.id}`}
                    state={{ event: { ...event, summary: (mainSummary ? mainSummary.trim() : (event.description || '')), fact: '' } }}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-neon-green/25 to-aurora-purple/25 hover:from-neon-green/35 hover:to-aurora-purple/35 text-white font-semibold rounded-xl transition-all duration-300 border border-neon-green/40 hover:border-neon-green/60 shadow-lg hover:shadow-xl"
                  >
                    <span>Explore Details</span>
                    <span className="text-lg">→</span>
                  </Link>
                </div>
              </div>
            </div>
          );
          });
        })()}
      </div>
    </div>
  );
}
