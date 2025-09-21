import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, Notification } from '../../types';
import BirdIcon from '../icons/BirdIcon';
import BellIcon from '../icons/BellIcon';
import NotificationDropdown from '../NotificationDropdown';
import StreakDropdown from '../StreakDropdown';
import ThemeToggle from '../ui/ThemeToggle';
import SearchBar from '../SearchBar';

type AppView = 'general' | 'learning_path' | 'assessment' | 'hackathons' | 'playground' | 'admin' | 'profile' | 'leaderboard' | 'analytics' | 'discussions' | 'reports' | 'story_mode' | 'events';

interface HeaderProps {
    user: UserProfile;
    notifications: Notification[];
    onMarkAllRead: () => void;
    currentStreak: number;
    onNavigate: (view: AppView) => void;
    onSelectConcept?: (slug: string) => void;
    onStartChallenge?: (language: string) => void;
}

const Header: React.FC<HeaderProps> = ({ user, notifications, onMarkAllRead, currentStreak, onNavigate, onSelectConcept, onStartChallenge }) => {
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isStreakOpen, setIsStreakOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const notificationRef = useRef<HTMLDivElement>(null);
    const streakRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setIsNotificationOpen(false);
            }
            if (streakRef.current && !streakRef.current.contains(event.target as Node)) {
                setIsStreakOpen(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="sticky top-0 z-30 glass-effect h-20 flex items-center border-b border-slate-200/20 dark:border-slate-700/30 shadow-lg">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                {/* Left side is empty to align with sidebar */}
                <div className="w-64"></div>
                
                {/* Center: Search Bar */}
                <div className="flex-grow flex justify-center">
                    <SearchBar 
                        user={user}
                        onNavigate={onNavigate}
                        onSelectConcept={onSelectConcept}
                        onStartChallenge={onStartChallenge}
                    />
                </div>

                {/* Right Side: Actions */}
                <div className="w-64 flex items-center justify-end space-x-4">
                    <ThemeToggle size="md" />
                    <div ref={notificationRef} className="relative">
                        <button onClick={() => setIsNotificationOpen(p => !p)} className="p-2 rounded-full text-slate-300 dark:text-slate-300 hover:bg-purple-500/20 transition-colors duration-200">
                            <BellIcon className="h-6 w-6"/>
                            {unreadCount > 0 && (
                                <span className="absolute top-0 right-0 flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-500 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                                </span>
                            )}
                        </button>
                        {isNotificationOpen && (
                            <NotificationDropdown
                                notifications={notifications}
                                onClose={() => setIsNotificationOpen(false)}
                                onMarkAllRead={onMarkAllRead}
                            />
                        )}
                    </div>
                    
                    <div ref={profileRef} className="relative">
                        <button onClick={() => setIsProfileOpen(p => !p)} className="flex items-center gap-2">
                             <div className="relative">
                                <img src={user.avatar} alt="User avatar" className="w-10 h-10 rounded-full border-2 border-[#e2e8f0] dark:border-gray-600" />
                                <span className="absolute -bottom-1 -right-1 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
                                    {user.level || 1}
                                </span>
                            </div>
                        </button>
                         {isProfileOpen && (
                            <div className="absolute top-14 right-0 w-48 glass-effect border border-slate-200/30 dark:border-slate-700/30 rounded-lg shadow-xl animate-scale-in z-50">
                                <div className="p-2">
                                     <div className="px-2 py-2">
                                        <p className="text-sm font-semibold text-[#2d3748] dark:text-gray-100">{user.name}</p>
                                        <p className="text-xs text-[#718096] dark:text-gray-400 truncate">{user.email}</p>
                                    </div>
                                    <div className="border-t border-[#e2e8f0] dark:border-gray-700 my-1"></div>
                                    <a href="#/profile" onClick={() => setIsProfileOpen(false)} className="block w-full text-left px-2 py-2 text-sm text-[#4a5568] dark:text-gray-300 hover:bg-[#f7fafc] dark:hover:bg-gray-700/50 rounded">My Profile</a>
                                    <a href="#/leaderboard" onClick={() => setIsProfileOpen(false)} className="block w-full text-left px-2 py-2 text-sm text-[#4a5568] dark:text-gray-300 hover:bg-[#f7fafc] dark:hover:bg-gray-700/50 rounded">Leaderboard</a>
                                    <div className="border-t border-[#e2e8f0] dark:border-gray-700 my-1"></div>
                                    <button className="w-full text-left px-2 py-2 text-sm text-[#f56565] hover:bg-[#f56565]/10 rounded">Sign Out</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;