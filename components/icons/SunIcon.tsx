import React from 'react';

const SunIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24">
        <defs>
            <radialGradient id="sunGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
                <stop offset="70%" stopColor="currentColor" stopOpacity="0.8" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0.6" />
            </radialGradient>
            <radialGradient id="sunCore" cx="30%" cy="30%" r="40%">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </radialGradient>
        </defs>
        
        {/* Sun rays - longer and more realistic */}
        <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M12 2v3" opacity="0.9" />
            <path d="M12 19v3" opacity="0.9" />
            <path d="M22 12h-3" opacity="0.9" />
            <path d="M5 12H2" opacity="0.9" />
            <path d="M19.78 4.22l-2.12 2.12" opacity="0.7" />
            <path d="M6.34 6.34L4.22 4.22" opacity="0.7" />
            <path d="M19.78 19.78l-2.12-2.12" opacity="0.7" />
            <path d="M6.34 17.66l-2.12 2.12" opacity="0.7" />
        </g>
        
        {/* Additional shorter rays for more realistic effect */}
        <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5">
            <path d="M12 1v1" />
            <path d="M12 22v1" />
            <path d="M23 12h-1" />
            <path d="M2 12H1" />
            <path d="M20.85 3.15l-0.7 0.7" />
            <path d="M4.55 4.55l-0.7-0.7" />
            <path d="M20.85 20.85l-0.7-0.7" />
            <path d="M4.55 19.45l-0.7 0.7" />
        </g>
        
        {/* Main sun body with gradient */}
        <circle cx="12" cy="12" r="5" fill="url(#sunGradient)" stroke="currentColor" strokeWidth="0.5" />
        
        {/* Inner glow */}
        <circle cx="12" cy="12" r="4" fill="url(#sunCore)" />
        
        {/* Surface details */}
        <circle cx="10.5" cy="10.5" r="0.8" fill="currentColor" opacity="0.2" />
        <circle cx="13.2" cy="11.8" r="0.5" fill="currentColor" opacity="0.3" />
        <circle cx="11.8" cy="13.5" r="0.6" fill="currentColor" opacity="0.25" />
        
        {/* Highlight */}
        <ellipse cx="10" cy="9.5" rx="1.5" ry="1" fill="currentColor" opacity="0.4" transform="rotate(-20 10 9.5)" />
    </svg>
);

export default SunIcon;
