import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import Button from './Button';
import Card from './Card';
import GiftIcon from './icons/GiftIcon';
import TrophyIcon from './icons/TrophyIcon';
import LightbulbIcon from './icons/LightbulbIcon';
import ClockIcon from './icons/ClockIcon';

interface LootItem {
  id: string;
  name: string;
  type: 'xp_boost' | 'hint_token' | 'theme' | 'avatar_item' | 'badge' | 'code_template' | 'streak_freeze';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon: string;
  description: string;
  value?: number;
  usesLeft?: number;
}

interface LootBox {
  id: string;
  type: 'assessment_completion' | 'daily_streak' | 'challenge_victory' | 'special_event';
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  contents: LootItem[];
  unlockedAt: Date;
  opened: boolean;
}

interface LootBoxSystemProps {
  user: UserProfile;
  onUpdateUser: (data: Partial<UserProfile>) => void;
  isOpen: boolean;
  onClose: () => void;
}

const LOOT_ITEMS_POOL: LootItem[] = [
  // Common items (60% drop rate)
  {
    id: 'xp_boost_small',
    name: '50 XP Boost',
    type: 'xp_boost',
    rarity: 'common',
    icon: '⚡',
    description: 'Instantly gain 50 XP',
    value: 50
  },
  {
    id: 'hint_token_1',
    name: 'Hint Token',
    type: 'hint_token',
    rarity: 'common',
    icon: '💡',
    description: 'Get a hint for any coding problem',
    usesLeft: 1
  },
  {
    id: 'streak_freeze_1',
    name: 'Streak Freeze',
    type: 'streak_freeze',
    rarity: 'common',
    icon: '❄️',
    description: 'Protect your streak for 1 day',
    usesLeft: 1
  },
  
  // Rare items (25% drop rate)
  {
    id: 'xp_boost_medium',
    name: '150 XP Boost',
    type: 'xp_boost',
    rarity: 'rare',
    icon: '⚡⚡',
    description: 'Instantly gain 150 XP',
    value: 150
  },
  {
    id: 'dark_theme',
    name: 'Midnight Coder Theme',
    type: 'theme',
    rarity: 'rare',
    icon: '🌙',
    description: 'Unlock the exclusive dark theme'
  },
  {
    id: 'hint_token_3',
    name: '3x Hint Tokens',
    type: 'hint_token',
    rarity: 'rare',
    icon: '💡💡💡',
    description: 'Get hints for any 3 coding problems',
    usesLeft: 3
  },
  {
    id: 'code_template_react',
    name: 'React Component Template',
    type: 'code_template',
    rarity: 'rare',
    icon: '⚛️',
    description: 'Pre-built React component template'
  },
  
  // Epic items (12% drop rate)
  {
    id: 'xp_boost_large',
    name: '500 XP Boost',
    type: 'xp_boost',
    rarity: 'epic',
    icon: '⚡⚡⚡',
    description: 'Instantly gain 500 XP',
    value: 500
  },
  {
    id: 'matrix_theme',
    name: 'Matrix Hacker Theme',
    type: 'theme',
    rarity: 'epic',
    icon: '💚',
    description: 'Enter the Matrix with this exclusive theme'
  },
  {
    id: 'avatar_crown',
    name: 'Crown of Code',
    type: 'avatar_item',
    rarity: 'epic',
    icon: '👑',
    description: 'Display your coding royalty'
  },
  {
    id: 'special_badge_debugger',
    name: 'Master Debugger Badge',
    type: 'badge',
    rarity: 'epic',
    icon: '🐛',
    description: 'Exclusive badge for loot box winners'
  },
  
  // Legendary items (3% drop rate)
  {
    id: 'xp_boost_mega',
    name: '1000 XP Boost',
    type: 'xp_boost',
    rarity: 'legendary',
    icon: '⚡⚡⚡⚡',
    description: 'Massive XP boost for the chosen one',
    value: 1000
  },
  {
    id: 'legendary_theme',
    name: 'Golden Code Theme',
    type: 'theme',
    rarity: 'legendary',
    icon: '✨',
    description: 'The most exclusive theme in existence'
  },
  {
    id: 'avatar_wings',
    name: 'Wings of Victory',
    type: 'avatar_item',
    rarity: 'legendary',
    icon: '🕊️',
    description: 'Majestic wings for legendary coders'
  },
  {
    id: 'ultimate_badge',
    name: 'Coding Deity Badge',
    type: 'badge',
    rarity: 'legendary',
    icon: '⭐',
    description: 'Ultra-rare badge of ultimate achievement'
  }
];

const RARITY_COLORS = {
  common: 'from-gray-400 to-gray-600',
  rare: 'from-blue-400 to-blue-600',
  epic: 'from-purple-400 to-purple-600',
  legendary: 'from-yellow-400 to-yellow-600'
};

const RARITY_GLOW = {
  common: 'shadow-gray-400/50',
  rare: 'shadow-blue-400/50',
  epic: 'shadow-purple-400/50',
  legendary: 'shadow-yellow-400/50'
};

const generateLootBox = (type: LootBox['type'], streak?: number): LootBox => {
  const boxConfigs = {
    assessment_completion: {
      name: 'Assessment Mastery Box',
      description: 'Rewards for completing assessments',
      icon: '📚'
    },
    daily_streak: {
      name: 'Streak Warrior Box',
      description: `Congratulations on your ${streak || 0} day streak!`,
      icon: '🔥'
    },
    challenge_victory: {
      name: 'Victory Spoils Box',
      description: 'Spoils of your coding victory',
      icon: '🏆'
    },
    special_event: {
      name: 'Special Event Box',
      description: 'Limited-time event rewards',
      icon: '🎉'
    }
  };

  const config = boxConfigs[type];
  const contents: LootItem[] = [];
  
  // Determine number of items based on performance/streak
  let itemCount = 1;
  if (type === 'daily_streak' && streak && streak >= 7) itemCount = 2;
  if (type === 'daily_streak' && streak && streak >= 30) itemCount = 3;
  if (type === 'special_event') itemCount = 2;

  // Generate loot with variable ratio reinforcement
  for (let i = 0; i < itemCount; i++) {
    const roll = Math.random() * 100;
    let selectedRarity: LootItem['rarity'];
    
    if (roll <= 3) selectedRarity = 'legendary';
    else if (roll <= 15) selectedRarity = 'epic';
    else if (roll <= 40) selectedRarity = 'rare';
    else selectedRarity = 'common';
    
    const availableItems = LOOT_ITEMS_POOL.filter(item => item.rarity === selectedRarity);
    const selectedItem = availableItems[Math.floor(Math.random() * availableItems.length)];
    
    if (selectedItem) {
      contents.push({ ...selectedItem, id: `${selectedItem.id}_${Date.now()}_${i}` });
    }
  }

  // Determine box rarity based on best item
  const bestItemRarity = contents.reduce((best, item) => {
    const rarityOrder = ['common', 'rare', 'epic', 'legendary'];
    return rarityOrder.indexOf(item.rarity) > rarityOrder.indexOf(best) ? item.rarity : best;
  }, 'common' as LootItem['rarity']);

  return {
    id: `lootbox_${Date.now()}`,
    type,
    name: config.name,
    description: config.description,
    icon: config.icon,
    rarity: bestItemRarity,
    contents,
    unlockedAt: new Date(),
    opened: false
  };
};

const LootBoxSystem: React.FC<LootBoxSystemProps> = ({ user, onUpdateUser, isOpen, onClose }) => {
  const [availableLootBoxes, setAvailableLootBoxes] = useState<LootBox[]>([]);
  const [openingBox, setOpeningBox] = useState<LootBox | null>(null);
  const [revealedItems, setRevealedItems] = useState<LootItem[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [inventory, setInventory] = useState<LootItem[]>([]);

  // Simulate getting loot boxes based on user activity
  useEffect(() => {
    if (isOpen) {
      const boxes: LootBox[] = [];
      
      // Check if user deserves boxes based on recent activity
      const currentStreak = calculateCurrentStreak();
      if (currentStreak > 0 && currentStreak % 3 === 0) {
        boxes.push(generateLootBox('daily_streak', currentStreak));
      }
      
      // Random chance for assessment completion box
      if (Math.random() < 0.3) {
        boxes.push(generateLootBox('assessment_completion'));
      }
      
      // Occasional special event box
      if (Math.random() < 0.1) {
        boxes.push(generateLootBox('special_event'));
      }

      setAvailableLootBoxes(boxes);
    }
  }, [isOpen]);

  const calculateCurrentStreak = () => {
    // Simplified streak calculation
    return Math.floor(Math.random() * 10) + 1;
  };

  const handleOpenBox = (box: LootBox) => {
    setOpeningBox(box);
    setIsAnimating(true);
    
    // Dramatic reveal animation
    setTimeout(() => {
      setRevealedItems(box.contents);
      setIsAnimating(false);
      
      // Apply rewards to user
      let totalXP = 0;
      const newInventoryItems: LootItem[] = [];
      
      box.contents.forEach(item => {
        if (item.type === 'xp_boost' && item.value) {
          totalXP += item.value;
        } else {
          newInventoryItems.push(item);
        }
      });
      
      if (totalXP > 0) {
        const currentXP = user.xp || 0;
        onUpdateUser({
          xp: currentXP + totalXP,
          level: Math.floor((currentXP + totalXP) / 1000) + 1
        });
      }
      
      setInventory(prev => [...prev, ...newInventoryItems]);
      
      // Mark box as opened
      setAvailableLootBoxes(prev => 
        prev.map(b => b.id === box.id ? { ...b, opened: true } : b)
      );
    }, 3000);
  };

  const handleCloseReveal = () => {
    setOpeningBox(null);
    setRevealedItems([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <GiftIcon className="h-8 w-8" />
              <div>
                <h2 className="text-2xl font-bold">Loot Box Collection</h2>
                <p className="opacity-90">Surprise rewards await!</p>
              </div>
            </div>
            <Button variant="secondary" onClick={onClose} className="text-purple-600">
              Close
            </Button>
          </div>
        </div>

        {/* Opening Animation */}
        {openingBox && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-60 flex items-center justify-center">
            <div className="text-center">
              {isAnimating ? (
                <div className="space-y-6">
                  <div className={`text-8xl animate-bounce ${RARITY_GLOW[openingBox.rarity]} rounded-full p-8`}>
                    {openingBox.icon}
                  </div>
                  <h3 className="text-3xl font-bold text-white">Opening {openingBox.name}...</h3>
                  <div className="flex justify-center space-x-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-2xl">
                  <div className="text-center mb-6">
                    cLightbulbIcon className="h-16 w-16 text-yellow-500 mx-auto mb-4" /e
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Congratulations!
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">You received:</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {revealedItems.map((item, index) => (
                      <div
                        key={index}
                        className={`bg-gradient-to-br ${RARITY_COLORS[item.rarity]} text-white p-4 rounded-lg shadow-lg ${RARITY_GLOW[item.rarity]} transform hover:scale-105 transition-transform animate-fade-in`}
                        style={{ animationDelay: `${index * 200}ms` }}
                      >
                        <div className="text-center">
                          <div className="text-4xl mb-2">{item.icon}</div>
                          <h4 className="font-bold">{item.name}</h4>
                          <p className="text-sm opacity-90">{item.description}</p>
                          {item.value && (
                            <p className="text-lg font-bold mt-2">+{item.value} XP</p>
                          )}
                          {item.usesLeft && (
                            <p className="text-sm mt-1">{item.usesLeft} uses</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-center">
                    <Button onClick={handleCloseReveal} variant="primary">
                      Awesome! Continue
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Available Loot Boxes */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <GiftIcon className="h-6 w-6 text-purple-500" />
              Available Loot Boxes
            </h3>
            
            {availableLootBoxes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableLootBoxes.map(box => (
                  <div
                    key={box.id}
                    className={`bg-gradient-to-br ${RARITY_COLORS[box.rarity]} text-white p-6 rounded-xl shadow-lg ${RARITY_GLOW[box.rarity]} ${
                      box.opened ? 'opacity-50' : 'hover:scale-105 cursor-pointer'
                    } transition-transform`}
                    onClick={() => !box.opened && handleOpenBox(box)}
                  >
                    <div className="text-center">
                      <div className="text-6xl mb-4">{box.icon}</div>
                      <h4 className="text-xl font-bold mb-2">{box.name}</h4>
                      <p className="text-sm opacity-90 mb-4">{box.description}</p>
                      <div className="flex justify-center items-center gap-2 text-sm">
                        <ClockIcon className="h-4 w-4" />
                        <span>Unlocked {box.unlockedAt.toLocaleDateString()}</span>
                      </div>
                      {box.opened ? (
                        <div className="mt-4 bg-black/20 rounded-full py-2 px-4 text-sm">
                          Already Opened
                        </div>
                      ) : (
                        <div className="mt-4 bg-white/20 rounded-full py-2 px-4 text-sm hover:bg-white/30">
                          Click to Open!
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <GiftIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 text-lg">No loot boxes available right now</p>
                <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
                  Complete assessments, maintain streaks, and participate in challenges to earn loot boxes!
                </p>
              </div>
            )}
          </div>

          {/* Inventory Preview */}
          {inventory.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                cTrophyIcon className="h-6 w-6 text-yellow-500" /e
                Your Inventory ({inventory.length} items)
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {inventory.slice(0, 8).map((item, index) => (
                  <div
                    key={index}
                    className={`bg-gradient-to-br ${RARITY_COLORS[item.rarity]} text-white p-3 rounded-lg text-center`}
                  >
                    <div className="text-2xl mb-1">{item.icon}</div>
                    <p className="text-xs font-semibold truncate">{item.name}</p>
                  </div>
                ))}
              </div>
              
              {inventory.length > 8 && (
                <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-3">
                  +{inventory.length - 8} more items...
                </p>
              )}
            </div>
          )}

          {/* Next Loot Box Info */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
            <h4 className="font-bold text-blue-800 dark:text-blue-200 mb-2">How to Earn More Loot Boxes</h4>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Complete assessments and quizzes</li>
              <li>• Maintain daily coding streaks (every 3 days)</li>
              <li>• Win coding challenges and hackathons</li>
              <li>• Participate in special events</li>
              <li>• Achieve high performance scores</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LootBoxSystem;
