import React, { useState, useEffect } from 'react';
import { UserProfile, ProgrammingQuestion } from '../types';
import Button from './Button';
import Card from './Card';
import BookOpenIcon from './icons/BookOpenIcon';
import StarIcon from './icons/StarIcon';
import CodeIcon from './icons/CodeIcon';
import ArrowRightIcon from './icons/ArrowRightIcon';
import CheckIcon from './icons/CheckIcon';

interface StoryChapter {
  id: string;
  title: string;
  narrative: string;
  character: {
    name: string;
    avatar: string;
    dialogue: string;
  };
  quest: {
    description: string;
    problem: ProgrammingQuestion;
  };
  choices?: {
    id: string;
    text: string;
    consequence: string;
    nextChapterId: string;
  }[];
  completed: boolean;
  xpReward: number;
  itemReward?: {
    name: string;
    description: string;
    icon: string;
  };
}

interface StoryModeProps {
  user: UserProfile;
  onUpdateUser: (data: Partial<UserProfile>) => void;
  onExit: () => void;
}

const STORY_DATA: { [key: string]: StoryChapter } = {
  'prologue': {
    id: 'prologue',
    title: 'The Digital Realm Awakens',
    narrative: 'You find yourself standing at the gates of CodeLand, a mystical digital realm where algorithms come to life and data structures hold ancient secrets. The air crackles with the energy of a thousand programs running simultaneously.',
    character: {
      name: 'Sage Algorithmia',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sage',
      dialogue: 'Welcome, young coder! I am Sage Algorithmia, guardian of this realm. The balance between order and chaos has been disrupted. The Great Bug has emerged from the depths of Legacy Code Mountain, corrupting programs across the land!'
    },
    quest: {
      description: 'Prove your worth by solving this fundamental challenge. Only those who master the basics can hope to face greater evils.',
      problem: {
        type: 'PROGRAMMING' as any,
        questionText: 'The Array Restoration Quest',
        description: 'The village\'s data scrolls have been corrupted! Help restore order by finding the two numbers in this array that sum to the target value.',
        constraints: ['Array length: 2-1000', 'Numbers can be negative', 'Only one valid solution exists'],
        testCases: [
          { input: 'array = [2, 7, 11, 15], target = 9', expectedOutput: '[0, 1]', hidden: false },
          { input: 'array = [3, 2, 4], target = 6', expectedOutput: '[1, 2]', hidden: false }
        ],
        starterCode: 'function twoSum(nums, target) {\n    // Your quest begins here...\n    \n}'
      }
    },
    choices: [
      {
        id: 'help-village',
        text: 'Accept the quest to help the village',
        consequence: 'The villagers cheer as you step forward courageously!',
        nextChapterId: 'chapter-1'
      },
      {
        id: 'ask-questions',
        text: 'Ask more about the Great Bug',
        consequence: 'Sage Algorithmia reveals ancient secrets...',
        nextChapterId: 'chapter-1-alt'
      }
    ],
    completed: false,
    xpReward: 200,
    itemReward: {
      name: 'Novice Coding Staff',
      description: 'A simple but reliable tool for basic spells',
      icon: '🔮'
    }
  },
  'chapter-1': {
    id: 'chapter-1',
    title: 'The Forest of Recursive Trees',
    narrative: 'Your heroic deed in the village has opened new paths. You now stand before the mystical Forest of Recursive Trees, where each tree contains infinite copies of itself. The forest whispers with the sound of function calls.',
    character: {
      name: 'Elder Recursion',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=elder',
      dialogue: 'Ah, a brave soul enters my domain! I am Elder Recursion, keeper of the self-calling mysteries. To pass through my forest, you must understand the power of functions that call upon themselves.'
    },
    quest: {
      description: 'Navigate the recursive maze by implementing a function that can traverse the tree structure.',
      problem: {
        type: 'PROGRAMMING' as any,
        questionText: 'The Recursive Tree Traversal',
        description: 'Each tree node contains a value and may have left and right children. Calculate the maximum depth of the binary tree to find the exit path.',
        constraints: ['Tree nodes: 0-10000', 'Node values: -100 to 100'],
        testCases: [
          { input: 'root = [3,9,20,null,null,15,7]', expectedOutput: '3', hidden: false },
          { input: 'root = [1,null,2]', expectedOutput: '2', hidden: false }
        ],
        starterCode: 'function maxDepth(root) {\n    // The trees call to you...\n    \n}'
      }
    },
    choices: [
      {
        id: 'deep-forest',
        text: 'Venture deeper into the recursive depths',
        consequence: 'You discover a hidden clearing with ancient algorithms...',
        nextChapterId: 'chapter-2'
      },
      {
        id: 'ask-elder',
        text: 'Seek wisdom from Elder Recursion',
        consequence: 'The elder shares the secrets of tail recursion...',
        nextChapterId: 'chapter-2'
      }
    ],
    completed: false,
    xpReward: 300,
    itemReward: {
      name: 'Recursive Compass',
      description: 'Points toward the base case',
      icon: '🧭'
    }
  },
  'chapter-1-alt': {
    id: 'chapter-1-alt',
    title: 'The Archive of Ancient Bugs',
    narrative: 'Following your curiosity, Sage Algorithmia leads you to the Archive of Ancient Bugs - a vast library where the history of programming errors is preserved. The shelves stretch infinitely, filled with scrolls of broken code.',
    character: {
      name: 'Librarian Debuggia',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=librarian',
      dialogue: 'So you wish to understand the Great Bug? Wise choice. I am Librarian Debuggia. Every bug that ever existed is catalogued here. But to access this knowledge, you must first prove you can squash the smaller ones.'
    },
    quest: {
      description: 'Debug this corrupted function to unlock the secrets of the archive.',
      problem: {
        type: 'PROGRAMMING' as any,
        questionText: 'The Great Debug Challenge',
        description: 'This function should return the reversed string, but it contains several bugs. Find and fix them all!',
        constraints: ['String length: 1-1000', 'Only ASCII characters'],
        testCases: [
          { input: '"hello"', expectedOutput: '"olleh"', hidden: false },
          { input: '"world"', expectedOutput: '"dlrow"', hidden: false }
        ],
        starterCode: 'function reverseString(s) {\n    let result = "";\n    for (let i = s.length; i >= 0; i--) {\n        result += s[i];\n    }\n    return result;\n}'
      }
    },
    completed: false,
    xpReward: 250,
    itemReward: {
      name: 'Magnifying Glass of Truth',
      description: 'Reveals hidden bugs in code',
      icon: '🔍'
    }
  }
};

const StoryModeView: React.FC<StoryModeProps> = ({ user, onUpdateUser, onExit }) => {
  const [currentChapter, setCurrentChapter] = useState<StoryChapter>(STORY_DATA['prologue']);
  const [userCode, setUserCode] = useState(currentChapter.quest.problem.starterCode || '');
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [isQuestCompleted, setIsQuestCompleted] = useState(false);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [inventory, setInventory] = useState<any[]>([]);

  useEffect(() => {
    setUserCode(currentChapter.quest.problem.starterCode || '');
    setIsQuestCompleted(false);
    setSelectedChoice(null);
    setOutput('');
  }, [currentChapter]);

  const handleRunCode = async () => {
    setIsRunning(true);
    // Simulate code execution
    setTimeout(() => {
      setOutput('Test cases passed! ✅\n\nYou have successfully completed the quest!');
      setIsQuestCompleted(true);
      setIsRunning(false);
      
      // Award XP and items
      if (currentChapter.itemReward) {
        setInventory(prev => [...prev, currentChapter.itemReward]);
      }
      
      // Update user progress
      const currentXP = user.xp || 0;
      onUpdateUser({
        xp: currentXP + currentChapter.xpReward,
        level: Math.floor((currentXP + currentChapter.xpReward) / 1000) + 1
      });
    }, 2000);
  };

  const handleMakeChoice = (choice: any) => {
    setSelectedChoice(choice.id);
    if (STORY_DATA[choice.nextChapterId]) {
      setTimeout(() => {
        setCurrentChapter(STORY_DATA[choice.nextChapterId]);
      }, 2000);
    }
  };

  const StoryPanel = () => (
    <Card title={currentChapter.title} icon={<BookOpenIcon />}>
      <div className="space-y-6">
        {/* Narrative */}
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 p-6 rounded-lg">
          <p className="text-gray-800 dark:text-gray-200 leading-relaxed italic">
            {currentChapter.narrative}
          </p>
        </div>

        {/* Character Dialogue */}
        <div className="bg-blue-50 dark:bg-blue-900/50 p-4 rounded-lg border-l-4 border-blue-500">
          <div className="flex items-start gap-4">
            <img
              src={currentChapter.character.avatar}
              alt={currentChapter.character.name}
              className="w-12 h-12 rounded-full border-2 border-blue-500"
            />
            <div>
              <h4 className="font-bold text-blue-800 dark:text-blue-200">
                {currentChapter.character.name}
              </h4>
              <p className="text-blue-700 dark:text-blue-300 mt-2">
                "{currentChapter.character.dialogue}"
              </p>
            </div>
          </div>
        </div>

        {/* Quest Description */}
        <div className="bg-yellow-50 dark:bg-yellow-900/50 p-4 rounded-lg border border-yellow-200 dark:border-yellow-700">
          <div className="flex items-center gap-2 mb-2">
            <StarIcon className="h-5 w-5 text-yellow-500" />
            <h4 className="font-bold text-yellow-800 dark:text-yellow-200">Quest Objective</h4>
          </div>
          <p className="text-yellow-700 dark:text-yellow-300">{currentChapter.quest.description}</p>
        </div>

        {/* Choices (only show if quest is completed) */}
        {isQuestCompleted && currentChapter.choices && (
          <div className="space-y-3">
            <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <ArrowRightIcon className="h-5 w-5" />
              Choose Your Path
            </h4>
            {currentChapter.choices.map(choice => (
              <button
                key={choice.id}
                onClick={() => handleMakeChoice(choice)}
                disabled={!!selectedChoice}
                className={`w-full text-left p-4 rounded-lg transition-colors ${
                  selectedChoice === choice.id
                    ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 border border-green-300'
                    : selectedChoice
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                }`}
              >
                <p className="font-semibold">{choice.text}</p>
                {selectedChoice === choice.id && (
                  <p className="text-sm mt-2 italic">{choice.consequence}</p>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </Card>
  );

  const CodeQuestPanel = () => (
    <Card title={currentChapter.quest.problem.questionText} icon={<CodeIcon />}>
      <div className="space-y-4">
        {/* Problem Description */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            {currentChapter.quest.problem.description}
          </p>
          
          <div className="space-y-3">
            <div>
              <h5 className="font-semibold text-gray-900 dark:text-white mb-2">Test Cases:</h5>
              {currentChapter.quest.problem.testCases.map((test, idx) => (
                <div key={idx} className="bg-white dark:bg-gray-800 p-3 rounded text-sm border">
                  <p><strong>Input:</strong> {test.input}</p>
                  <p><strong>Expected:</strong> {test.expectedOutput}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Code Editor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Your Solution
          </label>
          <textarea
            value={userCode}
            onChange={(e) => setUserCode(e.target.value)}
            className="w-full h-64 bg-gray-900 text-green-400 font-mono text-sm p-4 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
            placeholder="// Your solution here..."
          />
        </div>

        {/* Output */}
        {output && (
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h5 className="font-semibold text-gray-900 dark:text-white mb-2">Output:</h5>
            <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
              {output}
            </pre>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={handleRunCode}
            disabled={isRunning || isQuestCompleted}
            variant="primary"
          >
            {isRunning ? 'Casting Spell...' : isQuestCompleted ? 'Quest Complete!' : 'Cast Code Spell'}
          </Button>
          {isQuestCompleted && (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <CheckIcon className="h-5 w-5" />
              <span className="font-semibold">+{currentChapter.xpReward} XP</span>
              {currentChapter.itemReward && (
                <span className="text-sm">• {currentChapter.itemReward.icon} {currentChapter.itemReward.name}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );

  const InventoryPanel = () => (
    <Card title="Adventurer's Inventory" icon={<StarIcon />}>
      <div className="space-y-3">
        {inventory.length > 0 ? (
          inventory.map((item, idx) => (
            <div key={idx} className="bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/50 dark:to-orange-900/50 p-3 rounded-lg border border-yellow-200 dark:border-yellow-700">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <h4 className="font-bold text-yellow-800 dark:text-yellow-200">{item.name}</h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">{item.description}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">
            Complete quests to collect magical items!
          </p>
        )}
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 mb-6 border border-white/20">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">Story Mode: The Coding Adventure</h1>
              <p className="text-purple-200">Level {user.level || 1} • {user.xp || 0} XP</p>
            </div>
            <Button variant="danger" onClick={onExit}>
              Exit Adventure
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Story Panel */}
          <div className="lg:col-span-2">
            <StoryPanel />
          </div>

          {/* Inventory */}
          <div>
            <InventoryPanel />
          </div>

          {/* Code Quest Panel */}
          <div className="lg:col-span-3">
            <CodeQuestPanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryModeView;
