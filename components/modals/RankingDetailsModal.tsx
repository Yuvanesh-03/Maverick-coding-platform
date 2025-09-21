import React, { useState, useEffect } from 'react';
import { UserProfile } from '../../types';
import ArrowTrendingUpIcon from '../icons/ArrowTrendingUpIcon';
import TrophyIcon from '../icons/TrophyIcon';
import UsersIcon from '../icons/UsersIcon';
import { getAllUsers } from '../../services/authService';
import { calculateUserRank, formatRank } from '../../utils/userStats';

interface RankingDetailsModalProps {
    user: UserProfile;
    isOpen: boolean;
    onClose: () => void;
}

const RankingDetailsModal: React.FC<RankingDetailsModalProps> = ({ user, isOpen, onClose }) => {
    const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [rankingData, setRankingData] = useState<{
        currentRank: number;
        totalUsers: number;
        nearbyUsers: UserProfile[];
        topUsers: UserProfile[];
        percentile: number;
    } | null>(null);

    useEffect(() => {
        if (!isOpen) return;

        const fetchRankingData = async () => {
            setLoading(true);
            try {
                const users = await getAllUsers();
                setAllUsers(users);

                // Sort users by XP in descending order
                const sortedUsers = [...users].sort((a, b) => (b.xp || 0) - (a.xp || 0));
                
                // Get current user's ranking
                const { rank, totalUsers } = calculateUserRank(user, users);
                const currentUserIndex = sortedUsers.findIndex(u => u.id === user.id);

                // Get nearby users (±3 positions)
                const nearbyStart = Math.max(0, currentUserIndex - 3);
                const nearbyEnd = Math.min(sortedUsers.length, currentUserIndex + 4);
                const nearbyUsers = sortedUsers.slice(nearbyStart, nearbyEnd);

                // Get top 10 users
                const topUsers = sortedUsers.slice(0, 10);

                // Calculate percentile
                const percentile = Math.round(((totalUsers - rank + 1) / totalUsers) * 100);

                setRankingData({
                    currentRank: rank,
                    totalUsers,
                    nearbyUsers,
                    topUsers,
                    percentile
                });
            } catch (error) {
                console.error('Error fetching ranking data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRankingData();
    }, [isOpen, user.id]);

    const getRankBadgeColor = (rank: number) => {
        if (rank === 1) return 'from-yellow-400 to-yellow-600'; // Gold
        if (rank <= 3) return 'from-gray-300 to-gray-500'; // Silver
        if (rank <= 10) return 'from-orange-400 to-orange-600'; // Bronze
        return 'from-slate-400 to-slate-600'; // Default
    };

    const getRankIcon = (rank: number) => {
        if (rank === 1) return '👑';
        if (rank <= 3) return '🥈';
        if (rank <= 10) return '🥉';
        return '📊';
    };

    const formatDateJoined = (user: UserProfile) => {
        // Mock joined date calculation - in real app, you'd have this data
        const mockJoinedDays = Math.floor(Math.random() * 365) + 30;
        const joinedDate = new Date();
        joinedDate.setDate(joinedDate.getDate() - mockJoinedDays);
        return joinedDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
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
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-full blur-2xl animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse-slow"></div>
                
                <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-green-500/20 rounded-full">
                            <ArrowTrendingUpIcon className="h-8 w-8 text-green-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">Your Ranking Details</h2>
                            <p className="text-slate-300">See where you stand among all users</p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-400 mx-auto mb-4"></div>
                            <p className="text-slate-300">Loading ranking data...</p>
                        </div>
                    ) : rankingData ? (
                        <>
                            {/* Current Rank Display */}
                            <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-2xl p-6 mb-6 text-center">
                                <div className="text-6xl font-bold text-green-400 mb-2">
                                    #{rankingData.currentRank.toLocaleString()}
                                </div>
                                <div className="text-xl text-slate-300 mb-2">Your Current Rank</div>
                                <div className="text-sm text-slate-400">
                                    Top {rankingData.percentile}% of {rankingData.totalUsers.toLocaleString()} users
                                </div>
                                <div className="mt-3">
                                    <span className="px-4 py-2 bg-green-500/20 text-green-300 rounded-full text-sm font-medium">
                                        {user.xp?.toLocaleString() || 0} XP
                                    </span>
                                </div>
                            </div>

                            {/* Ranking Stats */}
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="bg-white/10 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-blue-400">
                                        {rankingData.percentile}%
                                    </div>
                                    <div className="text-sm text-slate-300">Percentile</div>
                                </div>
                                <div className="bg-white/10 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-purple-400">
                                        {rankingData.totalUsers - rankingData.currentRank}
                                    </div>
                                    <div className="text-sm text-slate-300">Users Behind</div>
                                </div>
                                <div className="bg-white/10 rounded-lg p-4 text-center">
                                    <div className="text-2xl font-bold text-orange-400">
                                        {rankingData.currentRank - 1}
                                    </div>
                                    <div className="text-sm text-slate-300">Users Ahead</div>
                                </div>
                            </div>

                            {/* Top 10 Leaderboard */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <TrophyIcon className="h-5 w-5 text-yellow-400" />
                                    Top 10 Leaderboard
                                </h3>
                                <div className="space-y-2">
                                    {rankingData.topUsers.map((topUser, index) => {
                                        const rank = index + 1;
                                        const isCurrentUser = topUser.id === user.id;
                                        return (
                                            <div
                                                key={topUser.id}
                                                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                                                    isCurrentUser 
                                                        ? 'bg-green-500/20 border border-green-500/30' 
                                                        : 'bg-white/5'
                                                }`}
                                            >
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold bg-gradient-to-r ${getRankBadgeColor(rank)} text-white`}>
                                                    <span className="text-lg">{getRankIcon(rank)}</span>
                                                </div>
                                                <img 
                                                    src={topUser.avatar} 
                                                    alt={topUser.name}
                                                    className="w-10 h-10 rounded-full border-2 border-white/20"
                                                />
                                                <div className="flex-grow">
                                                    <div className={`font-semibold ${isCurrentUser ? 'text-green-300' : 'text-white'}`}>
                                                        {topUser.name} {isCurrentUser && '(You)'}
                                                    </div>
                                                    <div className="text-sm text-slate-400">
                                                        Level {topUser.level || 1} • Joined {formatDateJoined(topUser)}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className={`font-bold ${rank <= 3 ? 'text-yellow-400' : 'text-slate-300'}`}>
                                                        {(topUser.xp || 0).toLocaleString()} XP
                                                    </div>
                                                    <div className="text-sm text-slate-500">#{rank}</div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Nearby Users */}
                            {rankingData.currentRank > 10 && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                        <UsersIcon className="h-5 w-5 text-blue-400" />
                                        Your Neighborhood
                                    </h3>
                                    <div className="space-y-2">
                                        {rankingData.nearbyUsers.map((nearbyUser, index) => {
                                            const userRank = allUsers.sort((a, b) => (b.xp || 0) - (a.xp || 0))
                                                .findIndex(u => u.id === nearbyUser.id) + 1;
                                            const isCurrentUser = nearbyUser.id === user.id;
                                            return (
                                                <div
                                                    key={nearbyUser.id}
                                                    className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                                                        isCurrentUser 
                                                            ? 'bg-green-500/20 border border-green-500/30' 
                                                            : 'bg-white/5'
                                                    }`}
                                                >
                                                    <div className="w-8 text-center font-bold text-slate-300">
                                                        #{userRank}
                                                    </div>
                                                    <img 
                                                        src={nearbyUser.avatar} 
                                                        alt={nearbyUser.name}
                                                        className="w-8 h-8 rounded-full border border-white/20"
                                                    />
                                                    <div className="flex-grow">
                                                        <div className={`font-medium ${isCurrentUser ? 'text-green-300' : 'text-white'}`}>
                                                            {nearbyUser.name} {isCurrentUser && '(You)'}
                                                        </div>
                                                        <div className="text-sm text-slate-400">
                                                            Level {nearbyUser.level || 1}
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-semibold text-slate-300">
                                                            {(nearbyUser.xp || 0).toLocaleString()} XP
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Improvement Tips */}
                            <div className="bg-gradient-to-r from-blue-500/10 to-green-500/10 border border-blue-500/20 rounded-lg p-4">
                                <h4 className="text-blue-300 font-semibold mb-2">🎯 Climb the Rankings</h4>
                                <ul className="text-slate-300 text-sm space-y-1">
                                    <li>• Complete daily missions consistently for steady XP growth</li>
                                    <li>• Participate in hackathons for major ranking boosts</li>
                                    <li>• Focus on high-scoring assessments to maximize points</li>
                                    <li>• Solve coding problems regularly to stay ahead</li>
                                    {rankingData.currentRank > 100 && (
                                        <li>• Join the top 100 by earning {Math.ceil((allUsers.sort((a, b) => (b.xp || 0) - (a.xp || 0))[99]?.xp || 0) - (user.xp || 0))} more XP!</li>
                                    )}
                                </ul>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-slate-400">Unable to load ranking data. Please try again later.</p>
                        </div>
                    )}
                </div>
                </div>
            </div>
        </>
    );
};

export default RankingDetailsModal;
