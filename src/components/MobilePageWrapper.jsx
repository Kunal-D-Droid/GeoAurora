import React from 'react';

export default function MobilePageWrapper({ children, className = "" }) {
  return (
    <div className={`mobile-page-wrapper w-full max-w-full overflow-x-hidden ${className}`}>
      {children}
    </div>
  );
}
