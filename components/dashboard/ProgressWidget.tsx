import React, { useState, useEffect } from 'react';
import { UserProfile } from '../../types';
import { BADGE_LIST } from '../../constants/badges';
import TrophyIcon from '../icons/TrophyIcon';
import BadgeIcon from '../icons/BadgeIcon';

interface ProgressWidgetProps {
    user: UserProfile;
}

const ProgressBar: React.FC<{ skill: string; percentage: number; color: string }> = ({ skill, percentage, color }) => {
    const [width, setWidth] = useState(0);

    useEffect(() => {
        // Trigger the animation on component mount
        const timer = setTimeout(() => setWidth(percentage), 100);
        return () => clearTimeout(timer);
    }, [percentage]);

    return (
        <div>
            <div className="flex justify-between mb-1">
                <span className="text-[16px] font-medium text-white">{skill}</span>
                <span className="text-[16px] font-medium text-white">{percentage}%</span>
            </div>
            <div className="w-full bg-[#e2e8f0] rounded-full h-[8px]">
                <div className="h-[8px] rounded-full transition-all duration-[1500ms] ease-out" style={{ width: `${width}%`, backgroundColor: color }}></div>
            </div>
        </div>
    );
};

const ProgressWidget: React.FC<ProgressWidgetProps> = ({ user }) => {
    const claimedBadges = (user.claimedBadges || [])
        .map(badgeId => BADGE_LIST.find(b => b.id === badgeId))
        .filter(Boolean);

    // Generate progress data from user skills
    const progressData = user.skills?.map(skill => {
        // Convert skill level to percentage
        const levelMap = {
            'Basic': 25,
            'Intermediate': 60,
            'Advanced': 85,
            'Expert': 95
        };
        
        const percentage = levelMap[skill.level] || 0;
        
        // Assign colors based on skill name
        const colorMap: { [key: string]: string } = {
            'javascript': '#f7df1e',
            'python': '#3776ab',
            'java': '#007396',
            'react': '#61dafb',
            'node.js': '#339933',
            'sql': '#336791'
        };
        
        const defaultColors = ['#4299e6', '#48bb78', '#ecc94b', '#9f7aea', '#f56565', '#38b2ac'];
        const color = colorMap[skill.name.toLowerCase()] || 
                     defaultColors[Math.abs(skill.name.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % defaultColors.length];
        
        return {
            skill: skill.name,
            percentage,
            color
        };
    }).slice(0, 4) || [ // Show top 4 skills
        { skill: 'No Skills Yet', percentage: 0, color: '#718096' }
    ];

    return (
        <div className="glass-effect rounded-[24px] p-6 card-3d-hover transition-all duration-300 border border-slate-200/20 dark:border-slate-700/30 h-full relative overflow-hidden">
            {/* Animated background shapes */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-full blur-2xl animate-morph"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-xl animate-pulse-slow"></div>
            
            <div className="flex items-center gap-3 mb-4 relative z-10">
                <div className="p-2 bg-yellow-500/20 rounded-full text-yellow-300">
                    <TrophyIcon className="h-5 w-5"/>
                </div>
                <h3 className="text-[18px] font-semibold text-white">Progress & Achievements</h3>
            </div>
            
            <div className="space-y-4 relative z-10">
                {progressData.map(item => (
                    <ProgressBar key={item.skill} {...item} />
                ))}
            </div>

            <div className="mt-6 pt-6 border-t border-white/10 relative z-10">
                <h4 className="text-md font-semibold text-white mb-4">Badges Earned</h4>
                <div className="grid grid-cols-4 gap-4">
                    {claimedBadges.length > 0 ? claimedBadges.map((badge, index) => badge && (
                        <div key={badge.id} className="flex flex-col items-center text-center group relative cursor-pointer animate-badge-appear" style={{animationDelay: `${index * 100}ms`}} title={`${badge.name}: ${badge.description}`}>
                            <div className="text-[#38b2ac] p-2 bg-teal-500/10 rounded-full">
                                <badge.icon className="h-8 w-8" />
                            </div>
                            <p className="text-xs mt-1 text-gray-300 font-semibold">{badge.name}</p>
                        </div>
                    )) : null}
                    
                    {/* Placeholder for locked badges */}
                    {Array.from({ length: Math.max(0, 4 - claimedBadges.length) }).map((_, i) => (
                        <div key={`locked-${i}`} className="flex flex-col items-center text-center group relative cursor-pointer opacity-40" title="Locked Achievement">
                            <div className="text-[#718096] p-2 bg-gray-500/10 rounded-full">
                                <BadgeIcon className="h-8 w-8" />
                            </div>
                             <p className="text-xs mt-1 text-gray-500 font-semibold">Locked</p>
                        </div>
                    ))}
                     {claimedBadges.length === 0 && <p className="col-span-4 text-center text-sm text-gray-400 py-4">No badges earned yet.</p>}
                </div>
            </div>
        </div>
    );
};

export default ProgressWidget;
