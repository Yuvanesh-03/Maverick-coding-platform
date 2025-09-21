import React, { useState, useEffect, useMemo } from 'react';
import { UserProfile } from '../../types';
import { getAllUsers } from '../../services/authService';
import { BADGE_LIST, Badge } from '../../constants/badges';
import Button from '../Button';
import TrophyIcon from '../icons/TrophyIcon';
import ProfileModal from '../ProfileModal';
import MagnifyingGlassIcon from '../icons/MagnifyingGlassIcon';
import LockClosedIcon from '../icons/LockClosedIcon';

type View = 'leaderboard' | 'achievements' | 'badges';

const LeaderboardPage: React.FC<{ user: UserProfile; onClaimBadge: (badgeId: string) => void; isSubmitting: boolean; }> = ({ user, onClaimBadge, isSubmitting }) => {
    const [view, setView] = useState<View>('leaderboard');
    const [leaderboard, setLeaderboard] = useState<UserProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

    useEffect(() => {
        setIsLoading(true);
        getAllUsers()
            .then(users => {
                const sortedUsers = users.sort((a, b) => (b.xp || 0) - (a.xp || 0));
                setLeaderboard(sortedUsers);
            })
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, []);

    const filteredLeaderboard = useMemo(() => {
        return leaderboard.filter(player =>
            player.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [leaderboard, searchTerm]);
    
    const getRankBg = (rank: number) => {
        if (rank === 0) return 'gold-gradient text-gray-800';
        if (rank === 1) return 'silver-gradient text-gray-800';
        if (rank === 2) return 'bronze-gradient text-white';
        return 'bg-white dark:bg-gray-800';
    };

    const renderLeaderboard = () => {
        if (isLoading) return <div className="text-center p-8 text-white">Loading leaderboard...</div>;
        return (
            <div className="space-y-3">
                {filteredLeaderboard.map((player, index) => (
                    <div 
                        key={player.id} 
                        className={`p-3 rounded-lg flex items-center gap-4 shadow-md transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer animate-slide-in-from-top ${getRankBg(index)} ${player.id === user.id ? 'border-4 border-blue-500' : 'border-4 border-transparent'}`}
                        style={{ animationDelay: `${index * 30}ms`, opacity: 0 }}
                        onClick={() => setSelectedUser(player)}
                    >
                        <div className="w-10 text-center text-xl font-bold">{index + 1}</div>
                        <img className="h-12 w-12 rounded-full border-2 border-white/50" src={player.avatar} alt={player.name} />
                        <div className="flex-grow">
                            <p className="font-bold text-lg">{player.name}</p>
                            <p className="text-sm opacity-80">{player.headline || 'Mavericks Coder'}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-2xl">{player.xp || 0}</p>
                            <p className="text-xs opacity-80">XP</p>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderAchievements = () => (
        <div className="space-y-4 text-white">
            {(user.hackathonResults || []).length > 0 ? (
                (user.hackathonResults || []).map((result, index) => (
                    <div key={index} className="p-4 bg-white/10 rounded-lg flex justify-between items-center">
                        <div>
                            <h4 className="font-semibold">{result.hackathonTitle}</h4>
                            <p className="text-sm opacity-70">Date: {new Date(result.date).toLocaleDateString()}</p>
                        </div>
                        <span className="py-1 px-3 rounded-full text-sm font-semibold bg-green-500/20 text-green-300">{result.status}</span>
                    </div>
                ))
            ) : (
                <p className="text-center opacity-70 py-8">Participate in a hackathon to see your achievements here.</p>
            )}
        </div>
    );

    const sortedBadges = useMemo(() => {
        return [...BADGE_LIST].sort((a, b) => {
            const aUnlocked = a.isUnlocked(user);
            const bUnlocked = b.isUnlocked(user);
            const aClaimed = user.claimedBadges?.includes(a.id);
            const bClaimed = user.claimedBadges?.includes(b.id);

            const getScore = (unlocked: boolean, claimed?: boolean) => {
                if (unlocked && !claimed) return 3; // Claimable
                if (unlocked && claimed) return 2; // Claimed
                return 1; // Locked
            };
    
            return getScore(bUnlocked, bClaimed) - getScore(aUnlocked, aClaimed);
        });
    }, [user]);
    
    const renderBadges = () => {
        const getIconColor = (category: Badge['category']) => {
            switch (category) {
                case 'coding': return 'text-[#4299e6]';
                case 'community': return 'text-[#38b2ac]';
                case 'learning': return 'text-[#48bb78]';
                case 'elite': return 'text-[#ecc94b]';
                default: return 'text-gray-500';
            }
        };

        return (
            <div className="bg-[#f7fafc] dark:bg-gray-800 p-6 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedBadges.map((badge, index) => {
                        const isUnlocked = badge.isUnlocked(user);
                        const isClaimed = user.claimedBadges?.includes(badge.id);
                        const canClaim = isUnlocked && !isClaimed;

                        return (
                            <div 
                                key={badge.id} 
                                className={`bg-white dark:bg-gray-900 rounded-[12px] p-6 flex flex-col items-center text-center transition-all duration-300 shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] border border-[#e2e8f0] dark:border-gray-700 relative animate-card-appear ${!isUnlocked ? 'grayscale' : ''} ${canClaim ? 'animate-pulse-glow-yellow' : ''}`}
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <div className={`mb-4 ${getIconColor(badge.category)}`}>
                                    <badge.icon className="h-20 w-20" />
                                </div>
                                <h4 className="text-[18px] font-bold text-[#2d3748] dark:text-gray-100">{badge.name}</h4>
                                <p className="text-[14px] text-[#718096] dark:text-gray-400 flex-grow mt-1">{badge.description}</p>
                                <div className="mt-4 h-10">
                                    {canClaim && (
                                        <Button size="sm" onClick={() => onClaimBadge(badge.id)} disabled={isSubmitting}>
                                            {isSubmitting ? 'Claiming...' : 'Claim Badge'}
                                        </Button>
                                    )}
                                    {isClaimed && (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300">
                                            ✓ Claimed
                                        </span>
                                    )}
                                </div>
                                {!isUnlocked && (
                                    <div className="badge-locked-overlay">
                                        <LockClosedIcon className="h-8 w-8 text-gray-400" />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const views: { id: View, name: string, content: () => React.ReactNode }[] = [
        { id: 'leaderboard', name: 'Leaderboard', content: renderLeaderboard },
        { id: 'achievements', name: 'Hackathon History', content: renderAchievements },
        { id: 'badges', name: 'Badges', content: renderBadges }
    ];

    return (
        <>
        <ProfileModal user={selectedUser} onClose={() => setSelectedUser(null)} />
        <div className="space-y-6 p-6 rounded-2xl bg-gradient-to-br from-[#1a202c] to-[#2d3748]">
            <div className="text-center">
                <TrophyIcon className="h-16 w-16 mx-auto text-yellow-400 animate-pulse-trophy" />
                <h1 className="text-4xl font-black text-white mt-2">Leaderboard</h1>
                <p className="text-gray-300">See where you stand among the Mavericks.</p>
            </div>
            
            {/* Controls */}
            <div className="sticky top-20 z-20 backdrop-blur-md bg-[#2d3748]/50 p-3 rounded-xl flex flex-col md:flex-row gap-4 items-center">
                <div className="flex space-x-1 rounded-lg bg-black/20 p-1">
                    {views.map(v => (
                        <button
                            key={v.id}
                            onClick={() => setView(v.id)}
                            className={`flex-1 px-4 py-2 rounded-lg font-semibold text-base transition-colors ${view === v.id ? 'bg-[#4299e6] text-white shadow-[0_2px_8px_rgba(0,0,0,0.08)]' : 'text-gray-300 hover:bg-white/10'}`}
                        >
                            {v.name}
                        </button>
                    ))}
                </div>
                 {view === 'leaderboard' && (
                     <div className="relative w-full md:w-auto md:ml-auto">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search user..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full bg-white/10 text-white placeholder-gray-400 rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                 )}
            </div>
            
            <div>
                {views.find(v => v.id === view)?.content()}
            </div>
        </div>
        </>
    );
};

export default LeaderboardPage;