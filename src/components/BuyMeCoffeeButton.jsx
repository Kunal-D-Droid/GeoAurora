import React, { useEffect, useRef } from 'react';

export default function BuyMeCoffeeButton({ variant = 'default', className = '' }) {
  const buttonRef = useRef(null);

  useEffect(() => {
    // Check if the script is already loaded
    if (window.buyMeACoffee) {
      return;
    }

    // Load the Buy Me a Coffee script only once
    const existingScript = document.querySelector('script[src*="buymeacoffee.com"]');
    if (existingScript) {
      return;
    }

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js';
    script.setAttribute('data-name', 'bmc-button');
    script.setAttribute('data-slug', 'sherl0ck');
    script.setAttribute('data-color', '#FFDD00');
    script.setAttribute('data-emoji', '☕');
    script.setAttribute('data-font', 'Cookie');
    script.setAttribute('data-text', 'Buy me a coffee');
    script.setAttribute('data-outline-color', '#000000');
    script.setAttribute('data-font-color', '#000000');
    script.setAttribute('data-coffee-color', '#ffffff');

    // Add the script to the document
    document.head.appendChild(script);

    // Cleanup function to remove the script when component unmounts
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // Fallback button in case the script doesn't load
  const baseClasses = "inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 border shadow-lg hover:shadow-xl";
  
  const variants = {
    default: "bg-gradient-to-r from-yellow-500/25 to-orange-500/25 hover:from-yellow-500/35 hover:to-orange-500/35 text-white border-yellow-400/40 hover:border-yellow-400/60",
    sidebar: "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 hover:from-yellow-500/30 hover:to-orange-500/30 text-white border-yellow-400/30 hover:border-yellow-400/50 w-full justify-center",
    about: "bg-gradient-to-r from-yellow-500/25 to-orange-500/25 hover:from-yellow-500/35 hover:to-orange-500/35 text-white border-yellow-400/40 hover:border-yellow-400/60 px-6 py-3"
  };

  return (
    <div ref={buttonRef} className={className}>
      {/* The Buy Me a Coffee script will inject the button here */}
      {/* Fallback button - shown if script doesn't load */}
      <a
        href="https://buymeacoffee.com/kunaldas"
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClasses} ${variants[variant]}`}
        id="fallback-bmc-button"
      >
        <span className="text-lg">☕</span>
        <span>Buy me a coffee</span>
      </a>
    </div>
  );
}
