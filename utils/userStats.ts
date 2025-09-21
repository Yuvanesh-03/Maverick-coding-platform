import { UserProfile, UserActivity } from '../types';

/**
 * Calculate user's current activity streak
 * @param activities - Array of user activities
 * @returns Number of consecutive days with activity
 */
export const calculateStreak = (activities: UserActivity[]): number => {
    if (!activities || activities.length === 0) return 0;
    
    const toDateString = (date: Date) => date.toISOString().split('T')[0];
    
    // Get unique activity dates
    const activityDates = new Set(
        activities.map(activity => toDateString(new Date(activity.date)))
    );

    let streak = 0;
    let checkDate = new Date();

    // Check if user was active today
    if (activityDates.has(toDateString(checkDate))) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
        
        // Continue counting backwards for consecutive days
        while (activityDates.has(toDateString(checkDate))) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
        }
    }
    
    return streak;
};

/**
 * Calculate user's rank among all users
 * @param currentUser - The current user
 * @param allUsers - Array of all users
 * @returns User's rank (1-indexed) and total users
 */
export const calculateUserRank = (currentUser: UserProfile, allUsers: UserProfile[]) => {
    // Sort users by XP in descending order
    const sortedUsers = [...allUsers].sort((a, b) => (b.xp || 0) - (a.xp || 0));
    
    // Find current user's rank (1-indexed)
    const rank = sortedUsers.findIndex(user => user.id === currentUser.id) + 1;
    
    return {
        rank: rank || allUsers.length + 1, // If not found, put at end
        totalUsers: allUsers.length
    };
};

/**
 * Calculate XP trend based on recent activities
 * @param activities - Array of user activities
 * @param days - Number of days to look back (default: 7)
 * @returns Estimated XP gained in the period
 */
export const calculateXpTrend = (activities: UserActivity[], days: number = 7): number => {
    if (!activities || activities.length === 0) return 0;
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const recentActivities = activities.filter(activity => 
        new Date(activity.date) >= cutoffDate
    );
    
    return recentActivities.reduce((total, activity) => {
        // Estimate XP gained from different activities
        switch (activity.type) {
            case 'assessment':
                return total + (activity.score && activity.score > 80 ? 50 : 15);
            case 'quiz':
                return total + 25;
            case 'playground':
                return total + 10;
            default:
                return total + 5;
        }
    }, 0);
};

/**
 * Calculate streak trend (simplified mock)
 * In a real implementation, you'd compare with historical streak data
 */
export const calculateStreakTrend = (currentStreak: number): number => {
    // Simple logic: if streak > 5, trend is positive, otherwise neutral
    if (currentStreak >= 5) return Math.min(currentStreak - 3, 7); // Cap at +7
    if (currentStreak >= 3) return 1;
    return 0; // No trend for short streaks
};

/**
 * Generate mock rank trend (in real app, compare with historical data)
 * @param activities - User activities to base trend calculation on
 */
export const calculateRankTrend = (activities: UserActivity[]): number => {
    // Mock trend calculation based on recent activity frequency
    const recentActivities = activities?.slice(-10) || [];
    
    if (recentActivities.length >= 8) return Math.floor(Math.random() * 15) + 5; // +5 to +20
    if (recentActivities.length >= 5) return Math.floor(Math.random() * 10) - 5; // -5 to +5
    return Math.floor(Math.random() * 20) - 15; // -15 to +5 (negative trend for inactive users)
};

/**
 * Format rank for display
 * @param rank - User's rank
 * @returns Formatted rank string (e.g., "#1,234")
 */
export const formatRank = (rank: number): string => {
    if (rank <= 0) return "#--";
    return `#${rank.toLocaleString()}`;
};

/**
 * Calculate user performance score
 * A composite score based on various user metrics
 */
export const calculatePerformanceScore = (user: UserProfile): number => {
    const xp = user.xp || 0;
    const level = user.level || 1;
    const questionsolved = user.questionsSolved || 0;
    const activityCount = user.activity?.length || 0;
    
    // Weighted calculation
    return Math.round(
        (xp * 0.4) + 
        (level * 50 * 0.3) + 
        (questionsolved * 25 * 0.2) + 
        (activityCount * 5 * 0.1)
    );
};

/**
 * Get user achievement summary
 */
export const getUserAchievementSummary = (user: UserProfile) => {
    const totalBadges = user.claimedBadges?.length || 0;
    const totalHackathons = user.hackathonResults?.length || 0;
    const totalQuestions = user.questionsSolved || 0;
    
    return {
        totalBadges,
        totalHackathons,
        totalQuestions,
        performanceScore: calculatePerformanceScore(user)
    };
};
