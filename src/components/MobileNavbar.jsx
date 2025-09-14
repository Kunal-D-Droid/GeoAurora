import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { name: 'Highlights', to: '/', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
  ) },
  { name: 'Earth', to: '/earth-events', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 0 20" /></svg>
  ) },
  { name: 'Space', to: '/space-weather', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
  ) },
  { name: 'About', to: '/about', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
  ) },
];

export default function MobileNavbar() {
  return (
    <>
      {/* Bottom Navigation for Mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-md border-t border-gray-700 z-40 safe-area-pb">
        <div className="flex justify-around py-4 px-2">
          {navItems.map(item => (
            <NavLink
              key={item.name}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-2 py-2 rounded-xl transition-all duration-300 min-h-[60px] min-w-[60px] justify-center ${
                  isActive 
                    ? 'text-neon-green bg-neon-green/10 border border-neon-green/20' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`
              }
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-sm font-medium leading-tight">{item.name}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
}
