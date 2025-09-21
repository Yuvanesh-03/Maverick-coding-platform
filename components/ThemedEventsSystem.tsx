import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import Button from './Button';
import Card from './Card';
import CalendarIcon from './icons/CalendarIcon';
import GiftIcon from './icons/GiftIcon';
import ClockIcon from './icons/ClockIcon';
import FireIcon from './icons/FireIcon';

interface ThemedEvent {
  id: string;
  name: string;
  theme: 'halloween' | 'christmas' | 'valentine' | 'summer' | 'spring' | 'community_choice';
  description: string;
  startDate: Date;
  endDate: Date;
  status: 'upcoming' | 'active' | 'ended';
  backgroundImage: string;
  primaryColor: string;
  accentColor: string;
  challenges: EventChallenge[];
  rewards: EventReward[];
  participants: number;
  maxParticipants?: number;
}

interface EventChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  xpReward: number;
  specialReward?: string;
  completed: boolean;
  type: 'coding' | 'trivia' | 'creative' | 'community';
}

interface EventReward {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockCondition: string;
  claimed: boolean;
}

interface ThemedEventsSystemProps {
  user: UserProfile;
  onUpdateUser: (data: Partial<UserProfile>) => void;
  isOpen: boolean;
  onClose: () => void;
}

const THEMED_EVENTS: ThemedEvent[] = [
  {
    id: 'halloween_2024',
    name: 'Spooky Code Halloween',
    theme: 'halloween',
    description: 'Debug the haunted code and solve mysterious algorithms in this spine-chilling event!',
    startDate: new Date('2024-10-25'),
    endDate: new Date('2024-11-02'),
    status: 'active',
    backgroundImage: 'linear-gradient(135deg, #1a0b2e, #4a148c, #7b1fa2)',
    primaryColor: '#ff6b35',
    accentColor: '#ffc107',
    participants: 1247,
    challenges: [
      {
        id: 'ghost_debug',
        title: '👻 Ghost in the Machine',
        description: 'Find and fix the phantom bugs hiding in this haunted code',
        difficulty: 'Medium',
        xpReward: 200,
        specialReward: 'Ghostly Debugger Badge',
        completed: false,
        type: 'coding'
      },
      {
        id: 'pumpkin_algo',
        title: '🎃 Pumpkin Carving Algorithm',
        description: 'Create an algorithm to design the perfect jack-o-lantern pattern',
        difficulty: 'Hard',
        xpReward: 350,
        specialReward: 'Pumpkin Master Theme',
        completed: false,
        type: 'coding'
      },
      {
        id: 'horror_trivia',
        title: '🧙‍♀️ Horror Movie Code Trivia',
        description: 'Test your knowledge of programming concepts using horror movie analogies',
        difficulty: 'Easy',
        xpReward: 100,
        specialReward: 'Movie Buff Badge',
        completed: true,
        type: 'trivia'
      }
    ],
    rewards: [
      {
        id: 'halloween_theme',
        name: 'Haunted Code Theme',
        description: 'A spooky dark theme with orange accents and bat animations',
        icon: '🦇',
        rarity: 'epic',
        unlockCondition: 'Complete 2 Halloween challenges',
        claimed: false
      },
      {
        id: 'witch_hat',
        name: 'Witch Hat Avatar Item',
        description: 'A magical witch hat for your avatar',
        icon: '🎩',
        rarity: 'rare',
        unlockCondition: 'Complete Ghost in the Machine challenge',
        claimed: false
      }
    ]
  },
  {
    id: 'winter_2024',
    name: 'Winter Code Wonderland',
    theme: 'christmas',
    description: 'Spread holiday cheer through code in this festive winter event!',
    startDate: new Date('2024-12-15'),
    endDate: new Date('2025-01-02'),
    status: 'upcoming',
    backgroundImage: 'linear-gradient(135deg, #0d47a1, #1565c0, #42a5f5)',
    primaryColor: '#d32f2f',
    accentColor: '#4caf50',
    participants: 0,
    challenges: [
      {
        id: 'snowflake_gen',
        title: '❄️ Snowflake Generator',
        description: 'Create beautiful unique snowflake patterns using recursion',
        difficulty: 'Medium',
        xpReward: 250,
        specialReward: 'Winter Wizard Badge',
        completed: false,
        type: 'coding'
      },
      {
        id: 'gift_wrap',
        title: '🎁 Gift Wrapping Algorithm',
        description: 'Optimize the gift wrapping process with efficient packing algorithms',
        difficulty: 'Hard',
        xpReward: 400,
        specialReward: 'Santa\'s Helper Theme',
        completed: false,
        type: 'coding'
      }
    ],
    rewards: [
      {
        id: 'winter_theme',
        name: 'Winter Wonderland Theme',
        description: 'A cozy winter theme with falling snow animations',
        icon: '⛄',
        rarity: 'legendary',
        unlockCondition: 'Complete all Winter challenges',
        claimed: false
      }
    ]
  }
];

const ThemedEventsSystem: React.FC<ThemedEventsSystemProps> = ({
  user,
  onUpdateUser,
  isOpen,
  onClose
}) => {
  const [selectedEvent, setSelectedEvent] = useState<ThemedEvent | null>(null);
  const [events, setEvents] = useState<ThemedEvent[]>(THEMED_EVENTS);
  const [viewMode, setViewMode] = useState<'browse' | 'active' | 'voting'>('browse');
  const [timeLeft, setTimeLeft] = useState<{[key: string]: string}>({});

  useEffect(() => {
    // Update countdown timers
    const interval = setInterval(() => {
      const now = new Date();
      const newTimeLeft: {[key: string]: string} = {};
      
      events.forEach(event => {
        const target = event.status === 'upcoming' ? event.startDate : event.endDate;
        const diff = target.getTime() - now.getTime();
        
        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          
          newTimeLeft[event.id] = `${days}d ${hours}h ${minutes}m`;
        } else {
          newTimeLeft[event.id] = 'Ended';
        }
      });
      
      setTimeLeft(newTimeLeft);
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [events]);

  const handleJoinEvent = (event: ThemedEvent) => {
    setEvents(prev => prev.map(e => 
      e.id === event.id 
        ? { ...e, participants: e.participants + 1 }
        : e
    ));
    
    // Award joining bonus
    const currentXP = user.xp || 0;
    onUpdateUser({
      xp: currentXP + 50,
      level: Math.floor((currentXP + 50) / 1000) + 1
    });
  };

  const handleCompleteChallenge = (eventId: string, challengeId: string) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId
        ? {
            ...event,
            challenges: event.challenges.map(challenge =>
              challenge.id === challengeId
                ? { ...challenge, completed: true }
                : challenge
            )
          }
        : event
    ));

    const event = events.find(e => e.id === eventId);
    const challenge = event?.challenges.find(c => c.id === challengeId);
    
    if (challenge) {
      const currentXP = user.xp || 0;
      onUpdateUser({
        xp: currentXP + challenge.xpReward,
        level: Math.floor((currentXP + challenge.xpReward) / 1000) + 1
      });
    }
  };

  const EventCard: React.FC<{ event: ThemedEvent }> = ({ event }) => (
    <div 
      className="relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105"
      style={{ background: event.backgroundImage }}
      onClick={() => setSelectedEvent(event)}
    >
      <div className="absolute inset-0 bg-black/30"></div>
      <div className="relative p-6 text-white">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-2xl font-bold mb-2">{event.name}</h3>
            <p className="text-sm opacity-90">{event.description}</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-bold ${
            event.status === 'active' ? 'bg-green-500' :
            event.status === 'upcoming' ? 'bg-blue-500' : 'bg-gray-500'
          }`}>
            {event.status.toUpperCase()}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <div className="text-lg font-bold">{event.participants}</div>
            <div className="text-xs opacity-80">Participants</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <div className="text-lg font-bold">{event.challenges.length}</div>
            <div className="text-xs opacity-80">Challenges</div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClockIcon className="h-4 w-4" />
            <span className="text-sm">
              {event.status === 'upcoming' ? 'Starts in' : 'Ends in'}: {timeLeft[event.id] || 'Calculating...'}
            </span>
          </div>
          <Button size="sm" className="bg-white/20 hover:bg-white/30">
            {event.status === 'active' ? 'Join Event' : 'View Details'}
          </Button>
        </div>
      </div>
    </div>
  );

  const ChallengeItem: React.FC<{ challenge: EventChallenge; eventId: string }> = ({ challenge, eventId }) => (
    <div className={`p-4 rounded-lg border-2 transition-all ${
      challenge.completed 
        ? 'bg-green-50 dark:bg-green-900/20 border-green-500' 
        : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-purple-500'
    }`}>
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-bold text-lg">{challenge.title}</h4>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded-full ${
            challenge.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
            challenge.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {challenge.difficulty}
          </span>
          {challenge.completed && <span className="text-green-500">✓</span>}
        </div>
      </div>
      <p className="text-gray-600 dark:text-gray-300 mb-3">{challenge.description}</p>
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Reward: {challenge.xpReward} XP
          {challenge.specialReward && (
            <span className="ml-2 text-purple-600 font-medium">+ {challenge.specialReward}</span>
          )}
        </div>
        {!challenge.completed && (
          <Button 
            size="sm" 
            onClick={() => handleCompleteChallenge(eventId, challenge.id)}
          >
            Start Challenge
          </Button>
        )}
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <CalendarIcon className="h-8 w-8" />
              <div>
                <h2 className="text-2xl font-bold">Themed Events & Seasons</h2>
                <p className="opacity-90">Limited-time challenges and exclusive rewards!</p>
              </div>
            </div>
            <Button variant="secondary" onClick={onClose} className="text-purple-600">
              Close
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-2 justify-center">
            {[
              { id: 'browse', name: 'Browse Events', icon: '📅' },
              { id: 'active', name: 'My Active Events', icon: '🎯' },
              { id: 'voting', name: 'Vote for Themes', icon: '🗳️' }
            ].map(mode => (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === mode.id
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/20'
                }`}
              >
                {mode.icon} {mode.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {selectedEvent ? (
            // Event Details View
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <Button variant="secondary" onClick={() => setSelectedEvent(null)}>
                  ← Back to Events
                </Button>
                {selectedEvent.status === 'active' && (
                  <Button onClick={() => handleJoinEvent(selectedEvent)}>
                    Join Event (+50 XP)
                  </Button>
                )}
              </div>

              {/* Event Header */}
              <div 
                className="p-8 rounded-2xl text-white relative overflow-hidden"
                style={{ background: selectedEvent.backgroundImage }}
              >
                <div className="absolute inset-0 bg-black/30"></div>
                <div className="relative">
                  <h1 className="text-4xl font-bold mb-4">{selectedEvent.name}</h1>
                  <p className="text-lg opacity-90 mb-6">{selectedEvent.description}</p>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white/10 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold">{selectedEvent.participants}</div>
                      <div className="text-sm opacity-80">Participants</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold">{selectedEvent.challenges.filter(c => c.completed).length}/{selectedEvent.challenges.length}</div>
                      <div className="text-sm opacity-80">Completed</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4 text-center">
                      <div className="text-lg font-bold">{timeLeft[selectedEvent.id] || 'Calculating...'}</div>
                      <div className="text-sm opacity-80">Time Left</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Challenges */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Event Challenges</h3>
                <div className="grid grid-cols-1 gap-4">
                  {selectedEvent.challenges.map(challenge => (
                    <ChallengeItem 
                      key={challenge.id} 
                      challenge={challenge} 
                      eventId={selectedEvent.id}
                    />
                  ))}
                </div>
              </div>

              {/* Rewards */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Exclusive Rewards</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedEvent.rewards.map(reward => (
                    <div key={reward.id} className={`p-4 rounded-lg border-2 ${
                      reward.claimed ? 'bg-green-50 dark:bg-green-900/20 border-green-500' :
                      'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-300 dark:border-yellow-700'
                    }`}>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl">{reward.icon}</span>
                        <div>
                          <h4 className="font-bold">{reward.name}</h4>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            reward.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-800' :
                            reward.rarity === 'epic' ? 'bg-purple-100 text-purple-800' :
                            reward.rarity === 'rare' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {reward.rarity}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{reward.description}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Unlock: {reward.unlockCondition}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Events List View
            <div className="space-y-6">
              {viewMode === 'browse' && (
                <>
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Seasonal Events & Special Challenges
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Join limited-time events for exclusive rewards and unique experiences!
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {events.map(event => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                </>
              )}

              {viewMode === 'voting' && (
                <div className="text-center py-12">
                  <GiftIcon className="h-16 w-16 text-purple-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Community Theme Voting
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Vote for the next themed event! Your voice shapes the platform's future.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                    {['🌸 Spring Festival', '🏖️ Summer Beach Party', '🍂 Autumn Harvest'].map((theme, idx) => (
                      <button
                        key={idx}
                        className="p-6 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-700 hover:scale-105 transition-transform"
                      >
                        <div className="text-3xl mb-2">{theme.split(' ')[0]}</div>
                        <h4 className="font-bold text-gray-900 dark:text-white">
                          {theme.substring(2)}
                        </h4>
                        <div className="mt-3 bg-purple-500 text-white px-3 py-1 rounded-full text-sm">
                          Vote ({Math.floor(Math.random() * 500 + 100)} votes)
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThemedEventsSystem;
