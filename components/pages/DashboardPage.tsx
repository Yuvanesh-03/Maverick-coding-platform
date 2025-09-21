import React from 'react';
import { UserProfile, ProgrammingQuestion } from '../../types';
import WelcomeWidget from '../dashboard/WelcomeWidget';
import SkillMasteryWidget from '../dashboard/SkillMasteryWidget';
import ProgressWidget from '../dashboard/ProgressWidget';
import ActivityFeedWidget from '../dashboard/ActivityFeedWidget';
import FloatingActionButtons from '../dashboard/FloatingActionButtons';
import DailyMissionCard from '../dashboard/DailyMissionCard';
import NewFeaturesWidget from '../dashboard/NewFeaturesWidget';

type AppView = 'general' | 'learning_path' | 'assessment' | 'hackathons' | 'playground' | 'admin' | 'profile' | 'leaderboard' | 'analytics' | 'discussions' | 'reports' | 'story_mode' | 'events';

interface DashboardPageProps {
    user: UserProfile;
    onStartMission: (config: { language: string; question: ProgrammingQuestion; }) => void;
    onSetView: (view: AppView) => void;
    onLaunchFeature?: (feature: string) => void;
    currentStreak?: number;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ user, onStartMission, onSetView, onLaunchFeature, currentStreak }) => {
    
    const handleLaunchFeature = (feature: string) => {
        switch (feature) {
            case 'story_mode':
                onSetView('story_mode');
                break;
            case 'themed_events':
                onSetView('events');
                break;
            case 'collaborative_coding':
                // This could trigger a modal to join/create a room
                console.log('Launch collaborative coding');
                break;
            case 'loot_boxes':
                // This could trigger the loot box system
                console.log('Launch loot boxes');
                break;
            case 'mindfulness':
                // This could trigger mindfulness breaks
                console.log('Launch mindfulness breaks');
                break;
            default:
                console.log('Unknown feature:', feature);
        }
        
        if (onLaunchFeature) {
            onLaunchFeature(feature);
        }
    };
    
    return (
        <div className="space-y-6 animate-fade-in">
            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-6">
                    <WelcomeWidget user={user} currentStreak={currentStreak} />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-1">
                            <DailyMissionCard user={user} onStartMission={onStartMission} />
                        </div>
                        <div className="md:col-span-2">
                             <SkillMasteryWidget user={user} />
                        </div>
                    </div>
                </div>

                {/* Right Sidebar Area */}
                <div className="lg:col-span-1 space-y-6">
                    <ProgressWidget user={user} />
                    <ActivityFeedWidget activity={user.activity || []} />
                </div>
            </div>
            <FloatingActionButtons />
            <NewFeaturesWidget onLaunchFeature={handleLaunchFeature} />
        </div>
    );
};

export default DashboardPage;