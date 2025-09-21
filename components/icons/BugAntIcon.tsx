
import React from 'react';

const BugAntIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.287 8.287 0 0 0 3 5.858a8.287 8.287 0 0 0 5.858 3 8.287 8.287 0 0 0 2.387-1.575 8.252 8.252 0 0 1-5.482-3.596Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0 0 15 0h-15Z" />
    </svg>
);

export default BugAntIcon;
