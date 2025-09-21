import React from 'react';
import { UserProfile } from '../types';
import Modal from './Modal';
import { BADGE_LIST } from '../constants/badges';

interface ProfileModalProps {
    user: UserProfile | null;
    onClose: () => void;
}

const StatItem: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="text-center bg-gray-100 dark:bg-gray-700/50 p-3 rounded-lg">
        <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{value}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase">{label}</p>
    </div>
);

const ProfileModal: React.FC<ProfileModalProps> = ({ user, onClose }) => {
    if (!user) return null;

    const claimedBadgesDetails = (user.claimedBadges || [])
        .map(badgeId => BADGE_LIST.find(b => b.id === badgeId))
        .filter(Boolean);

    // Show confetti for major level milestones
    const showConfetti = (user.level || 0) > 0 && (user.level || 0) % 10 === 0;

    return (
        <Modal 
            isOpen={!!user} 
            onClose={onClose} 
            title={`${user.name}'s Profile`} 
            size="lg"
            showConfetti={showConfetti}
        >
            <div className="p-4">
                <div className="flex flex-col items-center text-center">
                    <div className="relative">
                        <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full border-4 border-gray-200 dark:border-gray-700 shadow-md" />
                         <span className="absolute -bottom-2 -right-2 bg-blue-500 text-white text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-800">
                            {user.level || 1}
                        </span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-4">{user.name}</h3>
                    <p className="text-gray-500 dark:text-gray-400">{user.headline || 'Mavericks Platform Member'}</p>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-6">
                    <StatItem label="Level" value={user.level || 1} />
                    <StatItem label="XP" value={user.xp || 0} />
                    <StatItem label="Solved" value={user.questionsSolved || 0} />
                </div>

                <div className="mt-6">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Top Skills</h4>
                    <div className="flex flex-wrap gap-2">
                        {(user.skills || []).slice(0, 5).map(skill => (
                            <span key={skill.name} className="bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 text-sm font-medium px-3 py-1 rounded-full">
                                {skill.name}
                            </span>
                        ))}
                    </div>
                </div>
                 <div className="mt-6">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Earned Badges</h4>
                     <div className="flex flex-wrap gap-6">
                        {claimedBadgesDetails.length > 0 ? claimedBadgesDetails.map(badge => badge && (
                            <div key={badge.id} className="flex flex-col items-center text-center group relative cursor-pointer w-16" title={`${badge.name}: ${badge.description}`}>
                                <div className="text-green-500 dark:text-green-400"><badge.icon className="h-10 w-10" /></div>
                                <p className="text-xs mt-1 text-gray-700 dark:text-gray-300 font-semibold">{badge.name}</p>
                            </div>
                        )) : <p className="text-gray-500 text-sm">No badges earned yet.</p>}
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ProfileModal;
