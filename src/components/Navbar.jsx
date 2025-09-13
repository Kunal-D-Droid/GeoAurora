import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { name: 'Daily Highlights', to: '/', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
  ) },
  { name: 'Earth Events', to: '/earth-events', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 0 20" /></svg>
  ) },
  { name: 'Space Weather', to: '/space-weather', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
  ) },
  { name: 'About', to: '/about', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
  ) },
];

export default function Navbar() {
  return (
    <aside className="h-screen w-80 bg-gray-900 text-white flex flex-col shadow-xl rounded-r-3xl p-4 sticky top-0">
      <div className="flex items-center gap-3 mb-10 mt-2 px-2">
        <img src="/logo.png" alt="GeoAurora" className="w-8 h-8 rounded-lg" />
        <span className="text-2xl font-bold text-aurora-purple tracking-wide">GeoAurora</span>
      </div>
      <nav className="flex-1">
        <ul className="space-y-2">
          {navItems.map(item => (
            <li key={item.name}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors font-medium text-base hover:bg-gray-800 hover:text-aurora-purple ${
                    isActive ? 'bg-gray-800 text-neon-green' : 'text-gray-300'
                  }`
                }
              >
                <span>{item.icon}</span>
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto text-xs text-gray-500 px-2 pt-8">&copy; {new Date().getFullYear()} GeoAurora</div>
    </aside>
  );
}
