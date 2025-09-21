import React, { useState, useEffect, useRef } from 'react';

// Floating Particles Component
export const FloatingParticles: React.FC = () => {
    const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);
    
    useEffect(() => {
        const createParticles = () => {
            const newParticles = Array.from({ length: 15 }, (_, i) => ({
                id: i,
                x: Math.random() * 100,
                y: Math.random() * 100,
                delay: Math.random() * 5
            }));
            setParticles(newParticles);
        };
        
        createParticles();
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {particles.map(particle => (
                <div
                    key={particle.id}
                    className="absolute w-1 h-1 bg-gradient-to-r from-violet-400/30 to-purple-500/30 rounded-full animate-float"
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        animationDelay: `${particle.delay}s`,
                        animationDuration: `${4 + Math.random() * 4}s`
                    }}
                />
            ))}
        </div>
    );
};

// Interactive Cursor Trail
export const CursorTrail: React.FC = () => {
    const [trail, setTrail] = useState<Array<{ id: number; x: number; y: number }>>([]);
    const trailRef = useRef<Array<{ id: number; x: number; y: number }>>([]);

    useEffect(() => {
        let animationId: number;
        
        const handleMouseMove = (e: MouseEvent) => {
            const newPoint = { id: Date.now(), x: e.clientX, y: e.clientY };
            trailRef.current = [newPoint, ...trailRef.current.slice(0, 8)];
        };

        const updateTrail = () => {
            setTrail([...trailRef.current]);
            // Fade out old points
            trailRef.current = trailRef.current.slice(0, 8);
            animationId = requestAnimationFrame(updateTrail);
        };

        document.addEventListener('mousemove', handleMouseMove);
        updateTrail();

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-10">
            {trail.map((point, index) => (
                <div
                    key={point.id}
                    className="absolute w-2 h-2 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full"
                    style={{
                        left: point.x - 4,
                        top: point.y - 4,
                        opacity: (8 - index) / 8,
                        transform: `scale(${(8 - index) / 8})`,
                        transition: 'opacity 0.3s ease, transform 0.3s ease'
                    }}
                />
            ))}
        </div>
    );
};

// Success Celebration Component
export const SuccessCelebration: React.FC<{ isVisible: boolean; onComplete: () => void }> = ({ isVisible, onComplete }) => {
    const [confetti, setConfetti] = useState<Array<{ id: number; x: number; color: string; delay: number }>>([]);

    useEffect(() => {
        if (isVisible) {
            const colors = ['#8b5cf6', '#a855f7', '#6366f1', '#ec4899', '#f59e0b'];
            const newConfetti = Array.from({ length: 30 }, (_, i) => ({
                id: i,
                x: Math.random() * 100,
                color: colors[Math.floor(Math.random() * colors.length)],
                delay: Math.random() * 0.5
            }));
            setConfetti(newConfetti);
            
            const timer = setTimeout(onComplete, 3000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onComplete]);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {confetti.map(item => (
                <div
                    key={item.id}
                    className="absolute w-3 h-3 rounded-full animate-confetti-fall"
                    style={{
                        left: `${item.x}%`,
                        backgroundColor: item.color,
                        animationDelay: `${item.delay}s`
                    }}
                />
            ))}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white px-8 py-4 rounded-xl shadow-2xl animate-bounce-in text-xl font-bold">
                    🎉 Awesome Work! 🎉
                </div>
            </div>
        </div>
    );
};

// Floating Achievement Notification
export const FloatingNotification: React.FC<{
    message: string;
    type: 'success' | 'info' | 'achievement';
    isVisible: boolean;
    onDismiss: () => void;
}> = ({ message, type, isVisible, onDismiss }) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(onDismiss, 4000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onDismiss]);

    const getIcon = () => {
        switch (type) {
            case 'success': return '✅';
            case 'achievement': return '🏆';
            default: return 'ℹ️';
        }
    };

    const getColors = () => {
        switch (type) {
            case 'success': return 'from-green-500 to-emerald-600';
            case 'achievement': return 'from-yellow-500 to-orange-600';
            default: return 'from-blue-500 to-indigo-600';
        }
    };

    if (!isVisible) return null;

    return (
        <div className="fixed top-20 right-6 z-50 animate-slide-in-right">
            <div className={`bg-gradient-to-r ${getColors()} text-white px-6 py-4 rounded-xl shadow-2xl max-w-sm border border-white/20`}>
                <div className="flex items-center gap-3">
                    <span className="text-2xl">{getIcon()}</span>
                    <div>
                        <p className="font-semibold text-sm">{message}</p>
                    </div>
                    <button
                        onClick={onDismiss}
                        className="ml-auto text-white/80 hover:text-white transition-colors"
                    >
                        ×
                    </button>
                </div>
            </div>
        </div>
    );
};

// Interactive Progress Ring
export const InteractiveProgressRing: React.FC<{
    progress: number;
    size?: number;
    strokeWidth?: number;
    className?: string;
}> = ({ progress, size = 60, strokeWidth = 4, className = '' }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className={`relative ${className}`}>
            <svg width={size} height={size} className="transform -rotate-90">
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    className="text-gray-200 dark:text-gray-700"
                />
                {/* Progress circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="url(#progressGradient)"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-700 ease-out drop-shadow-sm"
                />
                <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                </defs>
            </svg>
            {/* Center text */}
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                    {Math.round(progress)}%
                </span>
            </div>
        </div>
    );
};

// Ripple Effect Component
export const RippleEffect: React.FC<{ trigger: boolean; onComplete?: () => void }> = ({ trigger, onComplete }) => {
    const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

    useEffect(() => {
        if (trigger) {
            const newRipple = {
                id: Date.now(),
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight
            };
            setRipples(prev => [...prev, newRipple]);

            const timer = setTimeout(() => {
                setRipples(prev => prev.filter(r => r.id !== newRipple.id));
                onComplete?.();
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [trigger, onComplete]);

    return (
        <div className="fixed inset-0 pointer-events-none z-20">
            {ripples.map(ripple => (
                <div
                    key={ripple.id}
                    className="absolute w-4 h-4 border-2 border-violet-500/50 rounded-full animate-ping"
                    style={{
                        left: ripple.x - 8,
                        top: ripple.y - 8,
                        animationDuration: '1s'
                    }}
                />
            ))}
        </div>
    );
};

// Interactive Tooltip Component
export const InteractiveTooltip: React.FC<{
    content: string;
    children: React.ReactNode;
    position?: 'top' | 'bottom' | 'left' | 'right';
}> = ({ content, children, position = 'top' }) => {
    const [isVisible, setIsVisible] = useState(false);

    const getPositionClasses = () => {
        switch (position) {
            case 'top': return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
            case 'bottom': return 'top-full left-1/2 transform -translate-x-1/2 mt-2';
            case 'left': return 'right-full top-1/2 transform -translate-y-1/2 mr-2';
            case 'right': return 'left-full top-1/2 transform -translate-y-1/2 ml-2';
            default: return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
        }
    };

    return (
        <div
            className="relative inline-block"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            {isVisible && (
                <div className={`absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 dark:bg-gray-700 rounded-lg shadow-lg whitespace-nowrap animate-fade-in ${getPositionClasses()}`}>
                    {content}
                    <div className="absolute w-2 h-2 bg-gray-900 dark:bg-gray-700 transform rotate-45" 
                         style={{ 
                             [position === 'top' ? 'top' : position === 'bottom' ? 'bottom' : position === 'left' ? 'right' : 'left']: '-4px',
                             [position === 'top' || position === 'bottom' ? 'left' : 'top']: '50%',
                             transform: position === 'top' || position === 'bottom' ? 'translateX(-50%) rotate(45deg)' : 'translateY(-50%) rotate(45deg)'
                         }}
                    />
                </div>
            )}
        </div>
    );
};

// Dynamic Theme Switcher with Animation
export const AnimatedThemeToggle: React.FC<{ theme: 'light' | 'dark'; onToggle: () => void }> = ({ theme, onToggle }) => {
    return (
        <button
            onClick={onToggle}
            className="relative w-14 h-7 bg-gray-200 dark:bg-gray-700 rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        >
            <div
                className={`absolute w-5 h-5 bg-white rounded-full shadow-md transform transition-all duration-300 flex items-center justify-center text-xs ${
                    theme === 'dark' ? 'translate-x-7 bg-gray-800' : 'translate-x-0'
                }`}
            >
                {theme === 'dark' ? '🌙' : '☀️'}
            </div>
            
            {/* Background animation */}
            <div className={`absolute inset-0 rounded-full transition-all duration-500 ${
                theme === 'dark' 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600' 
                    : 'bg-gradient-to-r from-yellow-400 to-orange-500'
            }`} />
        </button>
    );
};

// Interactive Card Hover Effects
export const InteractiveCard: React.FC<{
    children: React.ReactNode;
    className?: string;
    hoverEffect?: 'lift' | 'glow' | 'tilt';
}> = ({ children, className = '', hoverEffect = 'lift' }) => {
    const [isHovered, setIsHovered] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (hoverEffect === 'tilt' && cardRef.current) {
            const rect = cardRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
        }
    };

    const handleMouseLeave = () => {
        if (hoverEffect === 'tilt' && cardRef.current) {
            cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        }
        setIsHovered(false);
    };

    const getHoverClasses = () => {
        switch (hoverEffect) {
            case 'lift':
                return 'hover:transform hover:-translate-y-2 hover:shadow-2xl';
            case 'glow':
                return 'hover:shadow-xl hover:shadow-violet-500/25';
            case 'tilt':
                return 'transform-gpu transition-transform duration-300';
            default:
                return '';
        }
    };

    return (
        <div
            ref={cardRef}
            className={`transition-all duration-300 ${getHoverClasses()} ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {children}
        </div>
    );
};
