import React from 'react';

const BellIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24">
    <defs>
      <linearGradient id="bellGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.9" />
        <stop offset="100%" stopColor="currentColor" stopOpacity="0.6" />
      </linearGradient>
      <radialGradient id="bellHighlight" cx="30%" cy="30%" r="40%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
        <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
      </radialGradient>
    </defs>
    
    {/* Bell body with realistic curve */}
    <path d="M12 2.5c-1.1 0-2 .9-2 2v.5c-3.3.5-6 3.2-6 6.5v3c0 .8-.3 1.5-.9 2.1l-.6.6c-.4.4-.4 1 0 1.4.2.2.4.4.7.4h17.6c.3 0 .5-.2.7-.4.4-.4.4-1 0-1.4l-.6-.6c-.6-.6-.9-1.3-.9-2.1v-3c0-3.3-2.7-6-6-6.5v-.5c0-1.1-.9-2-2-2z" 
          fill="url(#bellGradient)" stroke="currentColor" strokeWidth="0.5" />
    
    {/* Bell rim detail */}
    <ellipse cx="12" cy="18" rx="8" ry="1" fill="currentColor" opacity="0.3" />
    
    {/* Bell clapper */}
    <circle cx="12" cy="15" r="1.5" fill="currentColor" opacity="0.4" />
    <circle cx="12" cy="15" r="0.8" fill="currentColor" opacity="0.6" />
    
    {/* Sound waves */}
    <path d="M18.5 8c1.5 1.5 2.5 3.5 2.5 5.5" stroke="currentColor" strokeWidth="1.5" 
          strokeLinecap="round" fill="none" opacity="0.5" />
    <path d="M5.5 8c-1.5 1.5-2.5 3.5-2.5 5.5" stroke="currentColor" strokeWidth="1.5" 
          strokeLinecap="round" fill="none" opacity="0.5" />
    
    {/* Bell mouth indicator */}
    <path d="M9 19.5c0 1.7 1.3 3 3 3s3-1.3 3-3" stroke="currentColor" strokeWidth="2" 
          strokeLinecap="round" fill="none" />
    
    {/* Highlight effect */}
    <ellipse cx="12" cy="10" rx="4" ry="6" fill="url(#bellHighlight)" />
  </svg>
);

export default BellIcon;
