import React from 'react';
import { UserProfile } from '../../types';
import BadgeIcon from '../icons/BadgeIcon';
import StarIcon from '../icons/StarIcon';
import TrophyIcon from '../icons/TrophyIcon';
import { calculateLevel } from '../../utils/xp';

interface LevelDetailsModalProps {
    user: UserProfile;
    isOpen: boolean;
    onClose: () => void;
}

const LevelDetailsModal: React.FC<LevelDetailsModalProps> = ({ user, isOpen, onClose }) => {
    const currentXp = user.xp || 0;
    const currentLevel = user.level || 1;

    // Level tier system
    const getLevelTier = (level: number) => {
        if (level >= 30) return { name: 'Platinum', color: 'from-purple-500 to-pink-500', bgColor: 'from-purple-500/20 to-pink-500/20' };
        if (level >= 20) return { name: 'Gold', color: 'from-yellow-500 to-orange-500', bgColor: 'from-yellow-500/20 to-orange-500/20' };
        if (level >= 10) return { name: 'Silver', color: 'from-gray-400 to-gray-500', bgColor: 'from-gray-400/20 to-gray-500/20' };
        return { name: 'Bronze', color: 'from-orange-600 to-red-600', bgColor: 'from-orange-600/20 to-red-600/20' };
    };

    // XP requirements for each level
    const getXpForLevel = (level: number) => {
        return level * level * 100;
    };

    // Calculate next level requirements
    const nextLevel = currentLevel + 1;
    const currentTier = getLevelTier(currentLevel);
    const nextTier = getLevelTier(nextLevel);
    const xpForCurrentLevel = getXpForLevel(currentLevel);
    const xpForNextLevel = getXpForLevel(nextLevel);
    const xpNeeded = xpForNextLevel - currentXp;
    const progressPercent = Math.max(0, Math.min(100, ((currentXp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100));

    // Level milestones and rewards
    const levelMilestones = [
        { level: 5, reward: 'First Assessment Badge', unlocked: currentLevel >= 5 },
        { level: 10, reward: 'Silver Tier Unlocked', unlocked: currentLevel >= 10 },
        { level: 15, reward: 'Advanced Features Access', unlocked: currentLevel >= 15 },
        { level: 20, reward: 'Gold Tier Unlocked', unlocked: currentLevel >= 20 },
        { level: 25, reward: 'Mentor Status', unlocked: currentLevel >= 25 },
        { level: 30, reward: 'Platinum Tier Unlocked', unlocked: currentLevel >= 30 },
        { level: 40, reward: 'Elite Coder Badge', unlocked: currentLevel >= 40 },
        { level: 50, reward: 'Master Developer', unlocked: currentLevel >= 50 },
    ];

    // Level progression path
    const levelPath = Array.from({ length: Math.min(10, 50 - currentLevel + 5) }, (_, i) => {
        const level = currentLevel - 2 + i;
        if (level < 1) return null;
        return {
            level,
            xpRequired: getXpForLevel(level),
            tier: getLevelTier(level),
            isCurrentLevel: level === currentLevel,
            isPassed: level < currentLevel,
            isNext: level === nextLevel
        };
    }).filter(Boolean);

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
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${currentTier.bgColor} rounded-full blur-2xl animate-pulse`}></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse-slow"></div>
                
                <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className={`p-3 bg-gradient-to-r ${currentTier.bgColor} rounded-full`}>
                            <BadgeIcon className={`h-8 w-8 text-white`} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">Level Progression</h2>
                            <p className="text-slate-300">Track your coding journey</p>
                        </div>
                    </div>

                    {/* Current Level Display */}
                    <div className={`bg-gradient-to-r ${currentTier.bgColor} rounded-2xl p-6 mb-6 text-center`}>
                        <div className={`text-6xl font-bold bg-gradient-to-r ${currentTier.color} bg-clip-text text-transparent mb-2`}>
                            {currentLevel}
                        </div>
                        <div className={`text-2xl font-bold bg-gradient-to-r ${currentTier.color} bg-clip-text text-transparent mb-1`}>
                            {currentTier.name} Tier
                        </div>
                        <div className="text-slate-300">{currentXp.toLocaleString()} XP</div>
                    </div>

                    {/* Next Level Progress */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-semibold text-white">Progress to Level {nextLevel}</h3>
                            <span className="text-sm text-slate-400">{progressPercent.toFixed(1)}%</span>
                        </div>
                        
                        <div className="w-full bg-slate-700 rounded-full h-4 mb-3">
                            <div 
                                className={`h-4 rounded-full bg-gradient-to-r ${nextTier.color} transition-all duration-500`}
                                style={{ width: `${progressPercent}%` }}
                            ></div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-400">{xpForCurrentLevel.toLocaleString()} XP</span>
                            <span className="text-white font-semibold">
                                {xpNeeded > 0 ? `${xpNeeded.toLocaleString()} XP needed` : 'Level Up Available!'}
                            </span>
                            <span className="text-slate-400">{xpForNextLevel.toLocaleString()} XP</span>
                        </div>
                        
                        {nextTier.name !== currentTier.name && (
                            <div className="mt-3 text-center">
                                <span className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 rounded-full text-sm font-medium">
                                    Next: {nextTier.name} Tier
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Level Path */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <StarIcon className="h-5 w-5 text-yellow-400" />
                            Level Path
                        </h3>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            {levelPath.map((levelInfo, index) => {
                                if (!levelInfo) return null;
                                return (
                                    <div 
                                        key={levelInfo.level} 
                                        className={`flex items-center gap-4 p-3 rounded-lg transition-all duration-200 ${
                                            levelInfo.isCurrentLevel 
                                                ? `bg-gradient-to-r ${levelInfo.tier.bgColor} border-2 border-white/20` 
                                                : levelInfo.isPassed 
                                                    ? 'bg-green-500/10 border border-green-500/20' 
                                                    : levelInfo.isNext
                                                        ? 'bg-blue-500/10 border border-blue-500/20'
                                                        : 'bg-white/5'
                                        }`}
                                    >
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                            levelInfo.isCurrentLevel
                                                ? `bg-gradient-to-r ${levelInfo.tier.color} text-white`
                                                : levelInfo.isPassed
                                                    ? 'bg-green-500 text-white'
                                                    : 'bg-slate-600 text-slate-300'
                                        }`}>
                                            {levelInfo.level}
                                        </div>
                                        <div className="flex-grow">
                                            <div className="flex items-center gap-2">
                                                <span className="text-white font-medium">Level {levelInfo.level}</span>
                                                <span className={`px-2 py-1 rounded text-xs font-medium bg-gradient-to-r ${levelInfo.tier.color} text-white`}>
                                                    {levelInfo.tier.name}
                                                </span>
                                            </div>
                                            <div className="text-sm text-slate-400">{levelInfo.xpRequired.toLocaleString()} XP</div>
                                        </div>
                                        {levelInfo.isCurrentLevel && (
                                            <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full">Current</span>
                                        )}
                                        {levelInfo.isNext && (
                                            <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">Next</span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Milestones */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <TrophyIcon className="h-5 w-5 text-yellow-400" />
                            Level Milestones & Rewards
                        </h3>
                        <div className="space-y-2">
                            {levelMilestones.map((milestone, index) => (
                                <div 
                                    key={index}
                                    className={`flex items-center gap-3 p-3 rounded-lg ${
                                        milestone.unlocked 
                                            ? 'bg-green-500/10 border border-green-500/20' 
                                            : 'bg-slate-700/50'
                                    }`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                        milestone.unlocked 
                                            ? 'bg-green-500 text-white' 
                                            : 'bg-slate-600 text-slate-400'
                                    }`}>
                                        {milestone.level}
                                    </div>
                                    <div className="flex-grow">
                                        <div className={`font-medium ${milestone.unlocked ? 'text-white' : 'text-slate-400'}`}>
                                            Level {milestone.level}
                                        </div>
                                        <div className={`text-sm ${milestone.unlocked ? 'text-green-300' : 'text-slate-500'}`}>
                                            {milestone.reward}
                                        </div>
                                    </div>
                                    {milestone.unlocked && (
                                        <span className="text-green-400">✓</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tips */}
                    <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-lg p-4">
                        <h4 className="text-purple-300 font-semibold mb-2">🚀 Level Up Faster</h4>
                        <ul className="text-slate-300 text-sm space-y-1">
                            <li>• Complete daily missions for consistent XP (+{150} XP each)</li>
                            <li>• Excel in assessments for bonus points (+{100} XP for high scores)</li>
                            <li>• Solve coding problems regularly (+{50} XP each)</li>
                            <li>• Participate in hackathons for major XP boosts (+{200} XP)</li>
                        </ul>
                    </div>
                </div>
                </div>
            </div>
        </>
    );
};

export default LevelDetailsModal;
