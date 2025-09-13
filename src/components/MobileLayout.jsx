import React from 'react';
import MobileNavbar from './MobileNavbar';

export default function MobileLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <MobileNavbar />
      
      {/* Main Content with bottom padding for mobile nav and safe area */}
      <main className="pb-28 px-4 py-6 safe-area-pb">
        <div className="max-w-full overflow-x-hidden">
          {children}
        </div>
      </main>
      
      {/* Mobile Footer */}
      <footer className="lg:hidden bg-gray-900/95 backdrop-blur-md border-t border-gray-700 px-4 py-3 text-center text-xs text-gray-400 safe-area-pb">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>&copy; {new Date().getFullYear()} GeoAurora</span>
          <span className="hidden sm:inline">Made with ❤️ for science enthusiasts</span>
          <span className="sm:hidden">Made with ❤️</span>
        </div>
      </footer>
      
    </div>
  );
}
