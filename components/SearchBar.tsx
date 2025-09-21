import React, { useState, useRef, useEffect } from 'react';
import { UserProfile } from '../types';
import MagnifyingGlassIcon from './icons/MagnifyingGlassIcon';
import CodeIcon from './icons/CodeIcon';
import TerminalIcon from './icons/TerminalIcon';
import StarIcon from './icons/StarIcon';
import BookOpenIcon from './icons/BookOpenIcon';
import ClockIcon from './icons/ClockIcon';

type AppView = 'general' | 'learning_path' | 'assessment' | 'hackathons' | 'playground' | 'admin' | 'profile' | 'leaderboard' | 'analytics' | 'discussions' | 'reports' | 'story_mode' | 'events';

interface SearchResult {
  id: string;
  type: 'concept' | 'challenge' | 'user' | 'tutorial' | 'discussion' | 'command';
  title: string;
  description: string;
  category?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  icon: React.ReactNode;
  action: () => void;
}

interface SearchBarProps {
  user: UserProfile;
  onNavigate: (view: AppView) => void;
  onSelectConcept?: (slug: string) => void;
  onStartChallenge?: (language: string) => void;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  user, 
  onNavigate, 
  onSelectConcept, 
  onStartChallenge,
  className = "" 
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sample data - in a real app, this would come from your backend
  const searchData = [
    // Concepts/Problems
    { type: 'concept', title: 'Two Sum', description: 'Find two numbers that add up to a target', category: 'Arrays', difficulty: 'Easy' as const, slug: 'two-sum' },
    { type: 'concept', title: 'Valid Parentheses', description: 'Check if parentheses are properly matched', category: 'Stack', difficulty: 'Easy' as const, slug: 'valid-parentheses' },
    { type: 'concept', title: 'Binary Tree Traversal', description: 'Implement tree traversal algorithms', category: 'Trees', difficulty: 'Medium' as const, slug: 'binary-tree-traversal' },
    { type: 'concept', title: 'Dynamic Programming', description: 'Solve problems using DP techniques', category: 'Algorithms', difficulty: 'Hard' as const, slug: 'dynamic-programming' },
    
    // Challenges
    { type: 'challenge', title: 'JavaScript Challenge', description: 'Test your JavaScript skills', category: 'Programming', difficulty: 'Medium' as const, slug: 'javascript' },
    { type: 'challenge', title: 'Python Challenge', description: 'Python programming challenge', category: 'Programming', difficulty: 'Medium' as const, slug: 'python' },
    { type: 'challenge', title: 'React Challenge', description: 'Build React components', category: 'Frontend', difficulty: 'Hard' as const, slug: 'react' },
    
    // Tutorials
    { type: 'tutorial', title: 'Getting Started with Algorithms', description: 'Learn the basics of algorithms', category: 'Learning' },
    { type: 'tutorial', title: 'Data Structures Guide', description: 'Complete guide to data structures', category: 'Learning' },
    { type: 'tutorial', title: 'System Design Basics', description: 'Introduction to system design', category: 'Learning' },
    
    // Commands/Quick Actions
    { type: 'command', title: 'Go to Dashboard', description: 'Navigate to your dashboard', category: 'Navigation' },
    { type: 'command', title: 'View Profile', description: 'Open your profile page', category: 'Navigation' },
    { type: 'command', title: 'Leaderboard', description: 'Check the leaderboard', category: 'Navigation' },
    { type: 'command', title: 'Analytics', description: 'View your progress analytics', category: 'Navigation' },
    
    // Discussions
    { type: 'discussion', title: 'Best practices for coding interviews', description: 'Tips and strategies discussion', category: 'Discussion' },
    { type: 'discussion', title: 'Algorithm optimization techniques', description: 'Performance improvement discussion', category: 'Discussion' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim()) {
      const filteredResults = searchData
        .filter(item => 
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()) ||
          item.category?.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 8)
        .map(item => ({
          id: `${item.type}-${item.title}`,
          type: item.type as SearchResult['type'],
          title: item.title,
          description: item.description,
          category: item.category,
          difficulty: item.difficulty,
          icon: getIconForType(item.type as SearchResult['type']),
          action: () => handleResultClick(item)
        }));
      
      setResults(filteredResults);
      setSelectedIndex(-1);
    } else {
      setResults([]);
      setSelectedIndex(-1);
    }
  }, [query]);

  const getIconForType = (type: SearchResult['type']) => {
    switch (type) {
      case 'concept':
        return <CodeIcon className="w-4 h-4" />;
      case 'challenge':
        return <TerminalIcon className="w-4 h-4" />;
      case 'tutorial':
        return <BookOpenIcon className="w-4 h-4" />;
      case 'discussion':
        return <StarIcon className="w-4 h-4" />;
      case 'user':
        return <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-400 to-pink-400" />;
      case 'command':
        return <ClockIcon className="w-4 h-4" />;
      default:
        return <MagnifyingGlassIcon className="w-4 h-4" />;
    }
  };

  const handleResultClick = (item: any) => {
    switch (item.type) {
      case 'concept':
        if (onSelectConcept) {
          onSelectConcept(item.slug);
        }
        break;
      case 'challenge':
        if (onStartChallenge) {
          onStartChallenge(item.slug);
        }
        break;
      case 'command':
        if (item.title.includes('Dashboard')) onNavigate('general');
        else if (item.title.includes('Profile')) onNavigate('profile');
        else if (item.title.includes('Leaderboard')) onNavigate('leaderboard');
        else if (item.title.includes('Analytics')) onNavigate('analytics');
        break;
      case 'tutorial':
        onNavigate('learning_path');
        break;
      case 'discussion':
        onNavigate('discussions');
        break;
    }
    
    setQuery('');
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : results.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          results[selectedIndex].action();
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400';
      case 'Medium': return 'text-yellow-400';
      case 'Hard': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div ref={searchRef} className={`relative w-full max-w-md ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-slate-400 dark:text-slate-500" />
        </div>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search challenges, modules, users..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => query && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="w-full h-11 performance-container bg-white/10 dark:bg-slate-800/50 backdrop-blur-md border border-slate-200/30 dark:border-slate-600/30 rounded-full pl-11 pr-4 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200"
        />
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-12 left-0 right-0 z-50 performance-container bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 rounded-xl shadow-2xl max-h-96 overflow-y-auto">
          <div className="p-2">
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400 px-3 py-2 uppercase tracking-wide">
              Search Results ({results.length})
            </div>
            {results.map((result, index) => (
              <button
                key={result.id}
                onClick={result.action}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 text-left ${
                  index === selectedIndex 
                    ? 'bg-purple-500/20 dark:bg-purple-500/30 border border-purple-500/50' 
                    : 'hover:bg-slate-100/80 dark:hover:bg-slate-700/50'
                }`}
              >
                <div className={`flex-shrink-0 p-2 rounded-lg ${
                  result.type === 'concept' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                  result.type === 'challenge' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                  result.type === 'tutorial' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' :
                  result.type === 'discussion' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' :
                  result.type === 'command' ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' :
                  'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}>
                  {result.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-slate-900 dark:text-slate-100 truncate">
                      {result.title}
                    </h3>
                    {result.difficulty && (
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${getDifficultyColor(result.difficulty)}`}>
                        {result.difficulty}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                    {result.description}
                  </p>
                  {result.category && (
                    <span className="text-xs text-slate-500 dark:text-slate-500 font-medium">
                      {result.category}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
          
          <div className="border-t border-slate-200 dark:border-slate-700 p-3">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Use ↑ ↓ to navigate, Enter to select</span>
              <span>ESC to close</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
