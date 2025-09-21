
import React from 'react';

const UsersIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m-7.284-2.72a3 3 0 0 0-4.682-2.72m7.284-2.72a3 3 0 0 0-4.682 2.72M18 18.72a9.094 9.094 0 0 0-3.741-.479m-7.284-2.72a9.094 9.094 0 0 0-3.741-.479m14.764-2.488a3 3 0 1 0-4.592-2.122m-7.284-2.72a3 3 0 1 0-4.592-2.122" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a3.375 3.375 0 1 0 0 6.75 3.375 3.375 0 0 0 0-6.75Z" />
    </svg>
);

export default UsersIcon;
