import React, { useState, useEffect } from 'react';
import ArrowTrendingUpIcon from '../icons/ArrowTrendingUpIcon';

interface StatCardProps {
    title: string;
    icon: React.ReactNode;
    value?: number | string;
    valueComponent?: React.ReactNode;
    trend: number | null;
}

const AnimatedCounter: React.FC<{ value: number }> = ({ value }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const end = value;
        if (start === end) {
            setCount(end);
            return;
        }

        const duration = 1500;
        let startTime: number | null = null;

        const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            // Ease out function
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            const currentCount = Math.floor(easedProgress * (end - start) + start);
            setCount(currentCount);

            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };

        requestAnimationFrame(step);
    }, [value]);

    return <>{count.toLocaleString()}</>;
};

const StatCard: React.FC<StatCardProps> = ({ title, icon, value, valueComponent, trend }) => {
    const trendIsPositive = trend !== null && trend >= 0;

    return (
        <div className="glass-effect p-4 rounded-[16px] border border-slate-200/20 dark:border-slate-700/30 card-3d-hover transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-xl animate-float"></div>
            <div className="flex items-center gap-3 relative z-10">
                <div className="p-2 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-full animate-pulse-slow">
                    {icon}
                </div>
                <p className="text-sm font-medium text-slate-300 dark:text-slate-300">{title}</p>
            </div>
            <div className="mt-2 text-3xl font-bold text-slate-100 dark:text-slate-100 animate-count-up relative z-10">
                {valueComponent ? valueComponent : (typeof value === 'number' ? <AnimatedCounter value={value} /> : value)}
            </div>
            {trend !== null && (
                <div className={`mt-1 flex items-center text-[12px] font-normal ${trendIsPositive ? 'text-[#48bb78]' : 'text-[#f56565]'}`}>
                    <ArrowTrendingUpIcon className={`h-4 w-4 mr-1 ${!trendIsPositive && 'transform -scale-y-100'}`} />
                    {trendIsPositive ? `+${trend}` : trend} this week
                </div>
            )}
        </div>
    );
};

export default StatCard;