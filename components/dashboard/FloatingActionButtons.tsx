import React, { useState } from 'react';
import PlusIcon from '../icons/PlusIcon';
import CodeIcon from '../icons/CodeIcon';
import BookOpenIcon from '../icons/BookOpenIcon';
import TrophyIcon from '../icons/TrophyIcon';
import UserIcon from '../icons/UserIcon';

const FloatingActionButtons: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const actions = [
        { label: 'Story Mode', icon: '📚', color: 'bg-indigo-500', href: '#/story_mode' },
        { label: 'Themed Events', icon: '🎉', color: 'bg-orange-500', href: '#/events' },
        { label: 'Start Challenge', icon: <CodeIcon className="h-5 w-5" />, color: 'bg-green-500', href: '#/assessment' },
        { label: 'Continue Learning', icon: <BookOpenIcon className="h-5 w-5" />, color: 'bg-blue-500', href: '#/learning_path' },
        { label: 'Join Hackathon', icon: <TrophyIcon className="h-5 w-5" />, color: 'bg-purple-500', href: '#/hackathons' },
        { label: 'View Profile', icon: <UserIcon className="h-5 w-5" />, color: 'bg-gray-500', href: '#/profile' },
    ];

    return (
        <div className="fixed bottom-8 right-8 z-40">
            <div className="relative flex flex-col items-center gap-3">
                {/* Secondary Action Buttons */}
                {actions.map((action, index) => (
                    <a
                        key={action.label}
                        href={action.href}
                        className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 ease-in-out transform ${action.color} ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'}`}
                        style={{ transitionDelay: isOpen ? `${(actions.length - index - 1) * 50}ms` : `${index * 50}ms` }}
                        title={action.label}
                    >
                        {typeof action.icon === 'string' ? (
                            <span className="text-xl">{action.icon}</span>
                        ) : (
                            action.icon
                        )}
                    </a>
                ))}
                
                {/* Primary FAB */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-xl hover:bg-blue-700 transition-transform duration-200 transform hover:scale-110 focus:outline-none"
                    aria-label="Open quick actions"
                >
                    <PlusIcon className={`h-7 w-7 transition-transform duration-300 ${isOpen ? 'rotate-45' : 'rotate-0'}`} />
                </button>
            </div>
        </div>
    );
};

export default FloatingActionButtons;
