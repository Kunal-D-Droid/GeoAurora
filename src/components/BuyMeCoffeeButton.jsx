import React from 'react';

export default function BuyMeCoffeeButton({ variant = 'default', className = '' }) {
  // Simplified approach - just use a direct link instead of the problematic script

  // Fallback button in case the script doesn't load
  const baseClasses = "inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 border shadow-lg hover:shadow-xl";
  
  const variants = {
    default: "bg-gradient-to-r from-yellow-500/25 to-orange-500/25 hover:from-yellow-500/35 hover:to-orange-500/35 text-white border-yellow-400/40 hover:border-yellow-400/60",
    sidebar: "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 hover:from-yellow-500/30 hover:to-orange-500/30 text-white border-yellow-400/30 hover:border-yellow-400/50 w-full justify-center",
    about: "bg-gradient-to-r from-yellow-500/25 to-orange-500/25 hover:from-yellow-500/35 hover:to-orange-500/35 text-white border-yellow-400/40 hover:border-yellow-400/60 px-6 py-3"
  };

  return (
    <div className={className}>
      <a
        href="https://buymeacoffee.com/kunaldas"
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClasses} ${variants[variant]}`}
      >
        <span className="text-lg">☕</span>
        <span>Buy me a coffee</span>
      </a>
    </div>
  );
}
