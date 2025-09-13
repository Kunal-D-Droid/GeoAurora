import React from 'react';

export default function EventCard({ title, date, summary, fact }) {
  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-4 mb-4 border-l-4 border-aurora-purple">
      <h3 className="text-xl font-semibold mb-1">{title}</h3>
      <p className="text-sm text-gray-400 mb-2">{date}</p>
      <p className="mb-2">{summary}</p>
      <div className="text-neon-green font-semibold">Did you know? {fact}</div>
    </div>
  );
}
