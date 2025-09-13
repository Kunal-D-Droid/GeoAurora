import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import MobileLayout from './components/MobileLayout';
import MobilePageWrapper from './components/MobilePageWrapper';
import { useMobile } from './hooks/useMobile';

import Home from './pages/Home';
import EarthEvents from './pages/EarthEvents';
import SpaceWeather from './pages/SpaceWeather';
import DailyHighlights from './pages/DailyHighlights';
import EventDetails from './pages/EventDetails';
import About from './pages/About';


function App() {
  const { isMobile, isLoading } = useMobile();

  // Show loading state while detecting device
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-300">
          <div className="loader"></div>
          <span className="text-lg">Loading...</span>
        </div>
      </div>
    );
  }

  // Mobile Layout
  if (isMobile) {
    return (
      <Router>
        <MobileLayout>
          <Routes>
            <Route path="/" element={<MobilePageWrapper><Home /></MobilePageWrapper>} />
            <Route path="/earth-events" element={<MobilePageWrapper><EarthEvents /></MobilePageWrapper>} />
            <Route path="/space-weather" element={<MobilePageWrapper><SpaceWeather /></MobilePageWrapper>} />
            <Route path="/highlights" element={<MobilePageWrapper><DailyHighlights /></MobilePageWrapper>} />
            <Route path="/event/:id" element={<MobilePageWrapper><EventDetails /></MobilePageWrapper>} />
            <Route path="/about" element={<MobilePageWrapper><About /></MobilePageWrapper>} />
          </Routes>
        </MobileLayout>
      </Router>
    );
  }

  // Desktop Layout (Original)
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white flex">
        <Navbar />
        <main className="flex-1 p-8 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/earth-events" element={<EarthEvents />} />
            <Route path="/space-weather" element={<SpaceWeather />} />
            <Route path="/highlights" element={<DailyHighlights />} />
            <Route path="/event/:id" element={<EventDetails />} />
            <Route path="/about" element={<About />} />
          </Routes>
          <footer className="mt-10 border-t border-white/10 pt-6 text-xs text-gray-400 flex justify-between items-center">
            <span>&copy; {new Date().getFullYear()} GeoAurora</span>
            <span>Data: NASA EONET & DONKI</span>
          </footer>
        </main>
      </div>
    </Router>
  );
}

export default App;
