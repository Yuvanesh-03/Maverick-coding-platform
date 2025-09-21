import React from 'react';

const MagnifyingGlassIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className={className}>
        <defs>
            <linearGradient id="searchGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0.6" />
            </linearGradient>
        </defs>
        {/* Magnifying glass lens with gradient */}
        <circle cx="10.5" cy="10.5" r="6.5" stroke="url(#searchGradient)" strokeWidth="2.5" fill="none" />
        <circle cx="10.5" cy="10.5" r="4.5" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.3" />
        {/* Handle with realistic grip texture */}
        <path d="m19.5 19.5-4.35-4.35" stroke="url(#searchGradient)" strokeWidth="2.5" strokeLinecap="round" />
        <path d="m20.5 20.5-4.35-4.35" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
        {/* Lens reflection effect */}
        <ellipse cx="8.5" cy="8.5" rx="2" ry="1.5" fill="currentColor" opacity="0.1" transform="rotate(-30 8.5 8.5)" />
        <circle cx="7.5" cy="7.5" r="0.8" fill="currentColor" opacity="0.2" />
    </svg>
);

export default MagnifyingGlassIcon;
