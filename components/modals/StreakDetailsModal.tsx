import React from 'react';
import { UserProfile } from '../../types';
import FireIcon from '../icons/FireIcon';
import CalendarIcon from '../icons/CalendarIcon';
import CheckIcon from '../icons/CheckIcon';

interface StreakDetailsModalProps {
    user: UserProfile;
    isOpen: boolean;
    onClose: () => void;
    currentStreak: number;
}

const StreakDetailsModal: React.FC<StreakDetailsModalProps> = ({ user, isOpen, onClose, currentStreak }) => {
    // Calculate detailed streak information
    const getStreakDetails = () => {
        if (!user.activity || user.activity.length === 0) {
            return {
                activeDays: [],
                longestStreak: 0,
                currentStreakDates: [],
                totalActiveDays: 0
            };
        }

        const toDateString = (date: Date) => date.toISOString().split('T')[0];
        
        // Get all unique activity dates
        const activityDates = Array.from(new Set(
            user.activity.map(activity => toDateString(new Date(activity.date)))
        )).sort();

        // Calculate current streak dates
        const currentStreakDates = [];
        let checkDate = new Date();
        const activityDateSet = new Set(activityDates);

        if (activityDateSet.has(toDateString(checkDate))) {
            currentStreakDates.unshift(toDateString(checkDate));
            checkDate.setDate(checkDate.getDate() - 1);
            
            while (activityDateSet.has(toDateString(checkDate))) {
                currentStreakDates.unshift(toDateString(checkDate));
                checkDate.setDate(checkDate.getDate() - 1);
            }
        }

        // Calculate longest streak
        let longestStreak = 0;
        let tempStreak = 0;
        
        for (let i = 0; i < activityDates.length; i++) {
            if (i === 0) {
                tempStreak = 1;
            } else {
                const prevDate = new Date(activityDates[i - 1]);
                const currDate = new Date(activityDates[i]);
                const dayDiff = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
                
                if (dayDiff === 1) {
                    tempStreak++;
                } else {
                    longestStreak = Math.max(longestStreak, tempStreak);
                    tempStreak = 1;
                }
            }
        }
        longestStreak = Math.max(longestStreak, tempStreak);

        return {
            activeDays: activityDates,
            longestStreak,
            currentStreakDates,
            totalActiveDays: activityDates.length
        };
    };

    const streakData = getStreakDetails();

    // Generate calendar view for the last 30 days
    const generateCalendarDays = () => {
        const days = [];
        const today = new Date();
        const activityDateSet = new Set(streakData.activeDays);
        
        for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateString = date.toISOString().split('T')[0];
            
            days.push({
                date: dateString,
                day: date.getDate(),
                isActive: activityDateSet.has(dateString),
                isToday: i === 0,
                isCurrentStreak: streakData.currentStreakDates.includes(dateString)
            });
        }
        
        return days;
    };

    const calendarDays = generateCalendarDays();

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Full screen overlay */}
            <div 
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] transition-all duration-300"
                onClick={onClose}
            ></div>
            
            {/* Full screen modal content */}
            <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
                <div className="w-full max-w-6xl max-h-[95vh] overflow-y-auto bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                
                {/* Animated background */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full blur-2xl animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-full blur-xl animate-pulse-slow"></div>
                
                <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-orange-500/20 rounded-full">
                            <FireIcon className="h-8 w-8 text-orange-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">Your Streak Details</h2>
                            <p className="text-slate-300">Track your coding consistency</p>
                        </div>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-white/10 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-orange-400">{currentStreak}</div>
                            <div className="text-sm text-slate-300">Current Streak</div>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-yellow-400">{streakData.longestStreak}</div>
                            <div className="text-sm text-slate-300">Longest Streak</div>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-green-400">{streakData.totalActiveDays}</div>
                            <div className="text-sm text-slate-300">Total Active Days</div>
                        </div>
                    </div>

                    {/* Calendar View */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                            <CalendarIcon className="h-5 w-5" />
                            Last 30 Days Activity
                        </h3>
                        <div className="grid grid-cols-10 gap-2">
                            {calendarDays.map((day, index) => (
                                <div
                                    key={index}
                                    className={`
                                        w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold transition-all duration-200
                                        ${day.isActive 
                                            ? day.isCurrentStreak 
                                                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/50' 
                                                : 'bg-green-500 text-white'
                                            : 'bg-slate-700 text-slate-400'
                                        }
                                        ${day.isToday ? 'ring-2 ring-blue-400' : ''}
                                    `}
                                    title={`${formatDate(day.date)} - ${day.isActive ? 'Active' : 'Inactive'}`}
                                >
                                    {day.day}
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center gap-4 mt-3 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-orange-500 rounded"></div>
                                <span className="text-slate-300">Current Streak</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-green-500 rounded"></div>
                                <span className="text-slate-300">Active Day</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-slate-700 rounded"></div>
                                <span className="text-slate-300">Inactive</span>
                            </div>
                        </div>
                    </div>

                    {/* Current Streak Details */}
                    {streakData.currentStreakDates.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                <CheckIcon className="h-5 w-5 text-green-400" />
                                Current Streak Dates
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {streakData.currentStreakDates.map((date, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-sm font-medium"
                                    >
                                        {formatDate(date)}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Tips */}
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                        <h4 className="text-blue-300 font-semibold mb-2">💡 Tips to Maintain Your Streak</h4>
                        <ul className="text-slate-300 text-sm space-y-1">
                            <li>• Complete daily missions to maintain activity</li>
                            <li>• Take assessments or practice coding challenges</li>
                            <li>• Participate in discussions or hackathons</li>
                            <li>• Even small activities count - consistency is key!</li>
                        </ul>
                    </div>
                </div>
                </div>
            </div>
        </>
    );
};

export default StreakDetailsModal;
