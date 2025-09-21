
import React from 'react';
import { UserProfile } from '../types';
import BadgeIcon from '../components/icons/BadgeIcon';
import TrophyIcon from '../components/icons/TrophyIcon';
import CodeIcon from '../components/icons/CodeIcon';
import UserIcon from '../components/icons/UserIcon';
import FireIcon from '../components/icons/FireIcon';
import BugAntIcon from '../components/icons/BugAntIcon';
import UsersIcon from '../components/icons/UsersIcon';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.FC<{ className?: string }>;
  isUnlocked: (user: UserProfile) => boolean;
  category: 'coding' | 'community' | 'learning' | 'elite';
}

// Helper to calculate a user's current streak
const calculateCurrentStreak = (user: UserProfile): number => {
    if (!user.activity || user.activity.length === 0) return 0;
    const toDateString = (date: Date) => date.toISOString().split('T')[0];
    const activityDates = new Set(user.activity.map(act => toDateString(new Date(act.date))));
    
    let streak = 0;
    let checkDate = new Date();

    if (activityDates.has(toDateString(checkDate))) {
        streak = 1;
        for (let i = 0; i < 30; i++) { // Check up to 30 days back
            checkDate.setDate(checkDate.getDate() - 1);
            if (activityDates.has(toDateString(checkDate))) {
                streak++;
            } else {
                break;
            }
        }
    }
    return streak;
};

export const BADGE_LIST: Badge[] = [
  {
    id: 'q_1',
    name: 'First Blood',
    description: 'Successfully solve your first problem.',
    icon: CodeIcon,
    isUnlocked: (user) => (user.questionsSolved || 0) >= 1,
    category: 'coding',
  },
  {
    id: 'q_10',
    name: 'Problem Solver',
    description: 'Solve 10 problems.',
    icon: CodeIcon,
    isUnlocked: (user) => (user.questionsSolved || 0) >= 10,
    category: 'coding',
  },
  {
    id: 'q_50',
    name: 'Coding Machine',
    description: 'Solve 50 problems.',
    icon: CodeIcon,
    isUnlocked: (user) => (user.questionsSolved || 0) >= 50,
    category: 'coding',
  },
  {
    id: 'streak_7',
    name: 'Streak Master',
    description: 'Maintain a 7-day activity streak.',
    icon: FireIcon,
    isUnlocked: (user) => calculateCurrentStreak(user) >= 7,
    category: 'learning',
  },
  {
    id: 'hackathon_1',
    name: 'Competitor',
    description: 'Participate in your first hackathon.',
    icon: TrophyIcon,
    isUnlocked: (user) => (user.hackathonResults?.length || 0) >= 1,
    category: 'elite',
  },
   {
    id: 'hackathon_winner',
    name: 'Hackathon Winner',
    description: 'Win a hackathon event.',
    icon: TrophyIcon,
    isUnlocked: (user) => (user.hackathonResults || []).some(r => r.status === 'Winner'),
    category: 'elite',
  },
  {
    id: 'profile_complete',
    name: 'All-Star Profile',
    description: 'Completely fill out your user profile.',
    icon: UserIcon,
    isUnlocked: (user) => !!user.headline && !!user.location && (user.skills?.length || 0) > 0 && !!user.dreamRole && user.dreamRole !== 'Not specified',
    category: 'community',
  },
  {
    id: 'bug_hunter',
    name: 'Bug Hunter',
    description: 'Reach an XP of over 5,000.',
    icon: BugAntIcon,
    isUnlocked: (user) => (user.xp || 0) >= 5000,
    category: 'coding',
  },
  {
    id: 'community_builder',
    name: 'Community Builder',
    description: 'Participate in multiple hackathons and solve many problems.',
    icon: UsersIcon,
    isUnlocked: (user) => (user.hackathonResults?.length || 0) >= 2 && (user.questionsSolved || 0) >= 25,
    category: 'community',
  }
];
