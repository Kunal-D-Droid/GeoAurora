import { useState, useEffect } from 'react';
import isMobile from 'ismobilejs'; 

export function useMobile() {
  const [mobile, setMobile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Check if we're on mobile
    const checkMobile = () => {
      const mobileCheck = isMobile.any;
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Additional mobile detection based on screen size
      const isSmallScreen = width <= 768;
      const isMobileDevice = mobileCheck || isSmallScreen;
      
      setMobile(isMobileDevice);
      setScreenSize({ width, height });
      setLoading(false);
    };

    // Initial check
    checkMobile();

    // Listen for resize events to handle orientation changes
    const handleResize = () => {
      checkMobile();
    };

    // Listen for orientation changes
    const handleOrientationChange = () => {
      // Small delay to ensure dimensions are updated
      setTimeout(checkMobile, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  return { 
    isMobile: mobile, 
    isLoading: loading, 
    screenSize,
    isSmallScreen: screenSize.width <= 480,
    isMediumScreen: screenSize.width > 480 && screenSize.width <= 768,
    isLargeScreen: screenSize.width > 768
  };
}
