import React, { useState, useEffect, useCallback } from 'react';
import { UserProfile } from '../types';
import Button from './Button';
import Card from './Card';
import HeartIcon from './icons/HeartIcon';
import PlayIcon from './icons/PlayIcon';
import PauseIcon from './icons/PauseIcon';
import ClockIcon from './icons/ClockIcon';
import SparklesIcon from './icons/SparklesIcon';

interface MindfulnessBreakProps {
  user: UserProfile;
  onUpdateUser: (data: Partial<UserProfile>) => void;
  sessionDuration: number; // minutes of current coding session
  isOpen: boolean;
  onClose: () => void;
}

type BreakType = 'breathing' | 'memory' | 'focus' | 'gratitude';
type BreathingPhase = 'inhale' | 'hold' | 'exhale' | 'pause';

interface MemoryGame {
  sequence: number[];
  userSequence: number[];
  currentIndex: number;
  isPlaying: boolean;
  level: number;
}

const MINDFULNESS_QUOTES = [
  "Coding is an art of patience and precision. Take a moment to breathe.",
  "The best solutions often come to a relaxed mind.",
  "Debug your stress before debugging your code.",
  "A clear mind writes cleaner code.",
  "Take time to appreciate how far you've come.",
  "Every bug fixed is a step closer to mastery.",
  "Your journey in coding is unique and valuable.",
  "Embrace the learning process, not just the destination."
];

const BREATHING_PATTERNS = {
  '4-4-4-4': { inhale: 4, hold: 4, exhale: 4, pause: 4, name: 'Square Breathing' },
  '4-7-8': { inhale: 4, hold: 7, exhale: 8, pause: 0, name: '4-7-8 Technique' },
  '6-6-6': { inhale: 6, hold: 6, exhale: 6, pause: 0, name: 'Equal Breathing' },
};

const MindfulnessBreak: React.FC<MindfulnessBreakProps> = ({
  user,
  onUpdateUser,
  sessionDuration,
  isOpen,
  onClose
}) => {
  const [currentBreak, setCurrentBreak] = useState<BreakType>('breathing');
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<BreathingPhase>('inhale');
  const [breathingPattern, setBreathingPattern] = useState<keyof typeof BREATHING_PATTERNS>('4-4-4-4');
  const [breathingCount, setBreathingCount] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [completedCycles, setCompletedCycles] = useState(0);
  
  // Memory game state
  const [memoryGame, setMemoryGame] = useState<MemoryGame>({
    sequence: [],
    userSequence: [],
    currentIndex: 0,
    isPlaying: false,
    level: 1
  });
  
  // Focus game state
  const [focusTarget, setFocusTarget] = useState({ x: 50, y: 50 });
  const [focusScore, setFocusScore] = useState(0);
  const [focusActive, setFocusActive] = useState(false);
  
  // Current quote
  const [currentQuote, setCurrentQuote] = useState('');

  useEffect(() => {
    if (isOpen) {
      setCurrentQuote(MINDFULNESS_QUOTES[Math.floor(Math.random() * MINDFULNESS_QUOTES.length)]);
    }
  }, [isOpen]);

  // Breathing exercise timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (breathingActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Move to next phase
            const pattern = BREATHING_PATTERNS[breathingPattern];
            let nextPhase: BreathingPhase = 'inhale';
            
            switch (breathingPhase) {
              case 'inhale':
                nextPhase = pattern.hold > 0 ? 'hold' : 'exhale';
                break;
              case 'hold':
                nextPhase = 'exhale';
                break;
              case 'exhale':
                nextPhase = pattern.pause > 0 ? 'pause' : 'inhale';
                break;
              case 'pause':
                nextPhase = 'inhale';
                setCompletedCycles(c => c + 1);
                break;
            }
            
            setBreathingPhase(nextPhase);
            return pattern[nextPhase];
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [breathingActive, breathingPhase, breathingPattern, timeRemaining]);

  const startBreathing = () => {
    const pattern = BREATHING_PATTERNS[breathingPattern];
    setBreathingActive(true);
    setBreathingPhase('inhale');
    setTimeRemaining(pattern.inhale);
    setCompletedCycles(0);
  };

  const stopBreathing = () => {
    setBreathingActive(false);
    setTimeRemaining(0);
  };

  const startMemoryGame = () => {
    const sequence = Array.from({ length: memoryGame.level + 2 }, () => Math.floor(Math.random() * 4));
    setMemoryGame(prev => ({
      ...prev,
      sequence,
      userSequence: [],
      currentIndex: 0,
      isPlaying: true
    }));
    
    // Show sequence
    playSequence(sequence);
  };

  const playSequence = async (sequence: number[]) => {
    for (let i = 0; i < sequence.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 600));
      // Visual feedback would go here
    }
  };

  const handleMemoryInput = (colorIndex: number) => {
    if (!memoryGame.isPlaying) return;
    
    const newUserSequence = [...memoryGame.userSequence, colorIndex];
    
    if (colorIndex === memoryGame.sequence[newUserSequence.length - 1]) {
      if (newUserSequence.length === memoryGame.sequence.length) {
        // Level completed
        setMemoryGame(prev => ({
          sequence: [],
          userSequence: [],
          currentIndex: 0,
          isPlaying: false,
          level: prev.level + 1
        }));
        setTimeout(startMemoryGame, 1000);
      } else {
        setMemoryGame(prev => ({ ...prev, userSequence: newUserSequence }));
      }
    } else {
      // Game over
      setMemoryGame(prev => ({ ...prev, isPlaying: false, level: 1 }));
    }
  };

  const startFocusGame = () => {
    setFocusActive(true);
    setFocusScore(0);
    moveFocusTarget();
  };

  const moveFocusTarget = () => {
    setFocusTarget({
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10
    });
  };

  const handleFocusClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!focusActive) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;
    
    const distance = Math.sqrt(
      Math.pow(clickX - focusTarget.x, 2) + Math.pow(clickY - focusTarget.y, 2)
    );
    
    if (distance < 5) {
      setFocusScore(prev => prev + 1);
      moveFocusTarget();
    }
  };

  const completeBreak = (xpGained: number) => {
    const currentXP = user.xp || 0;
    onUpdateUser({
      xp: currentXP + xpGained,
      level: Math.floor((currentXP + xpGained) / 1000) + 1
    });
    onClose();
  };

  const getBreathingInstructions = () => {
    const instructions = {
      inhale: 'Breathe in slowly...',
      hold: 'Hold your breath...',
      exhale: 'Breathe out slowly...',
      pause: 'Pause naturally...'
    };
    return instructions[breathingPhase];
  };

  const getBreathingColor = () => {
    const colors = {
      inhale: 'from-blue-400 to-blue-600',
      hold: 'from-purple-400 to-purple-600',
      exhale: 'from-green-400 to-green-600',
      pause: 'from-gray-400 to-gray-600'
    };
    return colors[breathingPhase];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <HeartIcon className="h-8 w-8" />
              <div>
                <h2 className="text-2xl font-bold">Mindful Break</h2>
                <p className="opacity-90">You've been coding for {sessionDuration} minutes. Time to recharge!</p>
              </div>
            </div>
            <Button variant="secondary" onClick={onClose} className="text-emerald-600">
              Skip Break
            </Button>
          </div>
        </div>

        {/* Quote */}
        <div className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-b">
          <p className="text-center text-lg font-medium text-emerald-800 dark:text-emerald-200 italic">
            "{currentQuote}"
          </p>
        </div>

        {/* Break Type Selector */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { id: 'breathing', name: 'Breathing Exercise', icon: '🌬️' },
              { id: 'memory', name: 'Memory Game', icon: '🧠' },
              { id: 'focus', name: 'Focus Training', icon: '🎯' },
              { id: 'gratitude', name: 'Gratitude Moment', icon: '🙏' }
            ].map(breakType => (
              <button
                key={breakType.id}
                onClick={() => setCurrentBreak(breakType.id as BreakType)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentBreak === breakType.id
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/20'
                }`}
              >
                {breakType.icon} {breakType.name}
              </button>
            ))}
          </div>
        </div>

        {/* Break Content */}
        <div className="p-6">
          {currentBreak === 'breathing' && (
            <div className="text-center space-y-6">
              <div className="mb-4">
                <select
                  value={breathingPattern}
                  onChange={(e) => setBreathingPattern(e.target.value as keyof typeof BREATHING_PATTERNS)}
                  disabled={breathingActive}
                  className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-900 dark:text-white"
                >
                  {Object.entries(BREATHING_PATTERNS).map(([key, pattern]) => (
                    <option key={key} value={key}>{pattern.name}</option>
                  ))}
                </select>
              </div>

              <div className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-br ${getBreathingColor()} flex items-center justify-center transition-all duration-1000 ${breathingActive ? 'animate-pulse' : ''}`}>
                <div className="text-white text-2xl font-bold">
                  {breathingActive ? timeRemaining : '🌬️'}
                </div>
              </div>

              {breathingActive && (
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {getBreathingInstructions()}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Cycles completed: {completedCycles}
                  </p>
                </div>
              )}

              <div className="flex gap-3 justify-center">
                {!breathingActive ? (
                  <Button onClick={startBreathing} variant="primary" size="lg">
                    <PlayIcon className="h-5 w-5 mr-2" />
                    Start Breathing
                  </Button>
                ) : (
                  <Button onClick={stopBreathing} variant="secondary" size="lg">
                    <PauseIcon className="h-5 w-5 mr-2" />
                    Stop
                  </Button>
                )}
                
                {completedCycles >= 5 && (
                  <Button onClick={() => completeBreak(25)} variant="success" size="lg">
                    Complete (+25 XP)
                  </Button>
                )}
              </div>
            </div>
          )}

          {currentBreak === 'memory' && (
            <div className="text-center space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Memory Challenge - Level {memoryGame.level}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Watch the sequence, then repeat it by clicking the colors
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
                {[0, 1, 2, 3].map(index => (
                  <button
                    key={index}
                    onClick={() => handleMemoryInput(index)}
                    disabled={!memoryGame.isPlaying}
                    className={`w-24 h-24 rounded-lg transition-all duration-200 ${
                      index === 0 ? 'bg-red-500 hover:bg-red-600' :
                      index === 1 ? 'bg-blue-500 hover:bg-blue-600' :
                      index === 2 ? 'bg-green-500 hover:bg-green-600' :
                      'bg-yellow-500 hover:bg-yellow-600'
                    } ${!memoryGame.isPlaying ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
                  />
                ))}
              </div>

              <div className="flex gap-3 justify-center">
                {!memoryGame.isPlaying ? (
                  <Button onClick={startMemoryGame} variant="primary" size="lg">
                    Start Game
                  </Button>
                ) : null}
                
                {memoryGame.level > 3 && (
                  <Button onClick={() => completeBreak(30)} variant="success" size="lg">
                    Complete (+30 XP)
                  </Button>
                )}
              </div>
            </div>
          )}

          {currentBreak === 'focus' && (
            <div className="text-center space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Focus Training
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Click on the moving target to improve your focus. Score: {focusScore}
                </p>
              </div>

              <div
                className="relative w-full h-64 bg-gray-100 dark:bg-gray-700 rounded-lg cursor-crosshair"
                onClick={handleFocusClick}
              >
                {focusActive && (
                  <div
                    className="absolute w-8 h-8 bg-red-500 rounded-full transition-all duration-500 transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${focusTarget.x}%`,
                      top: `${focusTarget.y}%`
                    }}
                  />
                )}
                {!focusActive && (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400">
                    Click "Start" to begin
                  </div>
                )}
              </div>

              <div className="flex gap-3 justify-center">
                {!focusActive ? (
                  <Button onClick={startFocusGame} variant="primary" size="lg">
                    Start Training
                  </Button>
                ) : (
                  <Button onClick={() => setFocusActive(false)} variant="secondary" size="lg">
                    Stop
                  </Button>
                )}
                
                {focusScore >= 10 && (
                  <Button onClick={() => completeBreak(20)} variant="success" size="lg">
                    Complete (+20 XP)
                  </Button>
                )}
              </div>
            </div>
          )}

          {currentBreak === 'gratitude' && (
            <div className="text-center space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Gratitude Moment
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Take a moment to reflect on your coding journey
                </p>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-6 rounded-lg">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      Think about:
                    </h4>
                    <ul className="text-left space-y-2 text-gray-700 dark:text-gray-300">
                      <li>• A coding concept you recently mastered</li>
                      <li>• A challenging bug you successfully fixed</li>
                      <li>• Progress you've made since you started</li>
                      <li>• Someone who helped you learn</li>
                      <li>• A project you're proud of</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded">
                    <SparklesIcon className="h-12 w-12 text-yellow-500 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      "Every expert was once a beginner. Every pro was once an amateur. Every icon was once an unknown."
                    </p>
                  </div>
                </div>
              </div>

              <Button onClick={() => completeBreak(15)} variant="success" size="lg">
                I'm grateful (+15 XP)
              </Button>
            </div>
          )}
        </div>

        {/* Benefits Info */}
        <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-b-2xl">
          <div className="text-center">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              Why take breaks?
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Regular breaks improve focus, reduce stress, prevent burnout, and can even help you solve problems more creatively. 
              You'll get bonus XP for taking care of your mental health!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MindfulnessBreak;
