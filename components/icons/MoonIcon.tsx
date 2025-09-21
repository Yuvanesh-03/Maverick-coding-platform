import React from 'react';

const MoonIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24">
        <defs>
            <radialGradient id="moonGradient" cx="30%" cy="30%" r="70%">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.9" />
                <stop offset="60%" stopColor="currentColor" stopOpacity="0.7" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0.4" />
            </radialGradient>
            <radialGradient id="moonShadow" cx="70%" cy="70%" r="50%">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </radialGradient>
        </defs>
        
        {/* Main moon crescent */}
        <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
              fill="url(#moonGradient)" stroke="currentColor" strokeWidth="0.5" />
        
        {/* Shadow side for 3D effect */}
        <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
              fill="url(#moonShadow)" />
        
        {/* Moon craters */}
        <ellipse cx="14" cy="8" rx="1.2" ry="0.8" fill="currentColor" opacity="0.2" transform="rotate(15 14 8)" />
        <circle cx="16.5" cy="12" r="0.8" fill="currentColor" opacity="0.25" />
        <ellipse cx="13.5" cy="15" rx="0.9" ry="0.6" fill="currentColor" opacity="0.2" transform="rotate(-10 13.5 15)" />
        <circle cx="15.8" cy="16.5" r="0.5" fill="currentColor" opacity="0.3" />
        
        {/* Smaller craters */}
        <circle cx="14.8" cy="10.2" r="0.3" fill="currentColor" opacity="0.15" />
        <circle cx="16" cy="14" r="0.25" fill="currentColor" opacity="0.2" />
        <circle cx="13.2" cy="12.8" r="0.2" fill="currentColor" opacity="0.18" />
        
        {/* Glow effect around visible edge */}
        <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
              stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.6" />
        
        {/* Subtle stars around moon */}
        <g fill="currentColor" opacity="0.4">
            <circle cx="6" cy="6" r="0.5" />
            <circle cx="19" cy="5" r="0.3" />
            <circle cx="21" cy="9" r="0.4" />
            <circle cx="5" cy="18" r="0.3" />
            <circle cx="8" cy="20" r="0.4" />
        </g>
        
        {/* Twinkling effect on stars */}
        <g stroke="currentColor" strokeWidth="0.5" opacity="0.3">
            <path d="M6 5v2m-1-1h2" strokeLinecap="round" />
            <path d="M19 4v2m-1-1h2" strokeLinecap="round" />
            <path d="M21 8v2m-1-1h2" strokeLinecap="round" />
        </g>
    </svg>
);

export default MoonIcon;
