import React from 'react';
import { UserActivity } from '../types';
import CodeIcon from './icons/CodeIcon';
import TrophyIcon from './icons/TrophyIcon';
import FireIcon from './icons/FireIcon'; // Assuming a new icon for achievements
import CheckIcon from './icons/CheckIcon';

interface ActivityFeedProps {
    activity: UserActivity[];
}

const ActivityIcon: React.FC<{ type: UserActivity['type'], isNew: boolean }> = ({ type, isNew }) => {
    // For this implementation, all past activities are considered 'completed'
    // and will use the green checkmark style as requested.
    const bgColor = 'bg-[#48bb78]'; // Green for completed tasks

    return (
        <div className={`absolute left-0 top-1 flex items-center justify-center h-6 w-6 rounded-full z-10 ${bgColor} ${isNew ? 'animate-icon-pulse' : ''}`}>
            <CheckIcon className="h-4 w-4 text-white" />
        </div>
    );
};

const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return `${Math.floor(interval)} years ago`;
    
    interval = seconds / 2592000;
    if (interval > 1) return `${Math.floor(interval)} months ago`;
    
    interval = seconds / 86400;
    if (interval > 1) return `${Math.floor(interval)} days ago`;

    interval = seconds / 3600;
    if (interval > 1) return `${Math.floor(interval)} hours ago`;
    
    interval = seconds / 60;
    if (interval > 1) return `${Math.floor(interval)} minutes ago`;
    
    return 'Just now';
};


const ActivityFeed: React.FC<ActivityFeedProps> = ({ activity }) => {
    const recentActivity = [...activity].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 7);

    return (
        <div className="bg-[#ffffff] p-6 rounded-[12px] border border-[#e2e8f0] shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-200 h-full">
            <h3 className="text-[18px] font-semibold text-[#2d3748] mb-6">Recent Activity</h3>
            {recentActivity.length > 0 ? (
                <div className="relative pl-4">
                    {/* Timeline bar */}
                    <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-[#e2e8f0]"></div>
                    
                    <ul className="space-y-4">
                        {recentActivity.map((act, index) => (
                            <li key={act.resultId || index} className="relative flex items-start gap-4 p-2 -ml-2 rounded-lg hover:bg-[#f7fafc] transition-colors duration-200 animate-slide-in-right" style={{ animationDelay: `${index * 100}ms` }}>
                                {/* Timeline indicator */}
                                <ActivityIcon type={act.type} isNew={index === 0} />
                                <div className="ml-8">
                                    <p className="text-[16px] font-normal text-[#4a5568]">
                                        Completed a {act.type} in {act.language}
                                    </p>
                                    <p className="text-[12px] font-normal text-[#718096]">
                                        {act.score !== undefined ? `Scored ${act.score}%` : ''} • {formatRelativeTime(act.date)}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p className="text-sm text-[#718096] text-center py-8">No recent activity to display.</p>
            )}
        </div>
    );
};

export default ActivityFeed;
