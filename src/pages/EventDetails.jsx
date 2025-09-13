import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import ResponsiveMapView from '../components/ResponsiveMapView';

export default function EventDetails() {
  // For demo, use location.state or fallback mock data
  const { state } = useLocation();
  const event = state?.event || {
    title: 'Earthquake in Los Angeles',
    geometry: [{ coordinates: [-118.2437, 34.0522], date: '2024-07-26' }],
    category: 'Earthquake',
    severity: 'Moderate',
    summary: 'A moderate earthquake struck near Los Angeles, California, on July 26, 2024. The event was felt across the region, with reports of minor shaking. No significant damage has been reported at this time. Residents are advised to check for any potential aftershocks and follow local safety guidelines.',
    fact: 'Earthquakes are caused by the movement of tectonic plates beneath the Earth’s surface. The Pacific Ring of Fire, where California is located, is a highly active seismic zone, making the region prone to frequent earthquakes.'
  };

  const [summary, setSummary] = useState(event.summary || '');
  const [fact, setFact] = useState(event.fact || '');
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState(event.category || '');
  const [severity, setSeverity] = useState(event.severity || '');
  const [sources, setSources] = useState(Array.isArray(event.sources) ? event.sources : []);
  const [keyTerms, setKeyTerms] = useState([]);

  useEffect(() => {
    // Summary: only fetch if missing; detail enrichment: always run (cached) so category/severity populate
    const title = typeof event.title === 'string' && event.title.trim() ? event.title : (event.note || 'Space Weather Event');
    const metaParts = [];
    if (event.category) metaParts.push(`Category: ${event.category}`);
    const dateStr = event.geometry?.[0]?.date || event.startTime || '';
    if (dateStr) metaParts.push(`Date/Time: ${dateStr}`);
    if (event.geometry && event.geometry[0] && Array.isArray(event.geometry[0].coordinates)) {
      const [lon, lat] = event.geometry[0].coordinates;
      metaParts.push(`Coordinates: lat ${lat}, lon ${lon}`);
    }
    if (event.activityID) metaParts.push(`ActivityID: ${event.activityID}`);
    const description = [
      (typeof event.description === 'string' && event.description) || (event.note || ''),
      metaParts.length ? `\n\nContext: ${metaParts.join(' | ')}` : ''
    ].join('');
    const cacheKey = `detail_summary:${(event.id || event.activityID || title).toString().toLowerCase()}`;
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        const text = cached;
        const parts = text.split('Fun Fact:');
        setSummary(parts[0]?.trim() || '');
        setFact(parts[1]?.trim() || '');
      }
    } catch {}
    
    // Load key terms from cache immediately for instant display
    const termsKey = `key_terms:${(event.id || event.activityID || title).toString().toLowerCase()}`;
    try {
      const cachedTerms = sessionStorage.getItem(termsKey);
      if (cachedTerms) {
        const parsed = JSON.parse(cachedTerms);
        if (Array.isArray(parsed?.terms)) {
          setKeyTerms(parsed.terms);
        }
      }
    } catch {}
    (async () => {
      // Fetch summary only if not already available
      if (!summary || !fact) {
        try {
          setLoading(true);
          const { data } = await axios.post('https://geoaurora-backend-432163986190.asia-south1.run.app/api/summary', { title, description });
          const text = data.summary || '';
          const parts = text.split('Fun Fact:');
          const main = parts[0]?.trim() || '';
          const ff = parts[1]?.trim() || '';
          setSummary(main);
          setFact(ff);
          try { sessionStorage.setItem(cacheKey, text); } catch {}
        } catch (e) {
          // keep defaults
        } finally {
          setLoading(false);
        }
      }
      // Enrich structured details (category, severity, sources)
      try {
        const coords = (event.geometry && event.geometry[0] && Array.isArray(event.geometry[0].coordinates)) ? event.geometry[0].coordinates : undefined;
        const dateStr2 = event.geometry?.[0]?.date || event.startTime || '';
        const enrichKey = `detail_enrich:${(event.id || event.activityID || title).toString().toLowerCase()}`;
        // Seed from session cache first
        try {
          const cachedDetail = sessionStorage.getItem(enrichKey);
          if (cachedDetail) {
            const parsed = JSON.parse(cachedDetail);
            if (parsed?.category) setCategory(parsed.category);
            if (parsed?.severity) setSeverity(parsed.severity);
            if (Array.isArray(parsed?.sources) && parsed.sources.length > 0) {
              setSources(parsed.sources.map((u, idx) => ({ id: `ref-${idx+1}`, url: u.url || u })));
            }
          }
        } catch {}
        const { data: detail } = await axios.post('https://geoaurora-backend-432163986190.asia-south1.run.app/api/detail_enrich', {
          title,
          description: (typeof event.description === 'string' && event.description) || (event.note || ''),
          date: dateStr2,
          coordinates: coords,
        });
        if (detail?.category) setCategory(detail.category);
        if (detail?.severity) setSeverity(detail.severity);
        if (Array.isArray(detail?.sources) && detail.sources.length > 0) {
          setSources(detail.sources.map((u, idx) => ({ id: `ref-${idx+1}`, url: u })));
        }
        // Persist detail enrichment
        try { sessionStorage.setItem(enrichKey, JSON.stringify(detail)); } catch {}
      } catch {}
      
      // Fetch key terms only if not already cached
      if (keyTerms.length === 0) {
        try {
          const { data: termsData } = await axios.post('https://geoaurora-backend-432163986190.asia-south1.run.app/api/key_terms', {
            title,
            description: (typeof event.description === 'string' && event.description) || (event.note || ''),
            summary: summary || event.summary || ''
          });
          
          if (Array.isArray(termsData?.terms) && termsData.terms.length > 0) {
            setKeyTerms(termsData.terms);
            try { sessionStorage.setItem(termsKey, JSON.stringify(termsData)); } catch {}
          }
        } catch {}
      }
    })();
  }, [event]);

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-aurora-purple">Event Details</h2>
      <div className="rounded-2xl overflow-hidden mb-6">
        <ResponsiveMapView events={[event]} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800 rounded-xl p-4 text-center">
          <div className="text-xs text-gray-400 mb-1">Date</div>
          <div className="font-bold text-lg">{(() => {
            const d = event.geometry?.[0]?.date || event.startTime || '';
            try { return new Date(d).toLocaleString(); } catch { return d; }
          })()}</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 text-center">
          <div className="text-xs text-gray-400 mb-1">Category</div>
          <div className="font-bold text-lg">{category || event.category || 'N/A'}</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 text-center">
          <div className="text-xs text-gray-400 mb-1">Severity</div>
          <div className="font-bold text-lg">{severity || event.severity || 'N/A'}</div>
        </div>
      </div>
      <div className="bg-gray-900 rounded-xl p-6 mb-4 border-l-4 border-neon-green">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-neon-green text-xl">✨</span>
          <span className="font-bold text-lg">Simple Explanation</span>
        </div>
        <div className="text-base text-gray-200">{loading ? 'Generating summary…' : (summary || event.summary || 'No summary available.')}</div>
      </div>
      <div className="bg-gray-900 rounded-xl p-6 mb-6 border-l-4 border-solar-yellow">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-solar-yellow text-xl">💡</span>
          <span className="font-bold text-lg">Did You Know?</span>
        </div>
        <div className="text-base text-gray-200">{fact || event.fact || '—'}</div>
      </div>
      
      {keyTerms.length > 0 && (
        <div className="bg-gray-900 rounded-xl p-6 mb-6 border-l-4 border-neon-blue">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-neon-blue text-xl">📚</span>
            <span className="font-bold text-lg">Key Terms</span>
          </div>
          <div className="space-y-3">
            {keyTerms.map((term, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-4">
                <div className="font-semibold text-neon-blue mb-1">{term.term}</div>
                <div className="text-sm text-gray-300">{term.definition}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex gap-4 justify-center mt-4">
        <button className="bg-gray-800 text-white rounded-full px-4 py-2 flex items-center gap-2 hover:bg-aurora-purple transition-all">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.58-2.47.69a4.3 4.3 0 0 0 1.88-2.37 8.59 8.59 0 0 1-2.72 1.04A4.28 4.28 0 0 0 16.11 4c-2.37 0-4.29 1.92-4.29 4.29 0 .34.04.67.11.99C7.69 8.99 4.07 7.13 1.64 4.15c-.37.64-.58 1.38-.58 2.17 0 1.5.76 2.82 1.92 3.6a4.28 4.28 0 0 1-1.94-.54v.05c0 2.1 1.5 3.85 3.5 4.25-.36.1-.74.16-1.13.16-.28 0-.54-.03-.8-.08.54 1.7 2.1 2.94 3.95 2.97A8.6 8.6 0 0 1 2 19.54a12.13 12.13 0 0 0 6.56 1.92c7.88 0 12.2-6.53 12.2-12.2 0-.19 0-.37-.01-.56A8.7 8.7 0 0 0 24 4.59a8.5 8.5 0 0 1-2.54.7z"/></svg>
          Twitter
        </button>
        <button className="bg-gray-800 text-white rounded-full px-4 py-2 flex items-center gap-2 hover:bg-aurora-purple transition-all">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.04c-5.5 0-9.96 4.46-9.96 9.96 0 4.41 3.6 8.07 8.24 8.93v-6.32h-2.48v-2.61h2.48v-2c0-2.45 1.49-3.8 3.68-3.8 1.07 0 2.19.19 2.19.19v2.41h-1.23c-1.21 0-1.59.75-1.59 1.52v1.68h2.7l-.43 2.61h-2.27v6.32c4.64-.86 8.24-4.52 8.24-8.93 0-5.5-4.46-9.96-9.96-9.96z"/></svg>
          Instagram
        </button>
        <button className="bg-gray-800 text-white rounded-full px-4 py-2 flex items-center gap-2 hover:bg-aurora-purple transition-all">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M3.9 12.5c0-.28.22-.5.5-.5h15.2c.28 0 .5.22.5.5s-.22.5-.5.5H4.4a.5.5 0 0 1-.5-.5z"/></svg>
          Copy Link
        </button>
      </div>
    </div>
  );
}
