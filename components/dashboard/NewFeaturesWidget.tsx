import React, { useState } from 'react';
import { X, Sparkles, Users, BookOpen, Calendar, Heart, Gift } from 'lucide-react';

interface NewFeaturesWidgetProps {
    onLaunchFeature: (feature: string) => void;
}

const NewFeaturesWidget: React.FC<NewFeaturesWidgetProps> = ({ onLaunchFeature }) => {
    const [isExpanded, setIsExpanded] = useState(true);

    const features = [
        {
            id: 'story_mode',
            title: 'Story Mode Adventures',
            description: 'Turn learning into an epic narrative journey',
            icon: <BookOpen className="w-5 h-5" />,
            color: 'from-indigo-500 to-purple-600',
            emoji: '📚'
        },
        {
            id: 'collaborative_coding',
            title: 'Real-time Collaboration',
            description: 'Code together with peers in shared rooms',
            icon: <Users className="w-5 h-5" />,
            color: 'from-blue-500 to-cyan-600',
            emoji: '👥'
        },
        {
            id: 'themed_events',
            title: 'Seasonal Events',
            description: 'Join themed coding challenges and competitions',
            icon: <Calendar className="w-5 h-5" />,
            color: 'from-orange-500 to-red-600',
            emoji: '🎉'
        },
        {
            id: 'loot_boxes',
            title: 'Surprise Rewards',
            description: 'Unlock mystery boxes with exciting prizes',
            icon: <Gift className="w-5 h-5" />,
            color: 'from-yellow-500 to-orange-600',
            emoji: '🎁'
        },
        {
            id: 'mindfulness',
            title: 'Mindfulness Breaks',
            description: 'Take guided breaks to stay focused and healthy',
            icon: <Heart className="w-5 h-5" />,
            color: 'from-green-500 to-teal-600',
            emoji: '🧘'
        }
    ];

    if (!isExpanded) {
        return (
            <div className="fixed top-20 right-4 z-20">
                <button
                    onClick={() => setIsExpanded(true)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded-full shadow-lg hover:scale-105 transition-transform duration-200"
                >
                    <Sparkles className="w-6 h-6" />
                </button>
            </div>
        );
    }

    return (
        <>
            {/* Full screen overlay to dim background */}
            <div 
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 transition-all duration-300"
                onClick={() => setIsExpanded(false)}
            ></div>
            
            {/* Features widget positioned above overlay */}
            <div className="fixed top-20 right-4 w-80 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-2xl z-40 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                        <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white">New Features!</h3>
                            <p className="text-xs text-slate-300">Discover exciting additions</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsExpanded(false)}
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                    {features.map((feature) => (
                        <div
                            key={feature.id}
                            onClick={() => onLaunchFeature(feature.id)}
                            className="group p-3 bg-white/5 hover:bg-white/10 rounded-xl cursor-pointer transition-all duration-200 border border-white/10 hover:border-white/20"
                        >
                            <div className="flex items-start space-x-3">
                                <div className={`p-2 bg-gradient-to-r ${feature.color} rounded-lg text-white group-hover:scale-110 transition-transform duration-200`}>
                                    {feature.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2 mb-1">
                                        <h4 className="font-semibold text-white text-sm group-hover:text-purple-200 transition-colors">
                                            {feature.title}
                                        </h4>
                                        <span className="text-lg">{feature.emoji}</span>
                                    </div>
                                    <p className="text-xs text-slate-300 line-clamp-2">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-2 flex justify-end">
                                <span className="text-xs text-purple-400 font-medium group-hover:text-purple-300">
                                    Try Now →
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-4 pt-3 border-t border-white/10">
                    <p className="text-xs text-center text-slate-400">
                        More features coming soon! 🚀
                    </p>
                </div>
            </div>
        </>
    );
};

export default NewFeaturesWidget;
