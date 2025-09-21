import React from 'react';

const CodeIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24">
    <defs>
      <linearGradient id="codeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.9" />
        <stop offset="50%" stopColor="currentColor" stopOpacity="0.7" />
        <stop offset="100%" stopColor="currentColor" stopOpacity="0.5" />
      </linearGradient>
    </defs>
    
    {/* Code editor frame */}
    <rect x="2" y="4" width="20" height="16" rx="2" ry="2" 
          stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.6" />
    
    {/* Title bar */}
    <rect x="2" y="4" width="20" height="3" rx="2" ry="2" 
          fill="currentColor" opacity="0.2" />
    
    {/* Window controls */}
    <circle cx="5" cy="5.5" r="0.5" fill="currentColor" opacity="0.7" />
    <circle cx="6.5" cy="5.5" r="0.5" fill="currentColor" opacity="0.7" />
    <circle cx="8" cy="5.5" r="0.5" fill="currentColor" opacity="0.7" />
    
    {/* Left angle bracket - enhanced */}
    <path d="M8 10l-3 2 3 2" stroke="url(#codeGradient)" strokeWidth="2.5" 
          strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7.5 9.5l-2.5 2.5 2.5 2.5" stroke="currentColor" strokeWidth="1" 
          strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
    
    {/* Slash with glow effect */}
    <path d="M11 16l4-8" stroke="url(#codeGradient)" strokeWidth="2.5" 
          strokeLinecap="round" />
    <path d="M11.5 15.5l3-6" stroke="currentColor" strokeWidth="1" 
          strokeLinecap="round" opacity="0.3" />
    
    {/* Right angle bracket - enhanced */}
    <path d="M16 10l3 2-3 2" stroke="url(#codeGradient)" strokeWidth="2.5" 
          strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16.5 9.5l2.5 2.5-2.5 2.5" stroke="currentColor" strokeWidth="1" 
          strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
    
    {/* Code lines in background */}
    <line x1="4" y1="9" x2="7" y2="9" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
    <line x1="4" y1="11" x2="6" y2="11" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
    <line x1="4" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
    <line x1="17" y1="9" x2="20" y2="9" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
    <line x1="16" y1="11" x2="20" y2="11" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
    <line x1="18" y1="13" x2="20" y2="13" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
  </svg>
);

export default CodeIcon;
