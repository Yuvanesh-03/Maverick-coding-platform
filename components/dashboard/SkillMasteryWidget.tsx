import React from 'react';
import { UserProfile } from '../../types';
import TargetIcon from '../icons/TargetIcon';

interface SkillMasteryWidgetProps {
    user: UserProfile;
}

type SkillNodeStatus = 'completed' | 'in-progress' | 'locked';

interface SkillNodeData {
    name: string;
    status: SkillNodeStatus;
    proficiency: number;
}

// Function to calculate skill proficiency based on user data
const calculateSkillProficiency = (user: UserProfile, skillName: string): number => {
    if (!user.skills) return 0;
    
    const skill = user.skills.find(s => s.name.toLowerCase() === skillName.toLowerCase());
    if (!skill) return 0;
    
    // Convert skill level to proficiency percentage
    const levelMap = {
        'Basic': 25,
        'Intermediate': 60,
        'Advanced': 85,
        'Expert': 95
    };
    
    return levelMap[skill.level] || 0;
};

// Function to determine skill status based on user activity and assessments
const getSkillStatus = (user: UserProfile, skillName: string): SkillNodeStatus => {
    const proficiency = calculateSkillProficiency(user, skillName);
    const hasActivity = user.activity?.some(activity => 
        activity.language?.toLowerCase() === skillName.toLowerCase()
    );
    
    if (proficiency >= 60) return 'completed';
    if (proficiency > 0 || hasActivity) return 'in-progress';
    return 'locked';
};

// Generate skill tree data from user profile
const generateSkillTreeData = (user: UserProfile) => {
    const skillCategories = {
        languages: ['JavaScript', 'Python', 'Java', 'C++'],
        frameworks: ['React', 'Node.js', 'Django', 'Express'],
        concepts: ['Data Structures', 'Algorithms', 'System Design', 'Machine Learning']
    };
    
    const skillTreeData: {
        languages: SkillNodeData[];
        frameworks: SkillNodeData[];
        concepts: SkillNodeData[];
    } = {
        languages: [],
        frameworks: [],
        concepts: []
    };
    
    // Generate data for each category
    Object.entries(skillCategories).forEach(([category, skills]) => {
        skillTreeData[category as keyof typeof skillTreeData] = skills.map(skill => ({
            name: skill,
            status: getSkillStatus(user, skill),
            proficiency: calculateSkillProficiency(user, skill)
        }));
    });
    
    return skillTreeData;
};

const SkillNode: React.FC<{ name: string; status: SkillNodeStatus; proficiency: number }> = ({ name, status, proficiency }) => {
    const baseClasses = "w-24 h-24 rounded-full flex items-center justify-center text-center p-2 font-bold text-sm cursor-pointer transition-all duration-300 transform";
    const statusClasses = {
        completed: 'bg-[#48bb78] text-white border-4 border-green-300 shadow-lg animate-pulse-green',
        'in-progress': 'bg-[#4299e6] text-white border-4 border-blue-300 animate-pulse-blue shadow-lg',
        locked: 'bg-[#718096] text-gray-200 border-4 border-gray-600 opacity-50',
    };

    return (
        <div className="flex flex-col items-center group relative">
            <div className={`${baseClasses} ${statusClasses[status]}`}>
                {name}
            </div>
            <div className="absolute -bottom-12 w-max text-center bg-gray-800 text-white px-3 py-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none z-10">
                <p className="font-medium text-[14px] text-white">{name}</p>
                <p className="text-[12px] text-[#e2e8f0]">{proficiency}% Mastery</p>
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-b-8 border-b-gray-800"></div>
            </div>
        </div>
    );
};

const SkillMasteryWidget: React.FC<SkillMasteryWidgetProps> = ({ user }) => {
    const skillTreeData = generateSkillTreeData(user);
    
    return (
        <div className="glass-effect rounded-[24px] p-6 card-3d-hover transition-all duration-300 border border-slate-200/20 dark:border-slate-700/30 relative overflow-hidden">
            {/* Animated background shapes */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-2xl animate-morph"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-green-500/10 to-cyan-500/10 rounded-full blur-xl animate-pulse-slow"></div>
            
            <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="p-2 bg-blue-500/20 rounded-full text-blue-300">
                    <TargetIcon className="h-5 w-5"/>
                </div>
                <h3 className="text-[18px] font-semibold text-white">Skill Mastery Tree</h3>
            </div>
            
            <div className="relative h-96 flex items-center justify-center z-10">
                {/* This is a simplified static representation. A real implementation would use a library like D3 or React Flow for dynamic positioning and lines. */}
                {/* Connecting Lines */}
                <svg className="absolute w-full h-full" style={{ zIndex: 0 }}>
                    <g className="group cursor-pointer">
                      <line x1="25%" y1="50%" x2="40%" y2="25%" className="stroke-[#e2e8f0] group-hover:stroke-[#38b2ac] transition-all duration-300" strokeWidth="1" />
                    </g>
                    <g className="group cursor-pointer">
                      <line x1="25%" y1="50%" x2="40%" y2="75%" className="stroke-[#e2e8f0] group-hover:stroke-[#38b2ac] transition-all duration-300" strokeWidth="1" />
                    </g>
                    <g className="group cursor-pointer">
                      <line x1="60%" y1="25%" x2="75%" y2="50%" className="stroke-[#e2e8f0] group-hover:stroke-[#38b2ac] transition-all duration-300" strokeWidth="1" />
                    </g>
                    <g className="group cursor-pointer">
                      <line x1="60%" y1="75%" x2="75%" y2="50%" className="stroke-[#e2e8f0] group-hover:stroke-[#38b2ac] transition-all duration-300" strokeWidth="1" />
                    </g>
                </svg>
                
                {/* Nodes */}
                <div className="absolute" style={{ left: '15%', top: '50%', transform: 'translateY(-50%)' }}>
                    <SkillNode {...skillTreeData.languages[1]} />
                </div>
                <div className="absolute" style={{ left: '35%', top: '25%', transform: 'translateY(-50%)' }}>
                    <SkillNode {...skillTreeData.frameworks[0]} />
                </div>
                <div className="absolute" style={{ left: '35%', top: '75%', transform: 'translateY(-50%)' }}>
                    <SkillNode {...skillTreeData.concepts[0]} />
                </div>
                 <div className="absolute" style={{ left: '55%', top: '25%', transform: 'translateY(-50%)' }}>
                    <SkillNode {...skillTreeData.concepts[2]} />
                </div>
                <div className="absolute" style={{ left: '55%', top: '75%', transform: 'translateY(-50%)' }}>
                    <SkillNode {...skillTreeData.frameworks[2]} />
                </div>
                <div className="absolute" style={{ right: '15%', top: '50%', transform: 'translateY(-50%)' }}>
                    <SkillNode {...skillTreeData.concepts[3]} />
                </div>
            </div>
        </div>
    );
};

export default SkillMasteryWidget;