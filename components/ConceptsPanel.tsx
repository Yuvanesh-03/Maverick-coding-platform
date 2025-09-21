import React, { useState, useMemo } from 'react';
import { CONCEPT_LIST, ALL_TOPICS } from '../constants/concepts';
import { ConceptListItem } from '../types';
import LightbulbIcon from './icons/LightbulbIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';

interface ConceptsPanelProps {
  onSelectConcept: (conceptSlug: string) => void;
}

const DifficultyPill: React.FC<{ difficulty: 'Easy' | 'Medium' | 'Hard' }> = ({ difficulty }) => {
    const colors = {
        Easy: 'bg-[#48bb78]', // green
        Medium: 'bg-[#ecc94b]', // yellow
        Hard: 'bg-red-500',
    };
    return (
        <span className={`px-3 py-1 text-xs font-semibold rounded-full text-white ${colors[difficulty]}`}>
            {difficulty}
        </span>
    );
};

const TopicTag: React.FC<{ topic: string }> = ({ topic }) => (
    <span className="bg-[#38b2ac] text-white px-3 py-1 text-xs font-medium rounded-full animate-fade-in-stagger" style={{ animationDelay: '100ms' }}>
        {topic}
    </span>
);


const ConceptsPanel: React.FC<ConceptsPanelProps> = ({ onSelectConcept }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');

  const filteredConcepts = useMemo(() => {
    return CONCEPT_LIST.filter(concept => {
      const matchesSearch = concept.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDifficulty = selectedDifficulty === 'All' || concept.difficulty === selectedDifficulty;
      const matchesTopic = selectedTopic === 'All' || concept.topics.includes(selectedTopic);
      return matchesSearch && matchesDifficulty && matchesTopic;
    });
  }, [searchTerm, selectedDifficulty, selectedTopic]);

  return (
    <div className="space-y-6">
      <h2 className="font-sans text-lg font-semibold text-[#2d3748] dark:text-gray-100">Select a Concept to Practice</h2>
      
      {/* Filter Section */}
      <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-[#e2e8f0] dark:border-gray-700 shadow-sm flex flex-wrap gap-4 items-center">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow bg-[#f7fafc] dark:bg-gray-700 border border-[#e2e8f0] dark:border-gray-600 rounded-lg px-4 py-2 text-sm text-gray-800 dark:text-gray-200 placeholder:text-[#718096] focus:outline-none focus:ring-2 focus:ring-[#38b2ac] min-w-[200px]"
        />
        <div className="relative">
          <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value as any)}
              className="appearance-none bg-[#38b2ac] text-white rounded-full px-5 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#38b2ac] pr-10 cursor-pointer"
          >
            <option value="All" className="bg-white text-black">All Difficulties</option>
            <option value="Easy" className="bg-white text-black">Easy</option>
            <option value="Medium" className="bg-white text-black">Medium</option>
            <option value="Hard" className="bg-white text-black">Hard</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-white">
            <ChevronDownIcon className="h-4 w-4" />
          </div>
        </div>
        <div className="relative">
          <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="appearance-none bg-[#38b2ac] text-white rounded-full px-5 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#38b2ac] pr-10 cursor-pointer"
          >
            <option value="All" className="bg-white text-black">All Topics</option>
            {ALL_TOPICS.map(topic => <option key={topic} value={topic} className="bg-white text-black">{topic}</option>)}
          </select>
           <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-white">
            <ChevronDownIcon className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Concepts List */}
      <div className="space-y-3">
        {filteredConcepts.map((concept, index) => (
          <button 
            key={concept.id}
            onClick={() => onSelectConcept(concept.id)}
            className="w-full text-left bg-white dark:bg-gray-800 rounded-[12px] border border-[#e2e8f0] dark:border-gray-700 shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-4 flex items-center justify-between gap-4 cursor-pointer transition-all duration-300 hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] hover:scale-[1.02] hover:bg-[#f7fafc] dark:hover:bg-gray-700/50 relative group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4299e6] animate-fade-in-stagger"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="absolute left-0 top-0 h-full w-1 bg-transparent group-hover:bg-[#4299e6] transition-colors duration-300 rounded-l-[12px]"></div>
            <div className="flex-grow pl-2">
                <h3 className="font-sans font-medium text-lg text-[#2d3748] dark:text-gray-100">{concept.title}</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                    {concept.topics.slice(0, 3).map(topic => <TopicTag key={topic} topic={topic} />)}
                </div>
            </div>
            <div className="flex-shrink-0">
                <DifficultyPill difficulty={concept.difficulty} />
            </div>
          </button>
        ))}
        {filteredConcepts.length === 0 && (
            <div className="text-center py-12 text-gray-500">
                No concepts match your filters.
            </div>
        )}
      </div>
    </div>
  );
};

export default ConceptsPanel;