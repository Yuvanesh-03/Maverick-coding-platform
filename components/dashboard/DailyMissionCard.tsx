import React, { useState, useEffect, useMemo } from 'react';
import { UserProfile, ProgrammingQuestion } from '../../types';
import { getOrGenerateDailyMission } from '../../services/missionService';
import TargetIcon from '../icons/TargetIcon';
import CheckIcon from '../icons/CheckIcon';

interface DailyMissionCardProps {
    onStartMission: (config: { language: string, question: ProgrammingQuestion }) => void;
    user: UserProfile;
}

const getISTTime = () => new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
const getISTDateString = (date: Date) => `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;

const Confetti: React.FC = () => {
    const confettiPieces = Array.from({ length: 50 }).map((_, i) => {
        const style = {
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            '--color1': '#4299e6', // blue
            '--color2': '#38b2ac', // teal
            '--color3': '#68d391', // green
        };
        const colorClass = ['bg-[#4299e6]', 'bg-[#38b2ac]', 'bg-[#68d391]'][i % 3];
        return <div key={i} className={`confetti ${colorClass}`} style={style as React.CSSProperties}></div>;
    });
    return <div className="absolute inset-0 pointer-events-none overflow-hidden">{confettiPieces}</div>;
};

const DailyMissionCard: React.FC<DailyMissionCardProps> = ({ onStartMission, user }) => {
    const [dailyQuestion, setDailyQuestion] = useState<ProgrammingQuestion | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const timer = setInterval(() => {
            const now = getISTTime();
            const tomorrow = new Date(now);
            tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
            tomorrow.setUTCHours(0, 0, 0, 0);
            const diff = tomorrow.getTime() - now.getTime();
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            setTimeLeft(`${hours}h ${minutes}m`);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const todayString = useMemo(() => getISTDateString(getISTTime()), []);
    const missionProgress = user.dailyMissionProgress;
    const hasCompletedToday = missionProgress?.date === todayString && missionProgress.completed;

    useEffect(() => {
        if (hasCompletedToday) {
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        const languageForFetch = user.skills.find(s => s.name === 'Python')?.name || user.skills[0]?.name || 'JavaScript';
        getOrGenerateDailyMission(todayString, languageForFetch)
            .then(q => setDailyQuestion({ ...q, difficulty: 'Medium' }))
            .catch(error => console.error("Failed to load daily mission:", error))
            .finally(() => setIsLoading(false));
    }, [todayString, hasCompletedToday, user.skills]);

    const handleStartClick = async () => {
        if (!dailyQuestion) return;
        setIsLoading(true);
        try {
            const lang = dailyQuestion.starterCodes ? Object.keys(dailyQuestion.starterCodes)[0] : 'JavaScript';
            const finalQuestion = await getOrGenerateDailyMission(todayString, lang);
            onStartMission({ language: lang, question: finalQuestion });
        } catch (error) {
            console.error("Failed to get mission for selected language:", error);
        } finally {
            setIsLoading(false);
        }
    };
    
    if (hasCompletedToday) {
        return (
            <div className="bg-white rounded-[12px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-300 flex flex-col border border-[#e2e8f0] h-full overflow-hidden relative">
                <Confetti />
                <div className="bg-[#2d3748] text-white p-4 flex items-center justify-between">
                    <h3 className="text-[18px] font-semibold">Daily Mission</h3>
                    <div className="text-[#38b2ac]"><CheckIcon className="h-6 w-6"/></div>
                </div>

                <div className="p-6 flex-grow flex flex-col items-center justify-center text-center">
                    <p className="text-2xl font-bold text-gradient">Mission Accomplished!</p>
                    <p className="text-sm text-gray-500 mt-2">Awesome work! Come back tomorrow for a new challenge.</p>
                    <button
                        disabled
                        className="w-full h-10 mt-6 bg-gradient-to-r from-[#4299e6] to-[#3182ce] text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 opacity-70 cursor-not-allowed"
                    >
                        <CheckIcon className="h-5 w-5"/> Completed
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-[#ffffff] rounded-[12px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-300 flex flex-col border border-[#e2e8f0] h-full overflow-hidden">
            {/* Dark Blue Header */}
            <div className="bg-[#2d3748] text-white p-4 flex items-center justify-between">
                <h3 className="text-[18px] font-semibold">Daily Mission</h3>
                <div className="text-[#38b2ac]">
                    <TargetIcon className="h-6 w-6"/>
                </div>
            </div>

            {/* White Card Body */}
            <div className="p-6 flex-grow flex flex-col">
                <p className="text-[12px] font-normal text-[#718096]">Resets in: {timeLeft}</p>
                <div className="border-b border-[#e2e8f0] my-4"></div>

                {/* Content */}
                <div className="flex-grow flex flex-col justify-center text-center">
                    {isLoading ? <div className="h-10 bg-gray-200 rounded animate-pulse w-3/4 mx-auto"></div> :
                     (<>
                        <p className="text-[16px] font-normal leading-snug text-[#4a5568]">{dailyQuestion?.questionText}</p>
                        <span className="mt-2 text-xs font-semibold px-[6px] py-1 bg-[#ecc94b]/20 text-[#D69E2E] rounded-full self-center">Medium</span>
                     </>)}
                </div>
                
                {/* Progress */}
                <div className="mt-3">
                    <div className="w-full bg-[#e2e8f0] rounded-full h-[8px] overflow-hidden">
                        <div className="bg-[#38b2ac] h-full rounded-full transition-all duration-1000" style={{width: hasCompletedToday ? '100%' : missionProgress?.date === todayString ? '50%' : '0%'}}></div>
                    </div>
                </div>

                {/* CTA */}
                <button
                    onClick={handleStartClick}
                    disabled={isLoading || hasCompletedToday}
                    className="w-full h-10 mt-6 bg-gradient-to-r from-[#4299e6] to-[#3182ce] text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:from-[#63b3ed] hover:to-[#4299e6] hover:shadow-[0_0_15px_rgba(66,153,230,0.5)] transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500 disabled:shadow-none"
                >
                    {hasCompletedToday ? <><CheckIcon className="h-5 w-5"/> Completed</> : (isLoading ? 'Loading...' : 'Start Challenge')}
                </button>
            </div>
        </div>
    );
};

export default DailyMissionCard;
