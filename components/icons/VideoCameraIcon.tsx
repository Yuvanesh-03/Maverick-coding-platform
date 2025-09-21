import React from 'react';

interface VideoCameraIconProps {
  className?: string;
}

const VideoCameraIcon: React.FC<VideoCameraIconProps> = ({ className = "h-6 w-6" }) => {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M23 7l-7 5 7 5V7z" />
      <rect width="15" height="9" x="1" y="5" rx="2" ry="2" />
    </svg>
  );
};

export default VideoCameraIcon;
