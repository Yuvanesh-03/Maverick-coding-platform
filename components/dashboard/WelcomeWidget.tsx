import React, { useState, useEffect, useMemo } from 'react';
import { UserProfile } from '../../types';
import StatCard from './StatCard';
import CircularProgress from './CircularProgress';
import ArrowTrendingUpIcon from '../icons/ArrowTrendingUpIcon';
import FireIcon from '../icons/FireIcon';
import TrophyIcon from '../icons/TrophyIcon';
import BadgeIcon from '../icons/BadgeIcon';
import { getAllUsers } from '../../services/authService';
import { 
    calculateStreak, 
    calculateUserRank, 
    calculateXpTrend, 
    calculateStreakTrend, 
    calculateRankTrend, 
    formatRank 
} from '../../utils/userStats';
import { 
    StreakDetailsModal, 
    PointsDetailsModal, 
    LevelDetailsModal, 
    RankingDetailsModal 
} from '../modals';

interface WelcomeWidgetProps {
    user: UserProfile;
    currentStreak?: number;
}

const getLevelBadge = (level: number) => {
    let tier = 'Bronze';
    let gradient = 'from-[#cd7f32] to-[#c0c0c0]'; // Bronze-ish
    if (level >= 30) {
        tier = 'Platinum';
        gradient = 'from-[#9f7aea] to-[#e2e8f0]';
    } else if (level >= 20) {
        tier = 'Gold';
        gradient = 'from-[#f6ad55] to-[#fbd38d]';
    } else if (level >= 10) {
        tier = 'Silver';
        gradient = 'from-[#e2e8f0] to-[#b8c2cc]';
    }

    return (
        <div className={`px-3 py-1 rounded-full text-white text-base font-bold bg-gradient-to-r ${gradient} inline-block shadow-md`}>
            {tier} {level}
        </div>
    );
};


const WelcomeWidget: React.FC<WelcomeWidgetProps> = ({ user, currentStreak = 0 }) => {
    const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
    const [userRank, setUserRank] = useState<number>(0);
    const [rankTrend, setRankTrend] = useState<number>(0);
    const [xpTrend, setXpTrend] = useState<number>(0);
    const [streakTrend, setStreakTrend] = useState<number>(1);
    
    // Modal states
    const [isStreakModalOpen, setIsStreakModalOpen] = useState(false);
    const [isPointsModalOpen, setIsPointsModalOpen] = useState(false);
    const [isLevelModalOpen, setIsLevelModalOpen] = useState(false);
    const [isRankingModalOpen, setIsRankingModalOpen] = useState(false);

    // Fetch all users to calculate ranking
    useEffect(() => {
        getAllUsers()
            .then(users => {
                setAllUsers(users);
                
                // Calculate user's rank
                const { rank } = calculateUserRank(user, users);
                setUserRank(rank);
                
                // Calculate trends using utility functions
                const xpTrendValue = calculateXpTrend(user.activity || []);
                setXpTrend(xpTrendValue);
                
                const rankTrendValue = calculateRankTrend(user.activity || []);
                setRankTrend(rankTrendValue);
            })
            .catch(console.error);
    }, [user.id, user.activity]);

    // Calculate current streak from user activity if not provided
    const calculatedStreak = useMemo(() => {
        if (currentStreak > 0) return currentStreak;
        return calculateStreak(user.activity || []);
    }, [user.activity, currentStreak]);
    
    // Calculate streak trend
    const calculatedStreakTrend = useMemo(() => {
        return calculateStreakTrend(calculatedStreak);
    }, [calculatedStreak]);
    const today = new Date();
    const dateString = today.toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const modules = user.learningPaths?.flatMap(p => p.modules) || [];
    const totalModules = modules.length;
    const completedModules = modules.filter(m => m.completed).length;
    const overallProgress = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

    return (
        <div className="glass-effect rounded-[24px] p-6 card-3d-hover transition-all duration-300 border border-slate-200/20 dark:border-slate-700/30 relative overflow-hidden">
            {/* Animated background shapes inside the card */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-2xl animate-morph"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-xl animate-pulse-slow"></div>
            <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Left Side: Greeting & Progress */}
                <div className="flex-grow">
                    <p className="text-[12px] font-normal text-slate-400 dark:text-slate-300 relative z-10">{dateString}</p>
                    <h2 className="text-3xl font-bold text-slate-100 dark:text-slate-100 mt-1 relative z-10">
                        Welcome back, <span className="text-gradient">{user.name.split(' ')[0]}!</span>
                    </h2>
                    <p className="text-[16px] font-normal text-slate-200 dark:text-slate-300 mt-2 leading-relaxed relative z-10">
                        "The best way to predict the future is to create it." Let's build something amazing today.
                    </p>
                </div>
                {/* Right Side: Circular Progress */}
                <div className="flex-shrink-0">
                    <CircularProgress percentage={overallProgress} userAvatar={user.avatar} />
                </div>
            </div>

            {/* Bottom Stats */}
            <div className="mt-6 pt-6 border-t border-slate-200/20 dark:border-slate-700/30 grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
                <div onClick={() => setIsPointsModalOpen(true)} className="cursor-pointer transform transition-all duration-200 hover:scale-105">
                    <StatCard 
                        title="Total Points"
                        icon={<TrophyIcon className="h-6 w-6 text-[#f6ad55]" />}
                        value={user.xp || 0}
                        trend={xpTrend}
                    />
                </div>
                 <div onClick={() => setIsLevelModalOpen(true)} className="cursor-pointer transform transition-all duration-200 hover:scale-105">
                    <StatCard 
                        title="Current Level"
                        icon={<BadgeIcon className="h-6 w-6 text-[#9f7aea]" />}
                        valueComponent={getLevelBadge(user.level || 1)}
                        trend={null}
                    />
                </div>
                 <div onClick={() => setIsStreakModalOpen(true)} className="cursor-pointer transform transition-all duration-200 hover:scale-105">
                    <StatCard 
                        title="Current Streak"
                        icon={<FireIcon className="h-6 w-6 text-[#f56565]" />}
                        value={calculatedStreak}
                        trend={calculatedStreakTrend}
                    />
                </div>
                 <div onClick={() => setIsRankingModalOpen(true)} className="cursor-pointer transform transition-all duration-200 hover:scale-105">
                    <StatCard 
                        title="Rank Position"
                        icon={<ArrowTrendingUpIcon className="h-6 w-6 text-[#48bb78]" />}
                        value={formatRank(userRank)}
                        trend={rankTrend}
                    />
                </div>
            </div>
            
            {/* Detail Modals */}
            <StreakDetailsModal 
                user={user}
                isOpen={isStreakModalOpen}
                onClose={() => setIsStreakModalOpen(false)}
                currentStreak={calculatedStreak}
            />
            
            <PointsDetailsModal 
                user={user}
                isOpen={isPointsModalOpen}
                onClose={() => setIsPointsModalOpen(false)}
            />
            
            <LevelDetailsModal 
                user={user}
                isOpen={isLevelModalOpen}
                onClose={() => setIsLevelModalOpen(false)}
            />
            
            <RankingDetailsModal 
                user={user}
                isOpen={isRankingModalOpen}
                onClose={() => setIsRankingModalOpen(false)}
            />
        </div>
    );
};

export default WelcomeWidget;