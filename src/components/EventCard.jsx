import React from 'react';

export default function EventCard({ title, date, summary, fact }) {
  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-4 mb-4 border-l-4 border-aurora-purple">
      <h3 className="text-2xl font-semibold mb-2">{title}</h3>
      <p className="text-base text-gray-400 mb-3">{date}</p>
      <p className="text-lg mb-3">{summary}</p>
      <div className="text-neon-green font-semibold text-lg">Did you know? {fact}</div>
    </div>
  );
}
