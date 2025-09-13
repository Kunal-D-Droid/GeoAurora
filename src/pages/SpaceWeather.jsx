import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import EventCard from '../components/EventCard';

export default function SpaceWeather() {
  const [events, setEvents] = useState([]);
  const [summaries, setSummaries] = useState({});
  const [seenFacts, setSeenFacts] = useState(new Set());
  const [loadingFacts, setLoadingFacts] = useState(new Set()); // Track which events are loading facts
  
  // Event type configurations with enhanced visual styling
  const eventTypeConfig = {
    'Coronal Mass Ejection (CME)': {
      gradient: 'from-purple-900/40 via-blue-800/30 to-indigo-900/40',
      borderColor: 'border-purple-400/70',
      hoverShadow: 'hover:shadow-[0_0_30px_rgba(147,51,234,0.6),0_25px_50px_-12px_rgba(147,51,234,0.4)]',
      icon: '🌊',
      photos: ['cme1.jpeg', 'cme2.jpg', 'cme3.jpeg'],
      bgPattern: 'bg-[radial-gradient(ellipse_at_top_left,rgba(147,51,234,0.15),transparent_60%),radial-gradient(ellipse_at_bottom_right,rgba(59,130,246,0.1),transparent_60%)]',
      impact: 'Geomagnetic Storm Risk',
      impactColor: 'bg-red-500/20 text-red-300 border-red-500/40',
      accentColor: 'text-purple-300',
      cardStyle: 'ring-2 ring-purple-400/40 shadow-[0_0_20px_rgba(147,51,234,0.3)]'
    },
    'Solar Flare': {
      gradient: 'from-orange-900/40 via-red-800/30 to-yellow-900/40',
      borderColor: 'border-orange-400/70',
      hoverShadow: 'hover:shadow-[0_0_30px_rgba(251,146,60,0.6),0_25px_50px_-12px_rgba(251,146,60,0.4)]',
      icon: '☀️',
      photos: ['flr1.jpeg', 'flr2.jpeg', 'flr3.jpeg'],
      bgPattern: 'bg-[radial-gradient(ellipse_at_top_right,rgba(251,146,60,0.2),transparent_50%),radial-gradient(ellipse_at_center,rgba(239,68,68,0.1),transparent_70%)]',
      impact: 'Radio Communication Disruption',
      impactColor: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
      accentColor: 'text-orange-300',
      cardStyle: 'ring-2 ring-orange-400/40 shadow-[0_0_20px_rgba(251,146,60,0.3)]'
    },
    'High-speed Solar Wind / Coronal Hole': {
      gradient: 'from-emerald-900/40 via-teal-800/30 to-cyan-900/40',
      borderColor: 'border-teal-400/70',
      hoverShadow: 'hover:shadow-[0_0_30px_rgba(20,184,166,0.6),0_25px_50px_-12px_rgba(20,184,166,0.4)]',
      icon: '💨',
      photos: ['hss1.jpeg', 'hss2.jpeg', 'hss3.jpeg'],
      bgPattern: 'bg-[radial-gradient(ellipse_at_bottom_left,rgba(20,184,166,0.15),transparent_60%),radial-gradient(ellipse_at_center,rgba(6,182,212,0.1),transparent_70%)]',
      impact: 'Minor Geomagnetic Activity',
      impactColor: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
      accentColor: 'text-teal-300',
      cardStyle: 'ring-2 ring-teal-400/40 shadow-[0_0_20px_rgba(20,184,166,0.3)]'
    },
    'Solar Energetic Particles (SEP)': {
      gradient: 'from-yellow-900/40 via-amber-800/30 to-orange-900/40',
      borderColor: 'border-yellow-400/70',
      hoverShadow: 'hover:shadow-[0_0_30px_rgba(245,158,11,0.6),0_25px_50px_-12px_rgba(245,158,11,0.4)]',
      icon: '⚡',
      photos: ['sep1.jpeg', 'sep3.jpeg', 'Solar Energetic Particlessep.png'],
      bgPattern: 'bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.2),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(251,191,36,0.1),transparent_60%)]',
      impact: 'Radiation Risk for Satellites',
      impactColor: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
      accentColor: 'text-yellow-300',
      cardStyle: 'ring-2 ring-yellow-400/40 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
    }
  };

  // Get random photo for event type
  const getRandomPhoto = (eventType) => {
    const config = eventTypeConfig[eventType];
    if (!config) return '/default-space.jpg';
    const randomIndex = Math.floor(Math.random() * config.photos.length);
    return `/${config.photos[randomIndex]}`;
  };

  // Extract event-specific data
  const getEventData = (event) => {
    const note = event.note || '';
    const category = event.category || '';
    
    // Extract flare class for Solar Flares
    if (category === 'Solar Flare') {
      const classMatch = note.match(/Class\s+([XMCB]\d*\.?\d*)/i);
      return {
        ...event,
        flareClass: classMatch ? classMatch[1] : null,
        sourceLocation: note.match(/from\s+([^.]+)/i)?.[1] || null
      };
    }
    
    // Extract CME speed
    if (category === 'Coronal Mass Ejection (CME)') {
      const speedMatch = note.match(/(\d+)\s*km\/s/i);
      return {
        ...event,
        speed: speedMatch ? speedMatch[1] : null
      };
    }
    
    return event;
  };

  // Enhanced deduplication for fun facts (similar to Earth Events)
  const isDuplicateFact = (fact) => {
    if (!fact || fact.length < 20) return true;
    
    // Normalize fact for comparison
    const normalized = fact.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    
    // Check for generic phrases specific to space weather
    const genericPhrases = [
      'solar flares are',
      'coronal mass ejections',
      'solar wind streams',
      'this is a common',
      'this type of event',
      'these events typically',
      'this phenomenon occurs',
      'this is an example of',
      'space weather affects',
      'the sun produces',
      'solar activity can',
      'the sun emits',
      'space weather events',
      'geomagnetic storms',
      'solar radiation',
      'the sun\'s surface',
      'solar wind particles',
      'magnetic fields',
      'aurora borealis',
      'northern lights',
      'cmes can travel',
      'solar flares can release',
      'coronal holes can persist',
      'sep events can pose'
    ];
    
    if (genericPhrases.some(phrase => normalized.includes(phrase))) {
      return true;
    }
    
    // Check if we've seen this fact before
    if (seenFacts.has(normalized)) {
      return true;
    }
    
    return false;
  };

  // Add fact to seen set
  const addSeenFact = useCallback((fact) => {
    if (!fact || fact.length < 20) return;
    const normalized = fact.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    setSeenFacts(prev => {
      const newSet = new Set(prev);
      newSet.add(normalized);
      return newSet;
    });
  }, []);

  // Generate dynamic facts based on specific event data
  const generateDynamicFact = useCallback((categoryLabel, eventData) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    
    if (categoryLabel === 'Solar Flare' && eventData.flareClass) {
      const facts = [
        `This ${eventData.flareClass}-class flare is ${eventData.flareClass.startsWith('X') ? 'extremely powerful' : eventData.flareClass.startsWith('M') ? 'moderately strong' : 'relatively weak'} compared to other solar flares!`,
        `Class ${eventData.flareClass} flares like this one can ${eventData.flareClass.startsWith('X') ? 'cause widespread radio blackouts' : 'cause minor radio disruptions'} on Earth!`,
        `The ${eventData.flareClass} classification means this flare is ${eventData.flareClass.startsWith('X') ? '10 times more powerful than an M-class flare' : '100 times more powerful than a C-class flare'}!`,
        `Solar flares like this ${eventData.flareClass}-class event can heat the Sun's corona to millions of degrees!`,
        `This ${eventData.flareClass} flare demonstrates the Sun's incredible magnetic energy release!`,
        `Class ${eventData.flareClass} flares are part of the Sun's natural 11-year activity cycle!`
      ];
      const fact = facts[Math.floor(Math.random() * facts.length)];
      return fact;
    }
    
    if (categoryLabel === 'Coronal Mass Ejection (CME)' && eventData.speed) {
      const speed = parseInt(eventData.speed);
      const facts = [
        `This CME is traveling at ${speed} km/s, which is ${speed > 1000 ? 'extremely fast' : speed > 500 ? 'moderately fast' : 'relatively slow'} for a coronal mass ejection!`,
        `At ${speed} km/s, this CME will reach Earth in approximately ${Math.round(150000000 / (speed * 3600))} hours!`,
        `CMEs traveling at ${speed} km/s like this one can cause ${speed > 1000 ? 'severe' : speed > 500 ? 'moderate' : 'minor'} geomagnetic storms!`,
        `This CME contains billions of tons of solar material moving at ${speed} km/s!`,
        `The speed of ${speed} km/s makes this CME ${speed > 1000 ? 'one of the fastest ever recorded' : 'moderately fast compared to typical CMEs'}!`,
        `CMEs like this one can create beautiful aurora displays when they reach Earth!`
      ];
      const fact = facts[Math.floor(Math.random() * facts.length)];
      return fact;
    }
    
    // Generic dynamic fact
    const genericFacts = [
      `This ${categoryLabel.toLowerCase()} event was detected in ${currentYear} and is being monitored by NASA's space weather team!`,
      `Space weather events like this ${categoryLabel.toLowerCase()} are tracked by multiple satellites orbiting Earth!`,
      `The ${categoryLabel.toLowerCase()} you're seeing is part of the Sun's natural 11-year activity cycle!`,
      `NASA's space weather monitoring helps protect satellites and astronauts from solar events!`,
      `This ${categoryLabel.toLowerCase()} demonstrates the dynamic nature of our Sun!`,
      `Space weather events like this can affect technology and create beautiful aurora displays!`,
      `The Sun's magnetic field is constantly changing, creating events like this ${categoryLabel.toLowerCase()}!`,
      `Scientists study events like this to better understand space weather and its effects!`
    ];
    const fact = genericFacts[Math.floor(Math.random() * genericFacts.length)];
    return fact;
  }, []);

  // Generate a truly unique fact for each event
  const generateUniqueFact = useCallback((categoryLabel, eventData, usedFacts) => {
    const fallbackFacts = {
      'Solar Flare': [
        'Solar flares can release energy equivalent to millions of 100-megaton hydrogen bombs in just a few minutes!',
        'The most powerful solar flares can reach X-class, with X20+ flares being extremely rare and dangerous!',
        'Solar flares travel at the speed of light, reaching Earth in just 8 minutes!',
        'The Carrington Event of 1859 was the most powerful solar storm ever recorded!',
        'Solar flares can cause beautiful auroras visible as far south as the Caribbean!',
        'Class X flares can cause radio blackouts that last for hours and affect global communications!',
        'Solar flares are classified by their X-ray brightness: A, B, C, M, and X (each 10 times more powerful)!',
        'The largest solar flare ever recorded was an X28 flare in 2003!',
        'Solar flares can heat the Sun\'s corona to temperatures of millions of degrees!',
        'Flares from the Sun can affect GPS accuracy and cause navigation errors!',
        'Solar flares can create shock waves that accelerate particles to near light speed!',
        'The Sun\'s magnetic field lines can snap and reconnect, releasing massive energy!',
        'Solar flares can cause geomagnetic storms that affect power grids on Earth!',
        'The Sun\'s activity follows an 11-year cycle, with solar maximum having more flares!',
        'Solar flares can cause beautiful aurora displays visible from space!'
      ],
      'Coronal Mass Ejection (CME)': [
        'CMEs can travel at speeds up to 3,000 km/s and contain billions of tons of solar material!',
        'The fastest CME ever recorded traveled at 2,000 km/s and reached Earth in just 14 hours!',
        'CMEs can be 10 times larger than Earth and create massive magnetic storms!',
        'The largest CME ever observed was in 2012 and would have caused trillions in damage if it hit Earth!',
        'CMEs can create stunning aurora displays visible from space and Earth!',
        'A typical CME contains about 1.6 billion tons of matter moving at 400 km/s!',
        'CMEs can cause geomagnetic storms that affect power grids and satellite operations!',
        'The 1859 Carrington Event CME was so powerful it caused telegraph systems to spark!',
        'CMEs can take anywhere from 15 hours to several days to reach Earth!',
        'Space weather forecasters can predict CME impacts with 30-60% accuracy!',
        'CMEs can compress Earth\'s magnetosphere and cause aurora at lower latitudes!',
        'The fastest CMEs can reach Earth in just 14 hours, while slower ones take 3-4 days!',
        'CMEs can cause radio blackouts and affect satellite communications!',
        'The Sun\'s corona is constantly ejecting material, but CMEs are the most dramatic!',
        'CMEs can create beautiful aurora displays that are visible from space!'
      ],
      'High-speed Solar Wind / Coronal Hole': [
        'Coronal holes can persist for months and create beautiful aurora displays at Earth\'s poles!',
        'High-speed solar wind can reach speeds of 800 km/s, much faster than normal solar wind!',
        'Coronal holes are cooler, less dense regions of the Sun\'s corona!',
        'The largest coronal hole ever observed was 50 times the size of Earth!',
        'High-speed solar wind streams can cause minor geomagnetic storms and aurora activity!',
        'Coronal holes are more common during solar minimum and can last for 27-day solar rotations!',
        'High-speed solar wind can compress Earth\'s magnetosphere and cause aurora at lower latitudes!',
        'The solar wind carries the Sun\'s magnetic field throughout the solar system!',
        'Coronal holes are visible in X-ray images as dark regions on the Sun!',
        'High-speed streams can cause radio blackouts and affect satellite communications!',
        'Coronal holes can create beautiful aurora displays visible from Earth!',
        'The solar wind speed can vary from 300 km/s to over 800 km/s!',
        'Coronal holes are more common during solar minimum periods!',
        'High-speed solar wind can cause minor geomagnetic storms!',
        'The Sun\'s magnetic field is constantly changing, creating dynamic space weather!'
      ],
      'Solar Energetic Particles (SEP)': [
        'SEP events can pose radiation risks to astronauts and affect satellite electronics in space!',
        'Solar energetic particles can travel at nearly the speed of light!',
        'SEP events can cause single-event upsets in satellite computer systems!',
        'The most intense SEP events can last for several days!',
        'SEP particles can penetrate spacecraft shielding and pose health risks to astronauts!',
        'SEP events are more likely during solar maximum and can affect airline routes!',
        'Solar energetic particles can cause false readings in satellite instruments!',
        'The radiation from SEP events can be detected on Earth\'s surface during major events!',
        'SEP events can cause temporary blindness in astronauts during spacewalks!',
        'The intensity of SEP events can vary by a factor of 10,000 between quiet and active periods!',
        'SEP particles can cause beautiful aurora displays when they interact with Earth\'s atmosphere!',
        'The Sun\'s magnetic field can accelerate particles to near light speed!',
        'SEP events can affect airline routes at high altitudes!',
        'Solar energetic particles can cause geomagnetic storms!',
        'The Sun\'s activity cycle affects the frequency of SEP events!'
      ]
    };

    const facts = fallbackFacts[categoryLabel] || fallbackFacts['Solar Flare'];
    
    // First try to find an unused fact from the static list
    const availableFacts = facts.filter(fact => {
      const normalized = fact.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();
      return !usedFacts.has(normalized) && !isDuplicateFact(fact);
    });
    
    if (availableFacts.length > 0) {
      // Randomly select from available facts to add variety
      const randomIndex = Math.floor(Math.random() * availableFacts.length);
      return availableFacts[randomIndex];
    }
    
    // If all static facts are used, generate a dynamic one
    return generateDynamicFact(categoryLabel, eventData);
  }, [isDuplicateFact, generateDynamicFact]);

  useEffect(() => {
    let intervalId;
    const fetchDonki = () => {
      axios.get('/api/donki').then(res => {
        setEvents(res.data || []);
        try {
          sessionStorage.setItem('donki_cache_v1', JSON.stringify({ t: Date.now(), data: res.data || [] }));
        } catch {}
      }).catch(err => {
        console.error('DONKI fetch error', err);
      });
    };
    // Seed from cache if fresh (<=15min)
    try {
      const cached = sessionStorage.getItem('donki_cache_v1');
      if (cached) {
        const { t, data } = JSON.parse(cached);
        if (Date.now() - t <= 15 * 60 * 1000) {
          setEvents(data || []);
          return; // Use cached data, don't fetch new data
        } else {
          sessionStorage.removeItem('donki_cache_v1');
        }
      }
    } catch {}
    // Only fetch if no valid cache
    fetchDonki();
    intervalId = setInterval(fetchDonki, 900000); // 15 minutes
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    // Seed summaries from cache first
    try {
      const cachedSumm = sessionStorage.getItem('donki_summaries_v1');
      if (cachedSumm) {
        const obj = JSON.parse(cachedSumm);
        setSummaries(prev => ({ ...obj, ...prev }));
      }
    } catch {}
    
    events.forEach(async (event) => {
      const stableId = event.activityID || `${event.startTime}|${event.note}`;
      if (!summaries[stableId]) {
        // Mark this event as loading
        setLoadingFacts(prev => new Set([...prev, stableId]));
        
        try {
          const title = typeof event.title === 'string' && event.title.trim() ? event.title : (event.note || 'Space Weather Event');
          const description = typeof event.description === 'string' ? event.description : event.note || '';
          
          // Enhanced prompt for unique facts
          const enhancedDescription = `${description}\n\nEvent Type: ${event.category || 'Space Weather Event'}\nEvent ID: ${stableId}\nTimestamp: ${event.startTime || 'Recent'}`;
          
          const { data } = await axios.post('/api/summary', { 
            title, 
            description: enhancedDescription 
          });
          setSummaries(s => {
            const next = { ...s, [stableId]: data.summary };
            try { sessionStorage.setItem('donki_summaries_v1', JSON.stringify(next)); } catch {}
            return next;
          });
        } catch (err) {
          // Generate unique fallback fun fact based on event type and data
          const categoryLabel = event.category || 'Solar Flare';
          const eventData = getEventData(event);
          const usedFacts = new Set(); // Create a local set for this fallback
          const uniqueFact = generateUniqueFact(categoryLabel, eventData, usedFacts);
          const fallbackSummary = `${event.note || 'Space weather event detected.'}\n\nFun Fact: ${uniqueFact}`;
          
          setSummaries(s => {
            const next = { ...s, [stableId]: fallbackSummary };
            try { sessionStorage.setItem('donki_summaries_v1', JSON.stringify(next)); } catch {}
            return next;
          });
          console.error('Summary error in SpaceWeather', stableId, err);
        } finally {
          // Remove from loading state
          setLoadingFacts(prev => {
            const newSet = new Set(prev);
            newSet.delete(stableId);
            return newSet;
          });
        }
      }
    });
  }, [events]);

  // Track seen facts when they're displayed (without causing re-renders)
  useEffect(() => {
    events.forEach((event) => {
      const stableId = event.activityID || `${event.startTime}|${event.note}`;
      const fullSummary = summaries[stableId];
      if (fullSummary && fullSummary.includes('Fun Fact:')) {
        const funFact = fullSummary.split('Fun Fact:')[1]?.trim();
        if (funFact && !isDuplicateFact(funFact)) {
          addSeenFact(funFact);
        }
      }
    });
  }, [summaries, events, addSeenFact, isDuplicateFact]);

  // Memoize processed events to avoid recalculating facts on every render
  const processedEvents = useMemo(() => {
    const usedFacts = new Set();
    
    return events.map((event) => {
      const stableId = event.activityID || `${event.startTime}|${event.note}`;
      const fullSummary = summaries[stableId] || '';
      const mainSummary = fullSummary ? (fullSummary.split('Fun Fact:')[0] || '').trim() : '';
      let funFact = fullSummary && fullSummary.includes('Fun Fact:') ? fullSummary.split('Fun Fact:')[1].trim() : '';
      const categoryLabel = event.category || 'Solar Flare';
      const config = eventTypeConfig[categoryLabel] || eventTypeConfig['Solar Flare'];
      const eventData = getEventData(event);
      const eventPhoto = getRandomPhoto(categoryLabel);
      const isLoadingFact = loadingFacts.has(stableId);
      
      // If no fun fact from AI or it's a duplicate, generate a unique one
      if (!funFact || isDuplicateFact(funFact) || usedFacts.has(funFact.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim())) {
        funFact = generateUniqueFact(categoryLabel, eventData, usedFacts);
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
        eventData,
        eventPhoto,
        isLoadingFact
      };
    });
  }, [events, summaries, loadingFacts, isDuplicateFact, generateUniqueFact]);

  return (
    <div className="p-0">
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <span className="text-2xl sm:text-3xl lg:text-4xl">☀️</span>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-solar-yellow">Space Weather</h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {processedEvents.map((event, idx) => {
          const { stableId, mainSummary, funFact, categoryLabel, config, eventData, eventPhoto, isLoadingFact } = event;
          
          return (
          <div key={stableId} className={`group relative rounded-3xl flex flex-col overflow-hidden border-2 ${config.borderColor} ${config.cardStyle} bg-gradient-to-br ${config.gradient} backdrop-blur-xl shadow-[0_20px_40px_-12px_rgba(0,0,0,0.6)] ${config.hoverShadow} transition-all duration-700`}>
            {/* Enhanced background pattern */}
            <div className={`absolute inset-0 ${config.bgPattern} opacity-60`} />
            
            {/* Decorative corner elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/5 to-transparent rounded-bl-full" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/5 to-transparent rounded-tr-full" />
            
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
              
              {/* Enhanced event type badge */}
              <div className="absolute top-2 sm:top-4 left-2 sm:left-4 flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-white/10 backdrop-blur-md rounded-lg sm:rounded-xl border border-white/20">
                  <span className="text-xl sm:text-2xl lg:text-3xl">{config.icon}</span>
                </div>
                <div className="px-2 sm:px-4 py-1.5 sm:py-2 bg-white/15 backdrop-blur-md rounded-lg sm:rounded-xl text-white text-xs sm:text-sm font-semibold border border-white/25 shadow-lg">
                  <span className="hidden sm:inline">{categoryLabel}</span>
                  <span className="sm:hidden">{categoryLabel.split(' ')[0]}</span>
                </div>
              </div>
              
              {/* Enhanced impact indicator */}
              <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
                <div className={`px-2 sm:px-3 py-1.5 sm:py-2 ${config.impactColor} backdrop-blur-md rounded-lg sm:rounded-xl text-xs font-bold border shadow-lg`}>
                  <span className="hidden sm:inline">⚠️ {config.impact}</span>
                  <span className="sm:hidden">⚠️ Risk</span>
                </div>
              </div>
              
              {/* Enhanced event-specific data overlay */}
              {eventData.flareClass && (
                <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4">
                  <div className="px-2 sm:px-4 py-1.5 sm:py-2 bg-orange-500/25 backdrop-blur-md rounded-lg sm:rounded-xl text-orange-200 text-xs sm:text-sm font-bold border border-orange-400/40 shadow-lg">
                    ⭐ Class {eventData.flareClass}
                  </div>
                </div>
              )}
              
              {eventData.speed && (
                <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4">
                  <div className="px-2 sm:px-4 py-1.5 sm:py-2 bg-purple-500/25 backdrop-blur-md rounded-lg sm:rounded-xl text-purple-200 text-xs sm:text-sm font-bold border border-purple-400/40 shadow-lg">
                    🚀 {eventData.speed} km/s
                  </div>
                </div>
              )}
              
              {/* Decorative elements */}
              <div className="absolute top-1/2 right-4 w-1 h-16 bg-gradient-to-b from-white/30 to-transparent rounded-full" />
              <div className="absolute bottom-1/3 right-8 w-1 h-12 bg-gradient-to-b from-white/20 to-transparent rounded-full" />
            </div>
            
            <div className="p-4 sm:p-6 lg:p-7 flex-1 flex flex-col relative z-10">
              {/* Enhanced timestamp with better styling */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-300 mb-3 sm:mb-4">
                <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 bg-white/5 rounded-full border border-white/10">
                  <span className="text-sm sm:text-lg">🕐</span>
                  <span className="font-medium">{event.startTime?.slice(0, 16)?.replace('T',' ') || 'Recent Event'}</span>
                </div>
                {eventData.sourceLocation && (
                  <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 bg-white/5 rounded-full border border-white/10">
                    <span className="text-sm sm:text-lg">📍</span>
                    <span className="font-medium">{eventData.sourceLocation}</span>
                  </div>
                )}
              </div>
              
              {/* Enhanced summary with better typography */}
              <div className="text-sm sm:text-base text-gray-100 mb-4 sm:mb-5 leading-relaxed font-medium">
                {(mainSummary || event.note || '').slice(0, 180)}{(mainSummary || event.note || '').length > 180 ? '…' : ''}
              </div>
              
              {/* Enhanced fun fact with event-specific styling - always show section */}
              <div className={`text-xs sm:text-sm font-semibold mb-4 sm:mb-5 p-3 sm:p-4 bg-gradient-to-r from-green-500/15 to-emerald-500/15 rounded-xl sm:rounded-2xl border border-green-400/30 shadow-lg backdrop-blur-sm`}>
                <div className="flex items-center gap-1.5 sm:gap-2 mb-2">
                  <span className="text-xl">💡</span> 
                  <span className="font-bold text-green-300 text-xl">Did You Know?</span>
                </div>
                <div className="text-white font-normal leading-relaxed">
                  <span className="text-white italic">
                    {isLoadingFact ? (
                      <div className="flex items-center gap-2 text-green-300">
                        <div className="loader-small"></div>
                        <span className="text-xs sm:text-sm">Loading fascinating fact...</span>
                      </div>
                    ) : (() => {
                      let displayFact = '';
                      
                      if (funFact && !isDuplicateFact(funFact)) {
                        displayFact = funFact.slice(0, 150) + (funFact.length > 150 ? '…' : '');
                      } else {
                        const usedFacts = new Set(); // Create a local set for this fallback
                        const uniqueFact = generateUniqueFact(categoryLabel, eventData, usedFacts);
                        displayFact = uniqueFact;
                      }
                      
                      return displayFact;
                    })()}
                  </span>
                </div>
              </div>
              
              {/* Enhanced footer with better visual hierarchy */}
              <div className="mt-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-0 pt-4 sm:pt-5 border-t border-white/15">
                <a 
                  href={event.link || "https://api.nasa.gov/"} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-2 bg-white/10 hover:bg-white/15 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium text-solar-yellow hover:text-neon-green transition-all duration-300 border border-white/20 hover:border-solar-yellow/30 min-h-[44px]"
                >
                  <span className="text-base sm:text-lg">📡</span>
                  <span>NASA Source</span>
                </a>
                <Link
                  to={`/event/${stableId}`}
                  state={{ event: { ...event, summary: (mainSummary || (event.note || '')), fact: funFact } }}
                  className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-solar-yellow/25 to-neon-green/25 hover:from-solar-yellow/35 hover:to-neon-green/35 text-white font-semibold rounded-lg sm:rounded-xl transition-all duration-300 border border-solar-yellow/40 hover:border-solar-yellow/60 shadow-lg hover:shadow-xl min-h-[44px] ${config.accentColor}`}
                >
                  <span className="text-xs sm:text-sm">Explore Details</span>
                  <span className="text-base sm:text-lg">→</span>
                </Link>
              </div>
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
}
