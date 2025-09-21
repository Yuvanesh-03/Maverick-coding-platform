import React from 'react';

const TerminalIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24">
    <defs>
      <linearGradient id="terminalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.1" />
        <stop offset="100%" stopColor="currentColor" stopOpacity="0.05" />
      </linearGradient>
      <linearGradient id="screenGlow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
        <stop offset="100%" stopColor="currentColor" stopOpacity="0.05" />
      </linearGradient>
    </defs>
    
    {/* Terminal window frame */}
    <rect x="2" y="3" width="20" height="18" rx="2" ry="2" 
          stroke="currentColor" strokeWidth="1.5" fill="url(#terminalGradient)" />
    
    {/* Title bar */}
    <rect x="2" y="3" width="20" height="3" rx="2" ry="2" 
          fill="currentColor" opacity="0.15" />
    
    {/* Window controls */}
    <circle cx="5" cy="4.5" r="0.4" fill="currentColor" opacity="0.6" />
    <circle cx="6.5" cy="4.5" r="0.4" fill="currentColor" opacity="0.6" />
    <circle cx="8" cy="4.5" r="0.4" fill="currentColor" opacity="0.6" />
    
    {/* Screen area */}
    <rect x="3" y="7" width="18" height="13" rx="1" ry="1" 
          fill="url(#screenGlow)" />
    
    {/* Prompt symbol */}
    <path d="M6 11l3 2-3 2" stroke="currentColor" strokeWidth="2" 
          strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
    
    {/* Cursor/command line */}
    <rect x="12" y="14" width="6" height="1.5" fill="currentColor" opacity="0.6" />
    
    {/* Blinking cursor */}
    <rect x="18.5" y="13.5" width="0.8" height="2.5" fill="currentColor" opacity="0.9">
      <animate attributeName="opacity" values="0.9;0.1;0.9" dur="1.5s" repeatCount="indefinite" />
    </rect>
    
    {/* Terminal text lines */}
    <g stroke="currentColor" strokeWidth="0.8" opacity="0.4">
      <line x1="5" y1="9" x2="14" y2="9" strokeLinecap="round" />
      <line x1="5" y1="10.5" x2="18" y2="10.5" strokeLinecap="round" />
      <line x1="5" y1="17" x2="10" y2="17" strokeLinecap="round" />
      <line x1="5" y1="18.5" x2="16" y2="18.5" strokeLinecap="round" />
    </g>
    
    {/* Screen reflection */}
    <ellipse cx="12" cy="10" rx="6" ry="8" fill="currentColor" opacity="0.05" />
  </svg>
);

export default TerminalIcon;
