import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import Button from './Button';
import Card from './Card';
import BookOpenIcon from './icons/BookOpenIcon';
import LightbulbIcon from './icons/LightbulbIcon';
import HeartIcon from './icons/HeartIcon';
import TrendingUpIcon from './icons/TrendingUpIcon';
import CalendarIcon from './icons/CalendarIcon';

interface JournalEntry {
  id: string;
  date: string;
  content: string;
  mood: 'frustrated' | 'confused' | 'neutral' | 'satisfied' | 'excited';
  topics: string[];
  aiInsights?: string;
  sentiment: 'negative' | 'neutral' | 'positive';
  streakDay?: number;
}

interface ReflectionJournalProps {
  user: UserProfile;
  onUpdateUser: (data: Partial<UserProfile>) => void;
  isOpen: boolean;
  onClose: () => void;
}

const MOOD_OPTIONS = [
  { id: 'frustrated', emoji: '😤', label: 'Frustrated', color: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300' },
  { id: 'confused', emoji: '😕', label: 'Confused', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300' },
  { id: 'neutral', emoji: '😐', label: 'Neutral', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-300' },
  { id: 'satisfied', emoji: '😊', label: 'Satisfied', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300' },
  { id: 'excited', emoji: '🤩', label: 'Excited', color: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' }
];

const REFLECTION_PROMPTS = [
  "What coding concept did you learn or practice today?",
  "What challenges did you face and how did you overcome them?",
  "What are you most proud of from today's coding session?",
  "What would you like to improve or learn next?",
  "How do you feel about your progress as a developer?",
  "What debugging techniques worked well for you today?",
  "Which resources or tools were most helpful?",
  "What mistake taught you something valuable?",
  "How has your problem-solving approach evolved?",
  "What motivates you to keep coding?"
];

const MOTIVATIONAL_QUOTES = [
  "Every expert was once a beginner.",
  "Code is poetry written in logic.",
  "The best error message is the one that never shows up.",
  "Today's accomplishments were yesterday's impossibilities.",
  "Progress, not perfection.",
  "Every bug fixed makes you a better developer.",
  "Your coding journey is uniquely yours.",
  "Consistency beats perfection."
];

const ReflectionJournal: React.FC<ReflectionJournalProps> = ({
  user,
  onUpdateUser,
  isOpen,
  onClose
}) => {
  const [currentEntry, setCurrentEntry] = useState('');
  const [selectedMood, setSelectedMood] = useState<JournalEntry['mood']>('neutral');
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [weeklyInsights, setWeeklyInsights] = useState<string>('');
  const [viewMode, setViewMode] = useState<'write' | 'history' | 'insights'>('write');

  useEffect(() => {
    if (isOpen) {
      // Load saved journal entries (in real app, from database)
      const savedEntries = JSON.parse(localStorage.getItem(`journal_${user.id}`) || '[]');
      setJournalEntries(savedEntries);
      
      // Set a random prompt
      setCurrentPrompt(REFLECTION_PROMPTS[Math.floor(Math.random() * REFLECTION_PROMPTS.length)]);
      
      generateWeeklyInsights(savedEntries);
    }
  }, [isOpen, user.id]);

  const analyzeSentiment = (text: string): JournalEntry['sentiment'] => {
    // Simple sentiment analysis based on keywords
    const positiveWords = ['good', 'great', 'awesome', 'excellent', 'love', 'enjoy', 'excited', 'proud', 'successful', 'achieved', 'learned', 'progress', 'breakthrough', 'solved'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'frustrated', 'stuck', 'confused', 'difficult', 'problem', 'error', 'bug', 'failed', 'struggling'];
    
    const words = text.toLowerCase().split(/\s+/);
    let positiveScore = 0;
    let negativeScore = 0;
    
    words.forEach(word => {
      if (positiveWords.some(pw => word.includes(pw))) positiveScore++;
      if (negativeWords.some(nw => word.includes(nw))) negativeScore++;
    });
    
    if (positiveScore > negativeScore) return 'positive';
    if (negativeScore > positiveScore) return 'negative';
    return 'neutral';
  };

  const extractTopics = (text: string): string[] => {
    const programmingTopics = [
      'react', 'javascript', 'python', 'html', 'css', 'node', 'express', 'database', 
      'api', 'frontend', 'backend', 'debugging', 'testing', 'algorithm', 'function',
      'variable', 'array', 'object', 'loop', 'conditional', 'class', 'component'
    ];
    
    const words = text.toLowerCase().split(/\s+/);
    return programmingTopics.filter(topic => 
      words.some(word => word.includes(topic))
    );
  };

  const generateAIInsights = (entry: string, mood: string, sentiment: string): string => {
    // Simulate AI insights based on entry content
    const insights = [];
    
    if (sentiment === 'negative' && mood === 'frustrated') {
      insights.push("Remember that frustration is a natural part of learning. Consider taking a short break or trying a different approach.");
    }
    
    if (sentiment === 'positive') {
      insights.push("Your positive attitude is a great asset! This mindset will help you tackle more complex challenges.");
    }
    
    if (entry.toLowerCase().includes('debug') || entry.toLowerCase().includes('error')) {
      insights.push("Debugging skills are crucial for developers. Each bug you fix makes you better at problem-solving.");
    }
    
    if (entry.toLowerCase().includes('learn')) {
      insights.push("Continuous learning is key to growth as a developer. You're on the right track!");
    }
    
    if (mood === 'excited') {
      insights.push("Your enthusiasm is contagious! Channel this energy into exploring new concepts or helping others.");
    }
    
    // Add a random motivational quote
    insights.push(MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);
    
    return insights.join(' ');
  };

  const generateWeeklyInsights = (entries: JournalEntry[]) => {
    if (entries.length === 0) {
      setWeeklyInsights("Start journaling to get personalized insights about your coding journey!");
      return;
    }
    
    const recentEntries = entries.slice(-7); // Last 7 entries
    const moods = recentEntries.map(e => e.mood);
    const sentiments = recentEntries.map(e => e.sentiment);
    const topics = recentEntries.flatMap(e => e.topics);
    
    const moodCounts = moods.reduce((acc, mood) => {
      acc[mood] = (acc[mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const topicCounts = topics.reduce((acc, topic) => {
      acc[topic] = (acc[topic] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const dominantMood = Object.keys(moodCounts).reduce((a, b) => moodCounts[a] > moodCounts[b] ? a : b);
    const topTopics = Object.keys(topicCounts).slice(0, 3);
    
    const positiveRatio = sentiments.filter(s => s === 'positive').length / sentiments.length;
    
    let insights = `Based on your recent journal entries:\n\n`;
    insights += `🎯 You've been mostly ${dominantMood} during your coding sessions.\n`;
    insights += `📈 ${Math.round(positiveRatio * 100)}% of your entries show positive sentiment.\n`;
    
    if (topTopics.length > 0) {
      insights += `💡 You've been focusing on: ${topTopics.join(', ')}.\n`;
    }
    
    if (positiveRatio > 0.7) {
      insights += `\n🎉 You're maintaining a great positive attitude! Keep up the excellent work.`;
    } else if (positiveRatio < 0.4) {
      insights += `\n💪 Consider celebrating small wins and taking breaks when needed. Every challenge is a growth opportunity.`;
    }
    
    setWeeklyInsights(insights);
  };

  const handleSaveEntry = async () => {
    if (!currentEntry.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis delay
    setTimeout(() => {
      const sentiment = analyzeSentiment(currentEntry);
      const topics = extractTopics(currentEntry);
      const aiInsights = generateAIInsights(currentEntry, selectedMood, sentiment);
      
      const newEntry: JournalEntry = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString(),
        content: currentEntry,
        mood: selectedMood,
        topics,
        aiInsights,
        sentiment,
        streakDay: calculateCurrentStreak()
      };
      
      const updatedEntries = [...journalEntries, newEntry];
      setJournalEntries(updatedEntries);
      
      // Save to localStorage (in real app, save to database)
      localStorage.setItem(`journal_${user.id}`, JSON.stringify(updatedEntries));
      
      // Award XP for reflection
      const currentXP = user.xp || 0;
      onUpdateUser({
        xp: currentXP + 10,
        level: Math.floor((currentXP + 10) / 1000) + 1
      });
      
      // Reset form
      setCurrentEntry('');
      setSelectedMood('neutral');
      setIsAnalyzing(false);
      
      // Switch to insights view to show the AI feedback
      setViewMode('insights');
      
      // Regenerate weekly insights
      generateWeeklyInsights(updatedEntries);
    }, 2000);
  };

  const calculateCurrentStreak = () => {
    // Simplified streak calculation
    return Math.floor(Math.random() * 10) + 1;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <BookOpenIcon className="h-8 w-8" />
              <div>
                <h2 className="text-2xl font-bold">Reflection Journal</h2>
                <p className="opacity-90">Track your coding journey and gain insights</p>
              </div>
            </div>
            <Button variant="secondary" onClick={onClose} className="text-indigo-600">
              Close
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-2 justify-center">
            {[
              { id: 'write', name: 'Write', icon: '✍️' },
              { id: 'history', name: 'History', icon: '📚' },
              { id: 'insights', name: 'Insights', icon: '🧠' }
            ].map(mode => (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === mode.id
                    ? 'bg-indigo-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/20'
                }`}
              >
                {mode.icon} {mode.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {viewMode === 'write' && (
            <div className="space-y-6">
              {/* Prompt */}
              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-200 dark:border-indigo-700">
                <div className="flex items-center gap-2 mb-2">
                  <LightbulbIcon className="h-5 w-5 text-indigo-500" />
                  <h3 className="font-semibold text-indigo-800 dark:text-indigo-200">Reflection Prompt</h3>
                </div>
                <p className="text-indigo-700 dark:text-indigo-300">{currentPrompt}</p>
                <button
                  onClick={() => setCurrentPrompt(REFLECTION_PROMPTS[Math.floor(Math.random() * REFLECTION_PROMPTS.length)])}
                  className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline mt-2"
                >
                  Get another prompt
                </button>
              </div>

              {/* Mood Selection */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">How are you feeling about your coding session?</h3>
                <div className="flex flex-wrap gap-3">
                  {MOOD_OPTIONS.map(mood => (
                    <button
                      key={mood.id}
                      onClick={() => setSelectedMood(mood.id as any)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        selectedMood === mood.id
                          ? mood.color
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {mood.emoji} {mood.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Journal Entry */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Reflection
                </label>
                <textarea
                  value={currentEntry}
                  onChange={(e) => setCurrentEntry(e.target.value)}
                  placeholder="Share your thoughts about today's coding session... What did you learn? What challenges did you face? How do you feel about your progress?"
                  className="w-full h-48 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-4 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Action Button */}
              <div className="flex justify-center">
                <Button
                  onClick={handleSaveEntry}
                  disabled={!currentEntry.trim() || isAnalyzing}
                  variant="primary"
                  size="lg"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Analyzing & Saving...
                    </>
                  ) : (
                    'Save Reflection (+10 XP)'
                  )}
                </Button>
              </div>
            </div>
          )}

          {viewMode === 'history' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <CalendarIcon className="h-6 w-6 text-indigo-500" />
                Your Reflection History
              </h3>
              
              {journalEntries.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {journalEntries.reverse().map(entry => {
                    const moodOption = MOOD_OPTIONS.find(m => m.id === entry.mood);
                    return (
                      <div key={entry.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{entry.date}</span>
                          <div className="flex items-center gap-2">
                            {moodOption && (
                              <span className={`px-2 py-1 text-xs rounded-full ${moodOption.color}`}>
                                {moodOption.emoji} {moodOption.label}
                              </span>
                            )}
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              entry.sentiment === 'positive' ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' :
                              entry.sentiment === 'negative' ? 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300' :
                              'bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-300'
                            }`}>
                              {entry.sentiment}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-800 dark:text-gray-200 mb-3">{entry.content}</p>
                        {entry.topics.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {entry.topics.map(topic => (
                              <span key={topic} className="px-2 py-1 text-xs bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300 rounded-full">
                                {topic}
                              </span>
                            ))}
                          </div>
                        )}
                        {entry.aiInsights && (
                          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded border border-blue-200 dark:border-blue-700">
                            <p className="text-sm text-blue-800 dark:text-blue-200">
                              <strong>AI Insights:</strong> {entry.aiInsights}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpenIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">No journal entries yet.</p>
                  <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">Start reflecting to track your coding journey!</p>
                </div>
              )}
            </div>
          )}

          {viewMode === 'insights' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <TrendingUpIcon className="h-6 w-6 text-indigo-500" />
                Your Coding Journey Insights
              </h3>
              
              {/* Latest AI Insights */}
              {journalEntries.length > 0 && journalEntries[journalEntries.length - 1]?.aiInsights && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-lg border border-green-200 dark:border-green-700">
                  <div className="flex items-center gap-2 mb-3">
                    <LightbulbIcon className="h-6 w-6 text-green-600" />
                    <h4 className="font-bold text-green-800 dark:text-green-200">Latest Reflection Insights</h4>
                  </div>
                  <p className="text-green-700 dark:text-green-300">
                    {journalEntries[journalEntries.length - 1].aiInsights}
                  </p>
                </div>
              )}
              
              {/* Weekly Analysis */}
              {weeklyInsights && (
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-700">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUpIcon className="h-6 w-6 text-purple-600" />
                    <h4 className="font-bold text-purple-800 dark:text-purple-200">Weekly Analysis</h4>
                  </div>
                  <pre className="text-purple-700 dark:text-purple-300 whitespace-pre-wrap font-sans">
                    {weeklyInsights}
                  </pre>
                </div>
              )}
              
              {/* Encouragement */}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-6 rounded-lg border border-yellow-200 dark:border-yellow-700">
                <div className="flex items-center gap-2 mb-3">
                  <HeartIcon className="h-6 w-6 text-yellow-600" />
                  <h4 className="font-bold text-yellow-800 dark:text-yellow-200">Keep Going!</h4>
                </div>
                <p className="text-yellow-700 dark:text-yellow-300">
                  Self-reflection is a powerful tool for growth. By taking time to think about your learning process, 
                  you're developing metacognitive skills that will make you a better developer and problem-solver. 
                  Keep journaling to track your progress and celebrate your achievements!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReflectionJournal;
