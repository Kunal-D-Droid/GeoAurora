import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import EventCard from '../components/EventCard';
import { getApiUrl } from '../config/api';

export default function Asteroids() {
  const [events, setEvents] = useState([]);
  const [summaries, setSummaries] = useState({});
  const [seenFacts, setSeenFacts] = useState(new Set());
  const [loadingFacts, setLoadingFacts] = useState(new Set());
  
  // Event type configurations for asteroids
  const eventTypeConfig = {
    'Near-Earth Asteroid': {
      gradient: 'from-slate-900/40 via-gray-800/30 to-zinc-900/40',
      borderColor: 'border-gray-400/70',
      hoverShadow: 'hover:shadow-[0_0_30px_rgba(156,163,175,0.6),0_25px_50px_-12px_rgba(156,163,175,0.4)]',
      icon: '🪨',
      photos: ['astr1.jpeg', 'astr2.jpeg', 'astr3.jpeg', 'astr4.jpeg', 'astr5.jpeg', 'astr6.jpeg', 'astr7.jpeg'],
      bgPattern: 'bg-[radial-gradient(ellipse_at_center,rgba(156,163,175,0.2),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(107,114,128,0.1),transparent_60%)]',
      impact: 'Near-Earth Approach',
      impactColor: 'bg-gray-500/20 text-gray-300 border-gray-500/40',
      accentColor: 'text-gray-300',
      cardStyle: 'ring-2 ring-gray-400/40 shadow-[0_0_20px_rgba(156,163,175,0.3)]'
    },
    'Hazardous Asteroid': {
      gradient: 'from-red-900/40 via-orange-800/30 to-yellow-900/40',
      borderColor: 'border-red-400/70',
      hoverShadow: 'hover:shadow-[0_0_30px_rgba(239,68,68,0.6),0_25px_50px_-12px_rgba(239,68,68,0.4)]',
      icon: '☄️',
      photos: ['astr1.jpeg', 'astr2.jpeg', 'astr3.jpeg', 'astr4.jpeg', 'astr5.jpeg', 'astr6.jpeg', 'astr7.jpeg'],
      bgPattern: 'bg-[radial-gradient(ellipse_at_bottom_right,rgba(239,68,68,0.2),transparent_50%),radial-gradient(ellipse_at_center,rgba(251,146,60,0.1),transparent_70%)]',
      impact: '⚠️ Potentially Hazardous',
      impactColor: 'bg-red-500/20 text-red-300 border-red-500/40',
      accentColor: 'text-red-300',
      cardStyle: 'ring-2 ring-red-400/40 shadow-[0_0_20px_rgba(239,68,68,0.3)]'
    }
  };

  // Get random photo for asteroid (ensuring no two consecutive images are the same)
  const getRandomPhoto = (eventType, lastPhotoIndex = -1) => {
    const config = eventTypeConfig[eventType];
    if (!config) return '/default-space.jpg';
    
    // If we have only one photo, just return it
    if (config.photos.length === 1) {
      return `/${config.photos[0]}`;
    }
    
    // Generate a random index that's different from the last one
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * config.photos.length);
    } while (randomIndex === lastPhotoIndex && config.photos.length > 1);
    
    return {
      photo: `/${config.photos[randomIndex]}`,
      index: randomIndex
    };
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Unknown';
    }
  };

  // Format distance
  const formatDistance = (km) => {
    if (!km) return 'Unknown';
    if (km >= 1000000) {
      return `${(km / 1000000).toFixed(2)}M km`;
    } else if (km >= 1000) {
      return `${(km / 1000).toFixed(2)}K km`;
    }
    return `${km.toFixed(0)} km`;
  };

  // Format size
  const formatSize = (min, max) => {
    if (!min || !max) return 'Unknown size';
    if (min === max) {
      return `${min.toFixed(0)}m`;
    }
    return `${min.toFixed(0)}-${max.toFixed(0)}m`;
  };

  // Generate unique fun facts for asteroids based on their specific characteristics
  const generateUniqueFact = useCallback((asteroid, usedFacts) => {
    const velocity = asteroid.velocity || 0;
    const distance = asteroid.miss_distance || 0;
    const sizeMin = asteroid.diameter_min || 0;
    const sizeMax = asteroid.diameter_max || 0;
    const avgSize = (sizeMin + sizeMax) / 2;
    const isHazardous = asteroid.hazardous;
    const name = asteroid.title || 'This asteroid';
    
    // Generate context-specific facts based on asteroid characteristics
    const facts = [];
    
    // Size-based facts
    if (avgSize > 1000) {
      facts.push(`${name} is massive - at ${formatSize(sizeMin, sizeMax)}, it's larger than the Empire State Building! If it were to impact, it could cause global devastation.`);
    } else if (avgSize > 100) {
      facts.push(`${name} measures ${formatSize(sizeMin, sizeMax)} - that's bigger than a football field! Asteroids this size only pass by Earth about once every few years.`);
    } else if (avgSize > 50) {
      facts.push(`${name} is ${formatSize(sizeMin, sizeMax)} wide - roughly the size of an Olympic swimming pool. While small, impacts from objects this size can still cause significant regional damage.`);
    } else if (avgSize > 20) {
      facts.push(`${name} is ${formatSize(sizeMin, sizeMax)} in diameter - about the size of a house. Most asteroids this size burn up in the atmosphere, but larger fragments can reach the ground.`);
    } else {
      facts.push(`${name} is tiny at ${formatSize(sizeMin, sizeMax)} - smaller than a bus. Objects this size enter Earth's atmosphere frequently and usually burn up completely.`);
    }
    
    // Distance-based facts
    if (distance < 100000) {
      facts.push(`At ${formatDistance(distance)}, this is an extremely close approach! That's closer than the Moon (384,400 km). Only a few asteroids come this close each year.`);
    } else if (distance < 500000) {
      facts.push(`This asteroid will pass at ${formatDistance(distance)} - closer than many satellites in geostationary orbit. While close, it's still a safe distance from Earth.`);
    } else if (distance < 2000000) {
      facts.push(`At ${formatDistance(distance)} away, this asteroid will be closer than Mars at its nearest approach to Earth. Don't worry though - it's still millions of kilometers away!`);
    } else if (distance < 10000000) {
      facts.push(`This asteroid will maintain a safe distance of ${formatDistance(distance)} - about ${(distance / 384400).toFixed(1)} times the distance to the Moon. No cause for concern!`);
    } else {
      facts.push(`At ${formatDistance(distance)}, this asteroid will be far enough away that it poses no threat. That's about ${(distance / 150000000).toFixed(2)} times the distance from Earth to the Sun!`);
    }
    
    // Velocity-based facts
    if (velocity > 30) {
      facts.push(`Traveling at ${velocity.toFixed(2)} km/s, this asteroid is moving incredibly fast - faster than most near-Earth objects! At this speed, it could circle Earth in just ${(40075 / velocity / 60).toFixed(1)} minutes.`);
    } else if (velocity > 20) {
      facts.push(`With a velocity of ${velocity.toFixed(2)} km/s, this asteroid is moving faster than a speeding bullet (which travels at ~1 km/s). That's ${(velocity * 3600).toFixed(0)} km/h!`);
    } else if (velocity > 15) {
      facts.push(`This asteroid travels at ${velocity.toFixed(2)} km/s - that's ${(velocity * 3.6).toFixed(0)} times faster than the fastest jet aircraft. It would take just ${(384400 / velocity / 3600).toFixed(1)} hours to travel the distance to the Moon.`);
    } else {
      facts.push(`Moving at ${velocity.toFixed(2)} km/s, this asteroid has a relatively moderate speed for near-Earth objects. Still, that's about ${(velocity * 3.6).toFixed(0)} times faster than a commercial airliner!`);
    }
    
    // Hazardous status facts
    if (isHazardous) {
      facts.push(`⚠️ This is classified as a Potentially Hazardous Asteroid (PHA)! PHAs are defined as asteroids larger than 140 meters that come within 7.5 million km of Earth. NASA closely monitors these objects.`);
      facts.push(`This asteroid meets NASA's criteria for "potentially hazardous" - it's large enough and close enough to warrant special attention. However, current calculations show no impact risk for the foreseeable future.`);
    } else {
      facts.push(`This asteroid is classified as non-hazardous by NASA. While it's passing relatively close, its size and trajectory pose no threat to Earth. Scientists track thousands of such objects.`);
    }
    
    // Combination facts (size + distance)
    if (avgSize > 50 && distance < 1000000) {
      facts.push(`A ${formatSize(sizeMin, sizeMax)} asteroid passing within ${formatDistance(distance)} is quite rare! Objects this size typically pass this close only a few times per decade.`);
    }
    
    // Combination facts (velocity + size)
    if (velocity > 25 && avgSize > 100) {
      facts.push(`A large ${formatSize(sizeMin, sizeMax)} asteroid traveling at ${velocity.toFixed(2)} km/s represents significant kinetic energy. If it were to impact, it would release energy equivalent to ${((avgSize * avgSize * velocity * velocity) / 1000000).toFixed(0)} megatons of TNT!`);
    }
    
    // Historical/comparison facts
    if (avgSize > 50) {
      facts.push(`Asteroids this size (${formatSize(sizeMin, sizeMax)}) are similar to the one that created Meteor Crater in Arizona 50,000 years ago. That impact created a crater 1.2 km wide!`);
    }
    
    if (distance < 500000 && avgSize > 20) {
      facts.push(`This close approach of a ${formatSize(sizeMin, sizeMax)} asteroid is being closely monitored. While no impact is predicted, such events help scientists refine asteroid tracking methods.`);
    }
    
    // Shuffle and find unique fact
    const shuffled = facts.sort(() => Math.random() - 0.5);
    
    for (const fact of shuffled) {
      const normalized = fact.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();
      if (!usedFacts.has(normalized) && !isDuplicateFact(fact)) {
        usedFacts.add(normalized);
        return fact;
      }
    }
    
    // Fallback to first fact if all are duplicates
    return shuffled[0] || `This asteroid is ${formatSize(sizeMin, sizeMax)} in size and will pass Earth at ${formatDistance(distance)}.`;
  }, []);

  const isDuplicateFact = useCallback((fact) => {
    const normalized = fact.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();
    return seenFacts.has(normalized);
  }, [seenFacts]);

  const addSeenFact = useCallback((fact) => {
    const normalized = fact.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();
    setSeenFacts(prev => new Set([...prev, normalized]));
  }, []);

  // Fetch asteroids
  useEffect(() => {
    let intervalId;
    const fetchAsteroids = () => {
      axios.get(getApiUrl('/api/neo')).then(res => {
        setEvents(res.data || []);
        try {
          sessionStorage.setItem('neo_cache_v1', JSON.stringify({ t: Date.now(), data: res.data || [] }));
        } catch {}
      }).catch(err => {
        console.error('NEO fetch error', err);
      });
    };
    
    // Seed from cache if fresh (<=15min)
    try {
      const cached = sessionStorage.getItem('neo_cache_v1');
      if (cached) {
        const { t, data } = JSON.parse(cached);
        if (Date.now() - t <= 15 * 60 * 1000) {
          setEvents(data || []);
          return;
        } else {
          sessionStorage.removeItem('neo_cache_v1');
        }
      }
    } catch {}
    
    fetchAsteroids();
    intervalId = setInterval(fetchAsteroids, 900000); // 15 minutes
    return () => clearInterval(intervalId);
  }, []);

  // Fetch summaries for asteroids
  useEffect(() => {
    try {
      const cachedSumm = sessionStorage.getItem('neo_summaries_v1');
      if (cachedSumm) {
        const obj = JSON.parse(cachedSumm);
        setSummaries(prev => ({ ...obj, ...prev }));
      }
    } catch {}
    
    events.forEach(async (event) => {
      const stableId = event.activityID || `${event.startTime}|${event.title}`;
      if (!summaries[stableId]) {
        setLoadingFacts(prev => new Set([...prev, stableId]));
        
        try {
          const title = event.title || 'Near-Earth Asteroid';
          const description = event.description || event.note || '';
          const enhancedDescription = `${description}\n\nAsteroid: ${event.title}\nDistance: ${formatDistance(event.miss_distance)}\nSize: ${formatSize(event.diameter_min, event.diameter_max)}\nVelocity: ${event.velocity?.toFixed(2) || 'Unknown'} km/s\nHazardous: ${event.hazardous ? 'Yes' : 'No'}`;
          
          const { data } = await axios.post(getApiUrl('/api/summary'), { 
            title, 
            description: enhancedDescription 
          });
          setSummaries(s => {
            const next = { ...s, [stableId]: data.summary };
            try { sessionStorage.setItem('neo_summaries_v1', JSON.stringify(next)); } catch {}
            return next;
          });
        } catch (err) {
          const usedFacts = new Set();
          const uniqueFact = generateUniqueFact(event, usedFacts);
          const fallbackSummary = `${event.description || event.note || 'Asteroid approaching Earth.'}\n\nFun Fact: ${uniqueFact}`;
          
          setSummaries(s => {
            const next = { ...s, [stableId]: fallbackSummary };
            try { sessionStorage.setItem('neo_summaries_v1', JSON.stringify(next)); } catch {}
            return next;
          });
          console.error('Summary error in Asteroids', stableId, err);
        } finally {
          setLoadingFacts(prev => {
            const newSet = new Set(prev);
            newSet.delete(stableId);
            return newSet;
          });
        }
      }
    });
  }, [events, generateUniqueFact]);

  // Track seen facts
  useEffect(() => {
    events.forEach((event) => {
      const stableId = event.activityID || `${event.startTime}|${event.title}`;
      const fullSummary = summaries[stableId];
      if (fullSummary && fullSummary.includes('Fun Fact:')) {
        const funFact = fullSummary.split('Fun Fact:')[1]?.trim();
        if (funFact && !isDuplicateFact(funFact)) {
          addSeenFact(funFact);
        }
      }
    });
  }, [summaries, events, addSeenFact, isDuplicateFact]);

  // Process events for display
  const processedEvents = useMemo(() => {
    const usedFacts = new Set();
    let lastPhotoIndex = -1;
    
    return events.map((event) => {
      const stableId = event.activityID || `${event.startTime}|${event.title}`;
      const fullSummary = summaries[stableId] || '';
      const mainSummary = fullSummary ? (fullSummary.split('Fun Fact:')[0] || '').trim() : '';
      let funFact = fullSummary && fullSummary.includes('Fun Fact:') ? fullSummary.split('Fun Fact:')[1].trim() : '';
      
      const categoryLabel = event.hazardous ? 'Hazardous Asteroid' : 'Near-Earth Asteroid';
      const config = eventTypeConfig[categoryLabel] || eventTypeConfig['Near-Earth Asteroid'];
      
      // Get random photo ensuring no two consecutive are the same
      const photoResult = getRandomPhoto(categoryLabel, lastPhotoIndex);
      const eventPhoto = typeof photoResult === 'string' ? photoResult : photoResult.photo;
      lastPhotoIndex = typeof photoResult === 'object' ? photoResult.index : -1;
      
      const isLoadingFact = loadingFacts.has(stableId);
      
      if (!funFact || isDuplicateFact(funFact) || usedFacts.has(funFact.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim())) {
        funFact = generateUniqueFact(event, usedFacts);
        usedFacts.add(funFact.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim());
      } else {
        usedFacts.add(funFact.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim());
      }
      
      return {
        ...event,
        stableId,
        mainSummary,
        funFact,
        categoryLabel,
        config,
        eventPhoto,
        isLoadingFact
      };
    });
  }, [events, summaries, loadingFacts, isDuplicateFact, generateUniqueFact]);

  return (
    <div className="p-0">
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <span className="text-2xl sm:text-3xl lg:text-4xl">🪨</span>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-300">Near-Earth Asteroids</h2>
      </div>
      {events.length === 0 ? (
        <div className="w-full mb-6">
          <div className="rounded-xl sm:rounded-2xl border border-gray-500/40 bg-gray-500/10 p-4 sm:p-5 text-gray-200">
            <div className="flex items-start gap-3">
              <span className="text-xl sm:text-2xl">🔍</span>
              <div>
                <div className="font-semibold mb-1">No Asteroids Found</div>
                <div className="text-sm">No near-Earth asteroids approaching in the next 7 days. Check back later!</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {processedEvents.map((event, idx) => {
          const { stableId, mainSummary, funFact, categoryLabel, config, eventPhoto, isLoadingFact } = event;
          
          return (
          <div key={stableId} className={`group relative rounded-3xl flex flex-col overflow-hidden border-2 ${config.borderColor} ${config.cardStyle} bg-gradient-to-br ${config.gradient} backdrop-blur-xl shadow-[0_20px_40px_-12px_rgba(0,0,0,0.6)] ${config.hoverShadow} transition-all duration-700`}>
            {/* Background pattern */}
            <div className={`absolute inset-0 ${config.bgPattern} opacity-60`} />
            
            {/* Decorative corners */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/5 to-transparent rounded-bl-full" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/5 to-transparent rounded-tr-full" />
            
            {/* Asteroid image */}
            <div className="relative h-40 sm:h-48 lg:h-52 w-full overflow-hidden">
              <img
                src={eventPhoto}
                alt={categoryLabel}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  e.target.src = '/default-space.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/95 via-gray-900/40 to-transparent" />
              
              {/* Event type badge */}
              <div className="absolute top-2 sm:top-4 left-2 sm:left-4 flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-white/10 backdrop-blur-md rounded-lg sm:rounded-xl border border-white/20">
                  <span className="text-xl sm:text-2xl lg:text-3xl">{config.icon}</span>
                </div>
                <div className="px-2 sm:px-4 py-1.5 sm:py-2 bg-white/15 backdrop-blur-md rounded-lg sm:rounded-xl text-white text-xs sm:text-sm font-semibold border border-white/25 shadow-lg">
                  <span className="hidden sm:inline">{categoryLabel}</span>
                  <span className="sm:hidden">{categoryLabel.split(' ')[0]}</span>
                </div>
              </div>
              
              {/* Hazardous badge */}
              {event.hazardous && (
                <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
                  <div className="px-2 sm:px-3 py-1 sm:py-1.5 bg-red-500/90 backdrop-blur-md rounded-lg sm:rounded-xl text-white text-xs sm:text-sm font-bold border border-red-400/50 shadow-lg">
                    ⚠️ HAZARDOUS
                  </div>
                </div>
              )}
            </div>
            
            {/* Content */}
            <div className="relative flex-1 p-4 sm:p-6 flex flex-col">
              <h3 className={`text-xl sm:text-2xl font-bold mb-2 ${config.accentColor}`}>
                {event.title || 'Unknown Asteroid'}
              </h3>
              
              <div className="mb-3 space-y-1.5 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">📅 Approach:</span>
                  <span>{formatDate(event.startTime)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">📏 Size:</span>
                  <span>{formatSize(event.diameter_min, event.diameter_max)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">📐 Distance:</span>
                  <span>{formatDistance(event.miss_distance)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">⚡ Velocity:</span>
                  <span>{event.velocity?.toFixed(2) || 'Unknown'} km/s</span>
                </div>
              </div>
              
              {/* Summary */}
              <div className="mb-3 text-gray-300 text-sm sm:text-base">
                {isLoadingFact ? (
                  <div className="flex items-center gap-2 text-gray-400">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                    <span>Loading details...</span>
                  </div>
                ) : (
                  <>
                    {mainSummary && (
                      <p className="mb-2">{mainSummary}</p>
                    )}
                    {funFact && (
                      <div className={`mt-2 p-2 sm:p-3 rounded-lg ${config.impactColor} border`}>
                        <div className="font-semibold text-xs sm:text-sm mb-1">Did You Know?</div>
                        <div className="text-xs sm:text-sm">{funFact}</div>
                      </div>
                    )}
                  </>
                )}
              </div>
              
              {/* Link to NASA JPL */}
              {event.link && (
                <a 
                  href={event.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`mt-auto inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg ${config.impactColor} hover:opacity-80 transition-opacity text-xs sm:text-sm font-medium`}
                >
                  <span>View on NASA JPL</span>
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>
          </div>
          );
        })}
      </div>
      )}
    </div>
  );
}

