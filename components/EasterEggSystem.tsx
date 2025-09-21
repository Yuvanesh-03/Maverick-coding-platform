import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';

interface EasterEgg {
  id: string;
  name: string;
  description: string;
  trigger: string;
  type: 'konami' | 'typing' | 'click' | 'sequence' | 'time';
  reward: {
    xp: number;
    item?: string;
    theme?: string;
    badge?: string;
  };
  discovered: boolean;
  hint: string;
}

interface EasterEggSystemProps {
  user: UserProfile;
  onUpdateUser: (data: Partial<UserProfile>) => void;
  onUnlockTheme?: (theme: string) => void;
}

const EASTER_EGGS: EasterEgg[] = [
  {
    id: 'konami_code',
    name: 'The Classic',
    description: 'You discovered the legendary Konami Code!',
    trigger: 'ArrowUp,ArrowUp,ArrowDown,ArrowDown,ArrowLeft,ArrowRight,ArrowLeft,ArrowRight,KeyB,KeyA',
    type: 'konami',
    reward: {
      xp: 500,
      theme: 'retro_gaming',
      badge: 'konami_master'
    },
    discovered: false,
    hint: 'An ancient sequence known to all gamers...'
  },
  {
    id: 'matrix_mode',
    name: 'Follow the White Rabbit',
    description: 'You\'ve found the entrance to the Matrix!',
    trigger: 'matrix',
    type: 'typing',
    reward: {
      xp: 300,
      theme: 'matrix_green',
    },
    discovered: false,
    hint: 'Type the name of a famous sci-fi movie about reality...'
  },
  {
    id: 'developer_tools',
    name: 'Inspector Gadget',
    description: 'A true developer never stops investigating!',
    trigger: 'F12',
    type: 'click',
    reward: {
      xp: 200,
      item: 'dev_tools_badge'
    },
    discovered: false,
    hint: 'Press the key that opens a developer\'s best friend...'
  },
  {
    id: 'midnight_coder',
    name: 'Night Owl',
    description: 'Coding at the witching hour? Respect!',
    trigger: '00:00',
    type: 'time',
    reward: {
      xp: 250,
      theme: 'midnight_dark',
      badge: 'night_owl'
    },
    discovered: false,
    hint: 'The most dedicated coders work when the clock strikes twelve...'
  },
  {
    id: 'hello_world',
    name: 'First Steps',
    description: 'Every coder\'s journey begins here!',
    trigger: 'hello world',
    type: 'typing',
    reward: {
      xp: 100,
      badge: 'hello_world_master'
    },
    discovered: false,
    hint: 'Type the first phrase every programmer learns...'
  },
  {
    id: 'click_logo',
    name: 'Logo Hunter',
    description: 'You clicked on the secret spot!',
    trigger: 'logo_click_10',
    type: 'click',
    reward: {
      xp: 150,
      item: 'logo_collector'
    },
    discovered: false,
    hint: 'Click the logo 10 times quickly...'
  },
  {
    id: 'coffee_break',
    name: 'Caffeinated Coder',
    description: 'Coffee is the fuel of programmers!',
    trigger: 'coffee',
    type: 'typing',
    reward: {
      xp: 100,
      item: 'coffee_mug'
    },
    discovered: false,
    hint: 'Type what keeps every developer awake...'
  },
  {
    id: '404_hunt',
    name: '404: Easter Egg Found',
    description: 'You found something that wasn\'t supposed to be found!',
    trigger: '404',
    type: 'typing',
    reward: {
      xp: 200,
      badge: 'error_hunter'
    },
    discovered: false,
    hint: 'Type the most famous error code...'
  }
];

const RETRO_THEMES = {
  'retro_gaming': {
    name: 'Retro Gaming',
    colors: {
      primary: '#ff6b35',
      secondary: '#f7931e',
      background: '#2c1810',
      text: '#ffeb3b'
    }
  },
  'matrix_green': {
    name: 'Matrix Code',
    colors: {
      primary: '#00ff41',
      secondary: '#008f11',
      background: '#0d1117',
      text: '#00ff41'
    }
  },
  'midnight_dark': {
    name: 'Midnight Coder',
    colors: {
      primary: '#6366f1',
      secondary: '#8b5cf6',
      background: '#0f0f23',
      text: '#e5e7eb'
    }
  }
};

const EasterEggSystem: React.FC<EasterEggSystemProps> = ({
  user,
  onUpdateUser,
  onUnlockTheme
}) => {
  const [discoveredEggs, setDiscoveredEggs] = useState<string[]>([]);
  const [currentSequence, setCurrentSequence] = useState<string[]>([]);
  const [typingBuffer, setTypingBuffer] = useState('');
  const [logoClickCount, setLogoClickCount] = useState(0);
  const [lastLogoClick, setLastLogoClick] = useState(0);
  const [showEasterEggNotification, setShowEasterEggNotification] = useState<EasterEgg | null>(null);

  useEffect(() => {
    // Load discovered eggs from localStorage
    const saved = localStorage.getItem(`easter_eggs_${user.id}`) || '[]';
    setDiscoveredEggs(JSON.parse(saved));
  }, [user.id]);

  useEffect(() => {
    // Keyboard event listeners
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle Konami code
      const newSequence = [...currentSequence, e.code].slice(-10);
      setCurrentSequence(newSequence);
      
      const konamiEgg = EASTER_EGGS.find(egg => egg.id === 'konami_code');
      if (konamiEgg && newSequence.join(',') === konamiEgg.trigger) {
        triggerEasterEgg(konamiEgg);
      }

      // Handle F12 (Developer Tools)
      if (e.code === 'F12') {
        const devToolsEgg = EASTER_EGGS.find(egg => egg.id === 'developer_tools');
        if (devToolsEgg && !discoveredEggs.includes(devToolsEgg.id)) {
          triggerEasterEgg(devToolsEgg);
        }
      }

      // Handle typing sequences
      if (e.key.length === 1) {
        const newTyping = (typingBuffer + e.key.toLowerCase()).slice(-20);
        setTypingBuffer(newTyping);
        
        EASTER_EGGS.filter(egg => egg.type === 'typing').forEach(egg => {
          if (newTyping.includes(egg.trigger.toLowerCase()) && !discoveredEggs.includes(egg.id)) {
            triggerEasterEgg(egg);
          }
        });
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentSequence, typingBuffer, discoveredEggs]);

  useEffect(() => {
    // Check for time-based easter eggs
    const checkTimeEggs = () => {
      const now = new Date();
      const timeString = now.toTimeString().slice(0, 5);
      
      const timeEgg = EASTER_EGGS.find(egg => 
        egg.type === 'time' && 
        egg.trigger === timeString && 
        !discoveredEggs.includes(egg.id)
      );
      
      if (timeEgg) {
        triggerEasterEgg(timeEgg);
      }
    };

    const interval = setInterval(checkTimeEggs, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [discoveredEggs]);

  const triggerEasterEgg = (egg: EasterEgg) => {
    if (discoveredEggs.includes(egg.id)) return;

    const newDiscovered = [...discoveredEggs, egg.id];
    setDiscoveredEggs(newDiscovered);
    localStorage.setItem(`easter_eggs_${user.id}`, JSON.stringify(newDiscovered));

    // Show notification
    setShowEasterEggNotification(egg);
    setTimeout(() => setShowEasterEggNotification(null), 5000);

    // Award rewards
    const currentXP = user.xp || 0;
    onUpdateUser({
      xp: currentXP + egg.reward.xp,
      level: Math.floor((currentXP + egg.reward.xp) / 1000) + 1
    });

    // Unlock theme if available
    if (egg.reward.theme && onUnlockTheme) {
      onUnlockTheme(egg.reward.theme);
    }

    // Play special effects
    createConfettiEffect();
    playEasterEggSound();
  };

  const handleLogoClick = () => {
    const now = Date.now();
    
    if (now - lastLogoClick < 500) { // Within 500ms
      setLogoClickCount(prev => prev + 1);
    } else {
      setLogoClickCount(1);
    }
    
    setLastLogoClick(now);

    if (logoClickCount >= 9) { // 10th click
      const logoEgg = EASTER_EGGS.find(egg => egg.id === 'click_logo');
      if (logoEgg && !discoveredEggs.includes(logoEgg.id)) {
        triggerEasterEgg(logoEgg);
        setLogoClickCount(0);
      }
    }
  };

  const createConfettiEffect = () => {
    // Create colorful confetti particles
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.style.position = 'fixed';
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.top = '-10px';
      confetti.style.width = '10px';
      confetti.style.height = '10px';
      confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 50%)`;
      confetti.style.pointerEvents = 'none';
      confetti.style.zIndex = '9999';
      confetti.style.borderRadius = '50%';
      
      document.body.appendChild(confetti);

      const animation = confetti.animate([
        { transform: 'translateY(-10px) rotate(0deg)', opacity: 1 },
        { transform: `translateY(${window.innerHeight + 20}px) rotate(360deg)`, opacity: 0 }
      ], {
        duration: Math.random() * 2000 + 1000,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      });

      animation.onfinish = () => confetti.remove();
    }
  };

  const playEasterEggSound = () => {
    // Create a simple beep sound using Web Audio API
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
      // Fallback: no sound if Web Audio API is not available
    }
  };

  // Inject hidden elements for easter eggs
  useEffect(() => {
    // Add invisible logo click area
    const logoClickArea = document.createElement('div');
    logoClickArea.style.position = 'fixed';
    logoClickArea.style.top = '10px';
    logoClickArea.style.left = '10px';
    logoClickArea.style.width = '50px';
    logoClickArea.style.height = '50px';
    logoClickArea.style.zIndex = '999';
    logoClickArea.style.cursor = 'pointer';
    logoClickArea.style.backgroundColor = 'transparent';
    logoClickArea.title = 'Something special might happen if you click enough...';
    logoClickArea.onclick = handleLogoClick;
    
    document.body.appendChild(logoClickArea);

    return () => {
      if (document.body.contains(logoClickArea)) {
        document.body.removeChild(logoClickArea);
      }
    };
  }, [logoClickCount, lastLogoClick]);

  return (
    <>
      {/* Easter Egg Discovery Notification */}
      {showEasterEggNotification && (
        <div className="fixed top-20 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl shadow-2xl z-[999] animate-bounce border-4 border-yellow-300">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🥚✨</div>
            <div>
              <h3 className="font-bold text-lg">Easter Egg Discovered!</h3>
              <p className="text-sm opacity-90">{showEasterEggNotification.name}</p>
              <p className="text-xs opacity-75">{showEasterEggNotification.description}</p>
              <p className="text-sm font-bold mt-2">+{showEasterEggNotification.reward.xp} XP!</p>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Developer Console Messages */}
      {typeof window !== 'undefined' && (() => {
        if (!discoveredEggs.includes('console_message')) {
          console.log(
            '%c🚀 Welcome, fellow developer! 🚀\n' +
            '%cYou found the secret console message!\n' +
            '%cTry typing some keywords or key combinations to discover more easter eggs!\n' +
            '%cHints: matrix, hello world, coffee, 404, or try the legendary Konami code...',
            'color: #ff6b35; font-size: 16px; font-weight: bold;',
            'color: #4f46e5; font-size: 14px;',
            'color: #059669; font-size: 12px;',
            'color: #dc2626; font-size: 10px; font-style: italic;'
          );
          
          // Mark console message as "discovered" to avoid spamming
          setDiscoveredEggs(prev => [...prev, 'console_message']);
        }
        return null;
      })()}

      {/* Easter Egg Status Panel (Debug - hidden in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 bg-black/80 text-white p-3 rounded text-xs max-w-xs">
          <h4 className="font-bold mb-2">Easter Egg Debug</h4>
          <p>Discovered: {discoveredEggs.length}/{EASTER_EGGS.length}</p>
          <p>Current sequence: {currentSequence.slice(-5).join(',')}</p>
          <p>Typing buffer: {typingBuffer.slice(-10)}</p>
          <p>Logo clicks: {logoClickCount}</p>
        </div>
      )}

      {/* Hidden Hints System */}
      <div className="hidden">
        {EASTER_EGGS.map(egg => (
          <div key={egg.id} data-hint={egg.hint} title={egg.hint} />
        ))}
      </div>
    </>
  );
};

export default EasterEggSystem;
