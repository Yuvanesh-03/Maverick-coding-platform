import React from 'react';
import { UserProfile, UserActivity } from '../../types';
import TrophyIcon from '../icons/TrophyIcon';
import StarIcon from '../icons/StarIcon';
import TargetIcon from '../icons/TargetIcon';
import { XP_VALUES } from '../../utils/xp';

interface PointsDetailsModalProps {
    user: UserProfile;
    isOpen: boolean;
    onClose: () => void;
}

const PointsDetailsModal: React.FC<PointsDetailsModalProps> = ({ user, isOpen, onClose }) => {
    // Calculate XP breakdown from user activities
    const getXpBreakdown = () => {
        if (!user.activity || user.activity.length === 0) {
            return {
                assessmentXp: 0,
                quizXp: 0,
                playgroundXp: 0,
                dailyMissionXp: 0,
                hackathonXp: 0,
                totalFromActivities: 0
            };
        }

        const breakdown = user.activity.reduce((acc, activity) => {
            switch (activity.type) {
                case 'assessment':
                    const assessmentPoints = activity.score && activity.score > 80 ? 50 : 15;
                    acc.assessmentXp += assessmentPoints;
                    break;
                case 'quiz':
                    acc.quizXp += 25;
                    break;
                case 'playground':
                    acc.playgroundXp += 10;
                    break;
                default:
                    break;
            }
            return acc;
        }, {
            assessmentXp: 0,
            quizXp: 0,
            playgroundXp: 0,
            dailyMissionXp: 0,
            hackathonXp: 0,
            totalFromActivities: 0
        });

        // Add points from other sources
        breakdown.dailyMissionXp = (user.questionsSolved || 0) * XP_VALUES.DAILY_MISSION;
        breakdown.hackathonXp = (user.hackathonResults?.length || 0) * XP_VALUES.CHALLENGE_PARTICIPATION;
        
        breakdown.totalFromActivities = Object.values(breakdown).reduce((sum, val) => sum + val, 0);

        return breakdown;
    };

    const xpBreakdown = getXpBreakdown();
    const currentXp = user.xp || 0;

    // XP earning opportunities
    const xpOpportunities = [
        {
            activity: 'Daily Mission',
            points: XP_VALUES.DAILY_MISSION,
            description: 'Complete a daily coding challenge',
            frequency: 'Daily',
            icon: '🎯',
            color: 'from-blue-500 to-cyan-500'
        },
        {
            activity: 'Assessment (High Score)',
            points: XP_VALUES.ASSESSMENT_PASSED,
            description: 'Score 80% or higher on skill assessments',
            frequency: 'Per assessment',
            icon: '📊',
            color: 'from-green-500 to-emerald-500'
        },
        {
            activity: 'Concept Problem',
            points: XP_VALUES.CONCEPT_SOLVE,
            description: 'Solve coding concept problems',
            frequency: 'Per problem',
            icon: '🧩',
            color: 'from-purple-500 to-indigo-500'
        },
        {
            activity: 'Hackathon Participation',
            points: XP_VALUES.CHALLENGE_PARTICIPATION,
            description: 'Participate in coding challenges',
            frequency: 'Per event',
            icon: '🏆',
            color: 'from-orange-500 to-red-500'
        },
        {
            activity: 'Quiz Completion',
            points: 25,
            description: 'Complete practice quizzes',
            frequency: 'Per quiz',
            icon: '❓',
            color: 'from-yellow-500 to-orange-500'
        },
        {
            activity: 'Playground Practice',
            points: 10,
            description: 'Practice coding in the playground',
            frequency: 'Per session',
            icon: '⚡',
            color: 'from-pink-500 to-rose-500'
        }
    ];

    // Recent XP activities (last 10)
    const recentActivities = user.activity?.slice(-10).reverse() || [];

    const getActivityXp = (activity: UserActivity) => {
        switch (activity.type) {
            case 'assessment':
                return activity.score && activity.score > 80 ? 50 : 15;
            case 'quiz':
                return 25;
            case 'playground':
                return 10;
            default:
                return 5;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const formatFullDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
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
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-full blur-2xl animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse-slow"></div>
                
                <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-yellow-500/20 rounded-full">
                            <TrophyIcon className="h-8 w-8 text-yellow-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">Your Points Breakdown</h2>
                            <p className="text-slate-300">Track your XP sources and opportunities</p>
                        </div>
                    </div>

                    {/* Current XP Display */}
                    <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl p-6 mb-6 text-center">
                        <div className="text-4xl font-bold text-yellow-400 mb-2">{currentXp.toLocaleString()}</div>
                        <div className="text-slate-300">Total Experience Points</div>
                        <div className="text-sm text-slate-400 mt-1">Level {user.level || 1}</div>
                    </div>

                    {/* XP Sources Breakdown */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <StarIcon className="h-5 w-5 text-yellow-400" />
                            Points Sources
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            {xpBreakdown.assessmentXp > 0 && (
                                <div className="bg-white/10 rounded-lg p-3">
                                    <div className="text-lg font-bold text-green-400">{xpBreakdown.assessmentXp}</div>
                                    <div className="text-sm text-slate-300">Assessments</div>
                                </div>
                            )}
                            {xpBreakdown.quizXp > 0 && (
                                <div className="bg-white/10 rounded-lg p-3">
                                    <div className="text-lg font-bold text-blue-400">{xpBreakdown.quizXp}</div>
                                    <div className="text-sm text-slate-300">Quizzes</div>
                                </div>
                            )}
                            {xpBreakdown.dailyMissionXp > 0 && (
                                <div className="bg-white/10 rounded-lg p-3">
                                    <div className="text-lg font-bold text-purple-400">{xpBreakdown.dailyMissionXp}</div>
                                    <div className="text-sm text-slate-300">Daily Missions</div>
                                </div>
                            )}
                            {xpBreakdown.hackathonXp > 0 && (
                                <div className="bg-white/10 rounded-lg p-3">
                                    <div className="text-lg font-bold text-orange-400">{xpBreakdown.hackathonXp}</div>
                                    <div className="text-sm text-slate-300">Hackathons</div>
                                </div>
                            )}
                            {xpBreakdown.playgroundXp > 0 && (
                                <div className="bg-white/10 rounded-lg p-3">
                                    <div className="text-lg font-bold text-pink-400">{xpBreakdown.playgroundXp}</div>
                                    <div className="text-sm text-slate-300">Playground</div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Activities */}
                    {recentActivities.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-white mb-3">Assessment History & Recent XP Activities</h3>
                            <div className="space-y-3 max-h-48 overflow-y-auto">
                                {recentActivities.map((activity, index) => (
                                    <div key={index} className="bg-white/5 rounded-lg p-4 border-l-4 border-l-blue-500/50">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg">
                                                    {activity.type === 'assessment' ? '📊' : 
                                                     activity.type === 'quiz' ? '❓' : '⚡'}
                                                </span>
                                                <div className="text-white font-medium capitalize">{activity.type}</div>
                                                {activity.language && (
                                                    <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">
                                                        {activity.language}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-green-400 font-bold">+{getActivityXp(activity)} XP</div>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="text-slate-400">
                                                <span className="font-medium">When:</span> {formatFullDate(activity.date)}
                                            </div>
                                            {activity.score && (
                                                <div className={`font-medium ${
                                                    activity.score >= 80 ? 'text-green-400' : 
                                                    activity.score >= 60 ? 'text-yellow-400' : 'text-red-400'
                                                }`}>
                                                    Score: {activity.score}%
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Earning Opportunities */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <TargetIcon className="h-5 w-5 text-blue-400" />
                            Ways to Earn More XP
                        </h3>
                        <div className="space-y-3">
                            {xpOpportunities.map((opportunity, index) => (
                                <div key={index} className={`bg-gradient-to-r ${opportunity.color} p-0.5 rounded-lg`}>
                                    <div className="bg-slate-800 rounded-lg p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl">{opportunity.icon}</span>
                                                <div>
                                                    <div className="text-white font-semibold">{opportunity.activity}</div>
                                                    <div className="text-sm text-slate-300">{opportunity.description}</div>
                                                    <div className="text-xs text-slate-400">{opportunity.frequency}</div>
                                                </div>
                                            </div>
                                            <div className="text-xl font-bold text-yellow-400">+{opportunity.points}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tips */}
                    <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-4">
                        <h4 className="text-blue-300 font-semibold mb-2">💡 Pro Tips</h4>
                        <ul className="text-slate-300 text-sm space-y-1">
                            <li>• Focus on high-scoring assessments for maximum XP</li>
                            <li>• Complete daily missions consistently for steady progress</li>
                            <li>• Participate in hackathons for bonus XP and achievements</li>
                            <li>• Practice regularly in playground to build momentum</li>
                        </ul>
                    </div>
                </div>
                </div>
            </div>
        </>
    );
};

export default PointsDetailsModal;
