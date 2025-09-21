import React from 'react';

interface CircularProgressProps {
    percentage: number;
    userAvatar: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({ percentage, userAvatar }) => {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative w-32 h-32">
            <svg className="w-full h-full" viewBox="0 0 120 120">
                <circle
                    className="text-gray-200 dark:text-gray-700"
                    strokeWidth="10"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="60"
                    cy="60"
                />
                <circle
                    className="text-blue-500 animate-progress-ring"
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    style={{ strokeDashoffset: offset }}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="60"
                    cy="60"
                    transform="rotate(-90 60 60)"
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                 <img src={userAvatar} alt="User" className="w-24 h-24 rounded-full border-4 border-white dark:border-[#161b22]" />
            </div>
        </div>
    );
};

export default CircularProgress;
