import React from 'react';

interface GiftIconProps {
  className?: string;
}

const GiftIcon: React.FC<GiftIconProps> = ({ className = "h-6 w-6" }) => {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M7 8h10l4 12H3l4-12Z" />
      <path d="M6 4a2 2 0 1 1 4 4h4a2 2 0 1 1 4-4 2 2 0 1 1-4 4H10a2 2 0 1 1-4-4Z" />
    </svg>
  );
};

export default GiftIcon;
