import React, { useState, useEffect } from 'react';

interface CountdownProps {
    targetDate: Date;
}

const Countdown: React.FC<CountdownProps> = ({ targetDate }) => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [isUrgent, setIsUrgent] = useState(false);

    useEffect(() => {
        const calculate = () => {
            const difference = +targetDate - +new Date();
            let newTimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

            if (difference > 0) {
                newTimeLeft = {
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                };
                setIsUrgent(difference < 60 * 60 * 1000); // Less than 1 hour
            } else {
                setIsUrgent(false);
            }
            setTimeLeft(newTimeLeft);
        };

        calculate(); // Initial calculation
        const timer = setInterval(calculate, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);
    
    const TimerSegment: React.FC<{ value: number, label: string }> = ({ value, label }) => (
        <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-white bg-white/10 px-3 py-2 rounded-lg">{String(value).padStart(2, '0')}</span>
            <span className="text-xs text-gray-300 mt-1">{label}</span>
        </div>
    );

    const isFinished = !Object.values(timeLeft).some(val => val > 0);

    if (isFinished) {
        return <div className="text-center font-bold text-xl text-green-400">Event is Live!</div>;
    }

    return (
        <div className={`flex items-center justify-center gap-2 md:gap-4 ${isUrgent ? 'animate-pulse' : ''}`}>
            <TimerSegment value={timeLeft.days} label="Days" />
            <span className="text-2xl font-bold text-gray-500">:</span>
            <TimerSegment value={timeLeft.hours} label="Hours" />
            <span className="text-2xl font-bold text-gray-500">:</span>
            <TimerSegment value={timeLeft.minutes} label="Mins" />
            <span className="text-2xl font-bold text-gray-500">:</span>
            <TimerSegment value={timeLeft.seconds} label="Secs" />
        </div>
    );
};

export default Countdown;