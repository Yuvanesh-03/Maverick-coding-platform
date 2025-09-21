



import React, { useState } from 'react';
import CodeIcon from '../icons/CodeIcon';
import LightbulbIcon from '../icons/LightbulbIcon';
import ClipboardListIcon from '../icons/ClipboardListIcon';
import ClipboardCheckIcon from '../icons/ClipboardCheckIcon';
import ConceptsPanel from '../ConceptsPanel';
import SkillCheckPanel from '../SkillCheckPanel';
import AssessmentHistoryPanel from '../AssessmentHistoryPanel';
import PersonalizedAssessmentsPanel from '../PersonalizedAssessmentsPanel';
import { UserProfile, QuizConfig } from '../../types';

interface AssessmentPageProps {
  user: UserProfile;
  onUpdateUser: (updatedUserData: Partial<UserProfile>) => Promise<void>;
  onSelectConcept: (conceptSlug: string) => void;
  onStartQuiz: (config: QuizConfig) => void;
  onViewResult: (resultId: string) => void;
}

type AssessmentView = 'concepts' | 'skill_check' | 'history' | 'personalized';

const AssessmentPage: React.FC<AssessmentPageProps> = ({ user, onUpdateUser, onSelectConcept, onStartQuiz, onViewResult }) => {
  const [activeTab, setActiveTab] = useState<AssessmentView>('concepts');
  
  const tabs = [
    { id: 'concepts', name: 'Concepts', icon: <LightbulbIcon className="h-5 w-5"/> },
    { id: 'skill_check', name: 'Skill Check', icon: <CodeIcon className="h-5 w-5"/> },
    { id: 'personalized', name: 'Personalized', icon: <ClipboardCheckIcon className="h-5 w-5"/> },
    { id: 'history', name: 'History', icon: <ClipboardListIcon className="h-5 w-5" /> }
  ];

  return (
    <div className="space-y-6">
        <div className="flex space-x-1 rounded-lg bg-gray-100 dark:bg-gray-900/50 p-1">
            {tabs.map(tab => (
                 <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as AssessmentView)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-base font-semibold ${
                        activeTab === tab.id
                        ? 'bg-[#4299e6] text-white shadow-[0_2px_8px_rgba(0,0,0,0.08)]'
                        : 'text-[#4a5568] dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700/50'
                    }`}
                >
                    {tab.icon} {tab.name}
                </button>
            ))}
        </div>

        <div className="animate-fade-in">
            {activeTab === 'concepts' && (
                <ConceptsPanel onSelectConcept={onSelectConcept} />
            )}
            {activeTab === 'skill_check' && (
                <SkillCheckPanel user={user} onStartQuiz={onStartQuiz} />
            )}
            {activeTab === 'personalized' && (
                <PersonalizedAssessmentsPanel user={user} onStartQuiz={onStartQuiz} />
            )}
            {activeTab === 'history' && (
                <AssessmentHistoryPanel user={user} onViewResult={onViewResult} />
            )}
        </div>
    </div>
  );
};

export default AssessmentPage;