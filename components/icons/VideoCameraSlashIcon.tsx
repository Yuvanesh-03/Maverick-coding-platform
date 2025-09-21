import React from 'react';

interface VideoCameraSlashIconProps {
  className?: string;
}

const VideoCameraSlashIcon: React.FC<VideoCameraSlashIconProps> = ({ className = "h-6 w-6" }) => {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="m2 2 20 20" />
      <path d="M10.5 10.5c0 1.37-1.13 2.5-2.5 2.5s-2.5-1.13-2.5-2.5 1.13-2.5 2.5-2.5 2.5 1.13 2.5 2.5Z" />
      <path d="M23 7l-7 5 7 5V7z" />
      <rect width="15" height="9" x="1" y="5" rx="2" ry="2" />
    </svg>
  );
};

export default VideoCameraSlashIcon;
