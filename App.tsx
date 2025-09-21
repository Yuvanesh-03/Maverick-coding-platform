

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import firebase from 'firebase/compat/app';
import { getOrCreateUserProfile, handleSignOut as signOutService, updateUserProfile } from './services/authService';
import { getKnowledgeDocuments, addKnowledgeDocument, removeKnowledgeDocument } from './services/knowledgeBaseService';
import { getUnreadNotifications, markAllNotificationsAsRead } from './services/notificationService';
import { saveAssessmentResult } from './services/assessmentService';
import { auth, firestore } from './services/firebase';
import { initPerformanceOptimizations, performanceMonitor } from './utils/performance';

import AdminDashboard from './components/AdminDashboard';
import Playground from './components/Playground';
import Sidebar from './components/Sidebar';
import DashboardPage from './components/pages/DashboardPage';
import LearningPathPage from './components/pages/LearningPathPage';
import AssessmentPage from './components/pages/AssessmentPage';
import HackathonsPage from './components/pages/HackathonsPage';
import ProfilePage from './components/pages/ProfilePage';
import LeaderboardPage from './components/pages/LeaderboardPage';
import AnalyticsPage from './components/pages/AnalyticsPage';
import ReportsPage from './components/pages/ReportsPage';
import MissionView from './components/MissionView';
import Login from './components/auth/Login';
import RegistrationForm from './components/RegistrationForm';
import Chatbot from './components/Chatbot';
import ConceptSolveView from './components/ConceptSolveView';
import DiscussionsPage from './components/pages/DiscussionsPage';
import DiscussionThreadView from './components/DiscussionThreadView';
import AdminUserProfileView from './components/AdminUserProfileView';
import ChallengeView from './components/ChallengeView';
import AssessmentView from './components/AssessmentView';
import AssessmentResultView from './components/AssessmentResultView';
import Header from './components/dashboard/Header';
import Galaxy from './components/Galaxy';
import CollaborativeCodingRoom from './components/CollaborativeCodingRoom';
import StoryModeView from './components/StoryModeView';
import LootBoxSystem from './components/LootBoxSystem';
import MindfulnessBreak from './components/MindfulnessBreak';
import ReflectionJournal from './components/ReflectionJournal';
import ThemedEventsSystem from './components/ThemedEventsSystem';
import EasterEggSystem from './components/EasterEggSystem';
import { XP_VALUES, calculateLevel } from './utils/xp';


import { UserProfile, KnowledgeDocument, ProgrammingQuestion, Skill, HackathonResult, Notification, QuizConfig, EvaluationResult, UserActivity, AssessmentDifficulty } from './types';

type AppView = 'general' | 'learning_path' | 'assessment' | 'hackathons' | 'playground' | 'admin' | 'profile' | 'leaderboard' | 'analytics' | 'discussions' | 'reports' | 'story_mode' | 'events';
type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

type ActiveMission = {
    active: boolean;
    language: string;
    question: ProgrammingQuestion;
    code: string;
}
type FirebaseUser = firebase.User;


const getISTDateString = () => {
    const now = new Date();
    const istDate = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    const year = istDate.getUTCFullYear();
    const month = String(istDate.getUTCMonth() + 1).padStart(2, '0');
    const day = String(istDate.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const FullPageLoader: React.FC<{ message: string }> = ({ message }) => (
    <div className="h-screen w-screen flex flex-col items-center justify-center relative overflow-hidden bg-slate-950">
        {/* Galaxy Background */}
        <div className="fixed inset-0 z-0">
            <Galaxy 
                mouseRepulsion={false}
                mouseInteraction={false}
                density={0.6}
                glowIntensity={0.2}
                saturation={0.3}
                hueShift={240}
                transparent={true}
                speed={0.3}
                twinkleIntensity={0.15}
                rotationSpeed={0.01}
                disableAnimation={false}
            />
        </div>
        {/* Loading content */}
        <div className="relative z-10 flex flex-col items-center">
            <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-purple-400 mb-6"></div>
            <p className="text-xl text-slate-200 bg-slate-900/50 px-4 py-2 rounded-lg backdrop-blur-sm">{message}</p>
        </div>
    </div>
);

const App: React.FC = () => {
    const [authStatus, setAuthStatus] = useState<AuthStatus>('loading');
    const [currentUser, setCurrentUser] = useState<{ profile: UserProfile, role: 'user' | 'admin' } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    

    const [knowledgeDocs, setKnowledgeDocs] = useState<KnowledgeDocument[]>([]);
    
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const sidebarTimeout = useRef<number | null>(null);

    const [activeMission, setActiveMission] = useState<ActiveMission | null>(null);
    const [activeConceptSlug, setActiveConceptSlug] = useState<string | null>(null);
    const [activeThreadContext, setActiveThreadContext] = useState<{ id: string; scope: string; } | null>(null);
    const [viewingUserId, setViewingUserId] = useState<string | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    
    const [activeChallenge, setActiveChallenge] = useState<{ language: string } | null>(null);
    const [activeAssessment, setActiveAssessment] = useState<QuizConfig | null>(null);
    const [viewingAssessmentResultId, setViewingAssessmentResultId] = useState<string | null>(null);
    
    // New feature states
    const [activeCollabRoom, setActiveCollabRoom] = useState<{ roomId?: string } | null>(null);
    const [storyModeActive, setStoryModeActive] = useState(false);
    const [lootBoxOpen, setLootBoxOpen] = useState(false);
    const [mindfulnessBreakOpen, setMindfulnessBreakOpen] = useState(false);
    const [reflectionJournalOpen, setReflectionJournalOpen] = useState(false);
    const [themedEventsOpen, setThemedEventsOpen] = useState(false);
    const [sessionStartTime] = useState(Date.now());
    const [codingSessionDuration, setCodingSessionDuration] = useState(0);
    
    const isTakingTest = !!(activeMission || activeConceptSlug || activeChallenge || activeAssessment || activeCollabRoom || storyModeActive);

    useEffect(() => {
        if (isTakingTest) {
            setIsSidebarOpen(false);
        }
    }, [isTakingTest]);

    const handleSidebarEnter = useCallback(() => {
        if (isTakingTest) return;
        if (sidebarTimeout.current) {
            clearTimeout(sidebarTimeout.current);
        }
        setIsSidebarOpen(true);
    }, [isTakingTest]);

    const handleSidebarLeave = useCallback(() => {
        if (isTakingTest) return;
        sidebarTimeout.current = window.setTimeout(() => {
            setIsSidebarOpen(false);
        }, 300); // Delay to allow moving mouse between trigger and sidebar
    }, [isTakingTest]);

    // --- Routing Logic ---
    const getViewFromHash = useCallback((): AppView => {
        const hash = window.location.hash.replace('#/', '');
        const validViews: AppView[] = ['general', 'learning_path', 'assessment', 'hackathons', 'playground', 'admin', 'profile', 'leaderboard', 'analytics', 'discussions', 'reports', 'story_mode', 'events'];
        if ((validViews as string[]).includes(hash)) {
            return hash as AppView;
        }
        return 'general'; // Default view is 'general' (home page)
    }, []);

    const [currentView, setCurrentView] = useState<AppView>(getViewFromHash);
    
    useEffect(() => {
        if (activeConceptSlug) return;
        // Sync currentView state to URL hash for bookmarking and navigation.
        window.location.hash = `/${currentView}`;
    }, [currentView, activeConceptSlug]);

    useEffect(() => {
        // Handle browser back/forward navigation by listening to hash changes.
        const handleHashChange = () => {
            if (activeConceptSlug) {
                // If user navigates while in solve view, exit solve view.
                setActiveConceptSlug(null);
            }
            if (activeThreadContext) {
                setActiveThreadContext(null);
            }
            if (viewingAssessmentResultId) {
                setViewingAssessmentResultId(null);
            }
            setCurrentView(getViewFromHash());
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, [getViewFromHash, activeConceptSlug, activeThreadContext, viewingAssessmentResultId]);
    // --- End Routing Logic ---
    
     useEffect(() => {
        // Auth initialization
        const unsubscribeAuth = auth.onAuthStateChanged(async (user: FirebaseUser | null) => {
            if (user) {
                try {
                    const userSession = await getOrCreateUserProfile(user);
                    setCurrentUser(userSession);
                    if (userSession.role === 'admin' && !userSession.profile.needsOnboarding) {
                        setCurrentView('admin');
                    }
                    setAuthStatus('authenticated');
                } catch (error) {
                    console.error("Error fetching user profile:", error);
                    setAuthStatus('unauthenticated');
                }
            } else {
                setCurrentUser(null);
                setNotifications([]);
                setAuthStatus('unauthenticated');
            }
        });
        return () => unsubscribeAuth();
    }, []);

    // Notification listener
    useEffect(() => {
        if (!currentUser) return;

        const notificationsQuery = firestore
            .collection('notifications')
            .where('userId', '==', currentUser.profile.id)
            .orderBy('createdAt', 'desc');

        const unsubscribeNotifications = notificationsQuery.onSnapshot(snapshot => {
            const fetchedNotifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));
            setNotifications(fetchedNotifications);
        });

        return () => unsubscribeNotifications();
    }, [currentUser]);

    // Track coding session duration for mindfulness breaks
    useEffect(() => {
        const interval = setInterval(() => {
            setCodingSessionDuration(Math.floor((Date.now() - sessionStartTime) / 1000 / 60));
            
            // Suggest mindfulness break after 45 minutes of coding
            if (!mindfulnessBreakOpen && !isTakingTest && codingSessionDuration > 0 && codingSessionDuration % 45 === 0) {
                setMindfulnessBreakOpen(true);
            }
        }, 60000); // Check every minute
        
        return () => clearInterval(interval);
    }, [sessionStartTime, mindfulnessBreakOpen, isTakingTest, codingSessionDuration]);

    useEffect(() => {
        if (authStatus === 'authenticated' && currentUser?.role === 'admin') {
            getKnowledgeDocuments().then(setKnowledgeDocs);
        }
    }, [authStatus, currentUser?.role]);

    // Initialize performance optimizations
    useEffect(() => {
        performanceMonitor.mark('app-mount-start');
        initPerformanceOptimizations();
        
        return () => {
            performanceMonitor.mark('app-mount-end');
            const mountTime = performanceMonitor.measure('app-mount-start', 'app-mount-end');
            if (process.env.NODE_ENV === 'development') {
                console.log(`App component mount time: ${mountTime.toFixed(2)}ms`);
                performanceMonitor.logMetrics();
            }
        };
    }, []);

    const handleSignOut = async () => {
        try {
            // Show loading state or disable button to prevent double-clicks
            setIsSubmitting(true);
            
            // Clear any active sessions first
            setActiveMission(null);
            setActiveConceptSlug(null);
            setActiveThreadContext(null);
            setActiveChallenge(null);
            setActiveAssessment(null);
            setActiveCollabRoom(null);
            setStoryModeActive(false);
            
            // Perform sign out
            await signOutService();
            
            // Clear user state
            setCurrentUser(null);
            setNotifications([]);
            setKnowledgeDocs([]);
            
            // Set auth status and view
            setAuthStatus('unauthenticated');
            setCurrentView('general');
            
            // Clear any cached data
            if ('caches' in window) {
                caches.keys().then(names => {
                    names.forEach(name => {
                        caches.delete(name);
                    });
                });
            }
            
            // Force page reload to ensure clean state
            window.location.reload();
        } catch (error) {
            console.error('Error during sign out:', error);
            // Force reload anyway to ensure clean state
            window.location.reload();
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleRegistration = useCallback(async (profileData: Partial<UserProfile>, resumeFile: File | null) => {
        if (!currentUser) return;
        setIsSubmitting(true);
        try {
            await updateUserProfile(currentUser.profile.id, profileData, resumeFile);
            
            // Manually update the local state to exit registration view
            setCurrentUser(prevUser => {
                if (!prevUser) return null;
                const updatedProfile = { 
                    ...prevUser.profile, 
                    ...profileData, 
                    needsOnboarding: false 
                };
                return { ...prevUser, profile: updatedProfile };
            });
        } catch(error) {
            console.error("Registration update failed:", error);
            // Optionally show an error to the user
        } finally {
            setIsSubmitting(false);
        }
    }, [currentUser]);

    const handleUpdateUser = useCallback(async (updatedProfileData: Partial<UserProfile>, resumeFile: File | null = null) => {
        if (!currentUser) return;
        setIsSubmitting(true);
        try {
            const finalData = { ...updatedProfileData };
            
            // Check if a question was solved to award XP
            if (finalData.questionsSolved && finalData.questionsSolved > (currentUser.profile.questionsSolved || 0)) {
                const currentXp = currentUser.profile.xp || 0;
                const newXp = currentXp + XP_VALUES.CONCEPT_SOLVE;
                finalData.xp = newXp;
                finalData.level = calculateLevel(newXp);
            }

            await updateUserProfile(currentUser.profile.id, finalData, resumeFile);
            
            setCurrentUser(prevUser => {
                if (!prevUser) return null;
                const updatedProfile = { 
                    ...prevUser.profile, 
                    ...finalData, 
                    lastUpdated: new Date().toLocaleDateString()
                };
                return { ...prevUser, profile: updatedProfile };
            });
             if (resumeFile !== null || (updatedProfileData.name && updatedProfileData.headline)) {
                setCurrentView('general'); // Navigate back after a major update
            }
        } catch (error) {
             console.error("Profile update failed:", error);
        } finally {
            setIsSubmitting(false);
        }
    }, [currentUser]);

    const handleAddDoc = async (title: string, content: string) => {
        const newDoc = await addKnowledgeDocument(title, content);
        setKnowledgeDocs(prev => [newDoc, ...prev]);
    };

    const handleRemoveDoc = async (id: string) => {
        await removeKnowledgeDocument(id);
        setKnowledgeDocs(prev => prev.filter(doc => doc.id !== id));
    };

    const handleStartMission = (config: { language: string, question: ProgrammingQuestion }) => {
        if (!currentUser) return;
        const today = getISTDateString();
        const savedProgress = currentUser.profile.dailyMissionProgress;
        const initialCode = (savedProgress?.date === today && savedProgress?.language === config.language) 
            ? savedProgress.code 
            : config.question.starterCode;

        setActiveMission({
            active: true,
            language: config.language,
            question: config.question,
            code: initialCode || '',
        });
    };

    const handleMissionCodeUpdate = (newCode: string) => {
        if (!activeMission || !currentUser) return;
        setActiveMission(prev => prev ? { ...prev, code: newCode } : null);
        
        const missionProgress = {
            dailyMissionProgress: {
                date: getISTDateString(),
                language: activeMission.language,
                code: newCode,
                completed: false,
            }
        };

        setCurrentUser(prevUser => {
            if (!prevUser) return null;
            return { ...prevUser, profile: { ...prevUser.profile, ...missionProgress } };
        });
        updateUserProfile(currentUser.profile.id, missionProgress, null);
    };

    const handleMissionFinish = () => {
        if (!activeMission || !currentUser) return;
        
        const currentQuestionsSolved = currentUser.profile.questionsSolved || 0;
        const updatedQuestionsSolved = currentQuestionsSolved + 1;
        const currentXp = currentUser.profile.xp || 0;
        const newXp = currentXp + XP_VALUES.DAILY_MISSION;

        const missionProgress = {
            dailyMissionProgress: {
                date: getISTDateString(),
                language: activeMission.language,
                code: activeMission.code,
                completed: true,
            },
            questionsSolved: updatedQuestionsSolved,
            xp: newXp,
            level: calculateLevel(newXp),
        };

        updateUserProfile(currentUser.profile.id, missionProgress, null);
        setCurrentUser(prevUser => {
            if (!prevUser) return null;
            return { ...prevUser, profile: { ...prevUser.profile, ...missionProgress } };
        });
        setActiveMission(null);
    };
    
    const handleMissionPause = () => {
        setActiveMission(null);
    };

    const handleChallengeFinished = () => {
        if (!currentUser) return;

        const currentQuestionsSolved = currentUser.profile.questionsSolved || 0;
        const updatedQuestionsSolved = currentQuestionsSolved + 1;

        const newHackathonResult: HackathonResult = {
            hackathonTitle: 'AI for Good Challenge',
            status: 'Participated', // Simplified for now
            date: new Date().toISOString(),
        };
        const updatedHackathonResults = [...(currentUser.profile.hackathonResults || []), newHackathonResult];
        
        const currentXp = currentUser.profile.xp || 0;
        const newXp = currentXp + XP_VALUES.CHALLENGE_PARTICIPATION;

        const updatedData = {
            questionsSolved: updatedQuestionsSolved,
            hackathonResults: updatedHackathonResults,
            xp: newXp,
            level: calculateLevel(newXp),
        };

        updateUserProfile(currentUser.profile.id, updatedData, null);
        setCurrentUser(prevUser => {
            if (!prevUser) return null;
            return { ...prevUser, profile: { ...prevUser.profile, ...updatedData } };
        });
    };
    
    const handleClaimBadge = useCallback(async (badgeId: string) => {
        if (!currentUser) return;
        
        const claimedBadges = currentUser.profile.claimedBadges || [];
        if (claimedBadges.includes(badgeId)) return;

        const updatedBadges = [...claimedBadges, badgeId];
        await updateUserProfile(currentUser.profile.id, { claimedBadges: updatedBadges }, null);

        setCurrentUser(prevUser => {
            if (!prevUser) return null;
            const updatedProfile = { 
                ...prevUser.profile, 
                claimedBadges: updatedBadges
            };
            return { ...prevUser, profile: updatedProfile };
        });
    }, [currentUser]);

    const handleMarkAllRead = async () => {
        if (!currentUser) return;
        await markAllNotificationsAsRead(currentUser.profile.id);
        // The real-time listener will automatically update the state
    };

    const handleAssessmentComplete = useCallback(async (result: EvaluationResult, session: QuizConfig) => {
        if (!currentUser) return;

        setIsSubmitting(true);
        try {
            const resultId = await saveAssessmentResult(currentUser.profile.id, session, result);

            setCurrentUser(prevUser => {
                if (!prevUser) return null;

                const newActivity: UserActivity = {
                    type: session.type,
                    language: session.language,
                    score: result.score,
                    assessmentScore: result.score,
                    date: new Date().toISOString(),
                    resultId: resultId,
                    avatar: prevUser.profile.avatar,
                };
                const updatedActivity = [...(prevUser.profile.activity || []), newActivity];

                const updatedSkills = prevUser.profile.skills.map(skill => {
                    if (skill.name === session.language) {
                        let newDifficulty: AssessmentDifficulty = skill.assessmentDifficulty;
                        if (result.score > 80 && skill.assessmentDifficulty === 'Beginner') newDifficulty = 'Intermediate';
                        else if (result.score > 80 && skill.assessmentDifficulty === 'Intermediate') newDifficulty = 'Advanced';
                        else if (result.score < 50 && skill.assessmentDifficulty === 'Advanced') newDifficulty = 'Intermediate';
                        else if (result.score < 50 && skill.assessmentDifficulty === 'Intermediate') newDifficulty = 'Beginner';
                        return { ...skill, assessmentDifficulty: newDifficulty };
                    }
                    return skill;
                });

                const currentXp = prevUser.profile.xp || 0;
                const xpGained = result.score > 80 ? XP_VALUES.ASSESSMENT_PASSED : Math.floor(XP_VALUES.ASSESSMENT_PASSED / 4);
                const newXp = currentXp + xpGained;

                const updatedProfileData = {
                    activity: updatedActivity,
                    assessmentScore: result.score,
                    skills: updatedSkills,
                    lastUpdated: new Date().toLocaleDateString(),
                    xp: newXp,
                    level: calculateLevel(newXp),
                };

                // Update firestore in the background
                updateUserProfile(prevUser.profile.id, updatedProfileData, null).catch(e => console.error("Firestore update failed", e));

                // Return new state immediately for UI update
                return {
                    ...prevUser,
                    profile: {
                        ...prevUser.profile,
                        ...updatedProfileData,
                    },
                };
            });
        } catch (error) {
            console.error("Failed to process assessment completion:", error);
        } finally {
            setIsSubmitting(false);
            setActiveAssessment(null);
        }
    }, [currentUser]);

    const handleStartChallenge = (language: string) => {
        setActiveChallenge({ language });
    };

    const handleCompleteChallenge = () => {
        handleChallengeFinished();
        setActiveChallenge(null);
    };

    // New feature handlers
    const handleJoinCollabRoom = (roomId?: string) => {
        setActiveCollabRoom({ roomId });
    };

    const handleExitCollabRoom = () => {
        setActiveCollabRoom(null);
    };

    const handleStartStoryMode = () => {
        setStoryModeActive(true);
    };

    const handleExitStoryMode = () => {
        setStoryModeActive(false);
    };

    const handleOpenLootBox = () => {
        setLootBoxOpen(true);
    };

    const handleUnlockTheme = (themeName: string) => {
        // In a real app, this would save the theme to user profile
        console.log('Theme unlocked:', themeName);
    };

    const currentStreak = useMemo(() => {
        if (!currentUser?.profile.activity) return 0;
        
        const toDateString = (date: Date) => date.toISOString().split('T')[0];
        
        const activityDates = new Set(
            currentUser.profile.activity.map(act => toDateString(new Date(act.date)))
        );

        let streak = 0;
        let checkDate = new Date();

        if (activityDates.has(toDateString(checkDate))) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
            while (activityDates.has(toDateString(checkDate))) {
                streak++;
                checkDate.setDate(checkDate.getDate() - 1);
            }
        }
        return streak;
    }, [currentUser?.profile.activity]);

    if (authStatus === 'loading') {
        return <FullPageLoader message="Initializing Session..." />;
    }
    if (authStatus === 'unauthenticated') {
        return <Login />;
    }
    if (!currentUser) {
        return <FullPageLoader message="Loading User Profile..." />;
    }
    if (currentUser.profile.needsOnboarding) {
        return <RegistrationForm user={currentUser.profile} onRegister={handleRegistration} isSubmitting={isSubmitting} />;
    }

    const renderMainContent = () => {
        if (activeCollabRoom) {
            return <CollaborativeCodingRoom 
                user={currentUser.profile}
                roomId={activeCollabRoom.roomId}
                onExit={handleExitCollabRoom}
            />;
        }

        if (storyModeActive) {
            return <StoryModeView 
                user={currentUser.profile}
                onUpdateUser={handleUpdateUser}
                onExit={handleExitStoryMode}
            />;
        }

        if (activeMission?.active) {
            return <MissionView 
                question={activeMission.question}
                language={activeMission.language}
                initialCode={activeMission.code}
                onCodeChange={handleMissionCodeUpdate}
                onFinish={handleMissionFinish}
                onPause={handleMissionPause}
            />
        }
        
        if (activeConceptSlug) {
            return <ConceptSolveView
                key={activeConceptSlug} // Re-mount component when slug changes
                conceptSlug={activeConceptSlug}
                user={currentUser.profile}
                onUpdateUser={handleUpdateUser}
                onExit={() => setActiveConceptSlug(null)}
                onSolveNew={(slug) => setActiveConceptSlug(slug)}
            />;
        }

        if (activeChallenge) {
            return <ChallengeView language={activeChallenge.language} onComplete={handleCompleteChallenge} />;
        }

        if (activeAssessment) {
            return <AssessmentView
                userActivity={currentUser.profile.activity}
                config={activeAssessment}
                onComplete={(result) => handleAssessmentComplete(result, activeAssessment)}
                onCancel={() => setActiveAssessment(null)}
            />;
        }

        if (viewingAssessmentResultId) {
            return <AssessmentResultView
                resultId={viewingAssessmentResultId}
                user={currentUser.profile}
                onBack={() => setViewingAssessmentResultId(null)}
            />;
        }

        if (activeThreadContext) {
             return <DiscussionThreadView 
                key={activeThreadContext.id}
                threadId={activeThreadContext.id}
                initialScope={activeThreadContext.scope as any}
                user={currentUser}
                onBack={() => setActiveThreadContext(null)}
            />
        }
        
        if (viewingUserId) {
            return <AdminUserProfileView userId={viewingUserId} onBack={() => setViewingUserId(null)} />;
        }

        switch (currentView) {
            case 'general': return <DashboardPage user={currentUser.profile} onStartMission={handleStartMission} onSetView={setCurrentView} currentStreak={currentStreak} />;
            case 'assessment': return <AssessmentPage user={currentUser.profile} onUpdateUser={handleUpdateUser} onSelectConcept={(slug) => setActiveConceptSlug(slug)} onStartQuiz={setActiveAssessment} onViewResult={setViewingAssessmentResultId} />;
            case 'discussions': return <DiscussionsPage onSelectThread={(id, scope) => setActiveThreadContext({ id, scope })} user={currentUser} />;
            case 'learning_path': return <LearningPathPage user={currentUser.profile} onUpdateUser={handleUpdateUser} />;
            case 'hackathons': return <HackathonsPage onStartChallenge={handleStartChallenge} onChallengeFinished={handleChallengeFinished} user={currentUser.profile} />;
            case 'analytics': return <AnalyticsPage user={currentUser.profile} />;
            case 'admin': return <AdminDashboard knowledgeDocuments={knowledgeDocs} onAddDocument={handleAddDoc} onRemoveDocument={handleRemoveDoc} onSetViewingUser={setViewingUserId} onSetView={setCurrentView} />;
            case 'reports': return <ReportsPage onBack={() => setCurrentView('admin')} />;
            case 'playground': return <Playground />;
            case 'profile': return <ProfilePage user={currentUser.profile} onUpdateProfile={handleUpdateUser} isSubmitting={isSubmitting} onSignOut={handleSignOut} />;
            case 'leaderboard': return <LeaderboardPage user={currentUser.profile} onClaimBadge={handleClaimBadge} isSubmitting={isSubmitting} />;
            case 'story_mode': return (
                <div className="p-6">
                    <button 
                        onClick={handleStartStoryMode} 
                        className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                    >
                        Start Story Mode Adventure
                    </button>
                </div>
            );
            case 'events': return (
                <div className="p-6">
                    <button 
                        onClick={() => setThemedEventsOpen(true)} 
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                    >
                        View Themed Events
                    </button>
                </div>
            );
            default: return <DashboardPage user={currentUser.profile} onStartMission={handleStartMission} onSetView={setCurrentView} currentStreak={currentStreak} />;
        }
    }
    
    return (
        <div className="min-h-screen relative overflow-hidden bg-slate-950 performance-container font-sans" data-container="true">
            {/* Galaxy Background */}
            <div className="fixed inset-0 z-0 performance-container">
            <Galaxy 
                mouseRepulsion={false}
                mouseInteraction={false}
                density={0.4}
                glowIntensity={0.15}
                saturation={0.25}
                hueShift={260}
                transparent={true}
                speed={0.2}
                twinkleIntensity={0.1}
                rotationSpeed={0.005}
                disableAnimation={isTakingTest}
            />
            </div>
            
            {/* Background overlay for content readability */}
            <div className="absolute inset-0 z-5 bg-gradient-to-br from-slate-950/40 via-slate-900/60 to-slate-800/50 backdrop-blur-sm"></div>
            {/* Invisible hover trigger area for the sidebar */}
            <div
                className="fixed top-0 left-0 h-full w-4 z-50"
                onMouseEnter={handleSidebarEnter}
                onMouseLeave={handleSidebarLeave}
            />
            <Sidebar 
                isOpen={isSidebarOpen}
                currentView={currentView}
                onSetView={(view) => {
                  setActiveConceptSlug(null);
                  setActiveThreadContext(null);
                  setViewingAssessmentResultId(null);
                  setCurrentView(view);
                }}
                userRole={currentUser.role}
                onMouseEnter={handleSidebarEnter}
                onMouseLeave={handleSidebarLeave}
            />

            <div className={`transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-64' : 'ml-16'} relative z-20`}>
                <Header 
                    user={currentUser.profile}
                    notifications={notifications}
                    onMarkAllRead={handleMarkAllRead}
                    currentStreak={currentStreak}
                    onNavigate={setCurrentView}
                    onSelectConcept={setActiveConceptSlug}
                    onStartChallenge={handleStartChallenge}
                />
            
                <main className="p-4 md:p-8">
                    {renderMainContent()}
                </main>
            </div>
            
            {!isTakingTest && <Chatbot />}
            
            {/* New Feature Components */}
            <LootBoxSystem 
                user={currentUser.profile}
                onUpdateUser={handleUpdateUser}
                isOpen={lootBoxOpen}
                onClose={() => setLootBoxOpen(false)}
            />
            
            <MindfulnessBreak 
                user={currentUser.profile}
                onUpdateUser={handleUpdateUser}
                sessionDuration={codingSessionDuration}
                isOpen={mindfulnessBreakOpen}
                onClose={() => setMindfulnessBreakOpen(false)}
            />
            
            <ReflectionJournal 
                user={currentUser.profile}
                onUpdateUser={handleUpdateUser}
                isOpen={reflectionJournalOpen}
                onClose={() => setReflectionJournalOpen(false)}
            />
            
            <ThemedEventsSystem 
                user={currentUser.profile}
                onUpdateUser={handleUpdateUser}
                isOpen={themedEventsOpen}
                onClose={() => setThemedEventsOpen(false)}
            />
            
            <EasterEggSystem 
                user={currentUser.profile}
                onUpdateUser={handleUpdateUser}
                onUnlockTheme={handleUnlockTheme}
            />
        </div>
    );
}

export default App;