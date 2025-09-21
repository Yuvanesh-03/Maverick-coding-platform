import React, { useState, useEffect, useMemo } from 'react';
import { DiscussionThread, UserProfile, DiscussionCategory, DiscussionDifficulty, DiscussionStatus, DiscussionLanguage } from '../../types';
import { getThreads, createThread, GetThreadsFilters, deleteThread, voteOnThread } from '../../services/discussionService';
import Card from '../Card';
import Button from '../Button';
import Modal from '../Modal';
import ChatBubbleIcon from '../icons/ChatBubbleIcon';
import PlusIcon from '../icons/PlusIcon';
import TrashIcon from '../icons/TrashIcon';
import ArrowUpIcon from '../icons/ArrowUpIcon';
import ArrowDownIcon from '../icons/ArrowDownIcon';
import CheckIcon from '../icons/CheckIcon';
import ExclamationCircleIcon from '../icons/ExclamationCircleIcon';
import ChevronDownIcon from '../icons/ChevronDownIcon';

interface DiscussionsPageProps {
  onSelectThread: (threadId: string, scope: GetThreadsFilters['scope']) => void;
  user: { profile: UserProfile, role: 'user' | 'admin' };
}

const programmingLanguages: readonly ('All Languages' | DiscussionLanguage)[] = ["All Languages", "JavaScript", "Python", "Java", "C++", "C#", "TypeScript", "Go", "Rust", "Swift", "Kotlin", "PHP", "Ruby"];
const categories: readonly ('All Categories' | DiscussionCategory)[] = ['All Categories', 'Questions', 'Discussions', 'Help', 'Tutorials', 'General'];
const difficulties: readonly ('All Levels' | DiscussionDifficulty)[] = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];
const statuses: readonly ('All Posts' | DiscussionStatus)[] = ['All Posts', 'Unsolved', 'Solved'];
const sortOptions = ['Newest', 'Top', 'Most Replies'] as const;
const scopeOptions = ['All Threads', 'My Threads', 'My Replies'] as const;

const ThreadItem: React.FC<{ thread: DiscussionThread; onClick: () => void; isAdmin: boolean; onDelete: () => void; currentUser: UserProfile; onVote: (voteType: 'up' | 'down') => void; index: number; }> = ({ thread, onClick, isAdmin, onDelete, currentUser, onVote, index }) => {
    const userVote = thread.upvotedBy.includes(currentUser.id) ? 'up' : thread.downvotedBy.includes(currentUser.id) ? 'down' : null;
    const netVotes = thread.upvotes - thread.downvotes;

    const StatusIndicator: React.FC<{ status: DiscussionStatus }> = ({ status }) => {
        const isSolved = status === 'Solved';
        return (
            <div className={`flex items-center gap-1.5 text-xs font-bold py-1 px-2.5 rounded-full ${isSolved ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300' : 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300'}`}>
                {isSolved ? <CheckIcon className="h-4 w-4" /> : <ExclamationCircleIcon className="h-4 w-4" />}
                {status}
            </div>
        );
    };

    return (
        <div 
            className="bg-white dark:bg-gray-800/50 rounded-[12px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-300 border border-[#e2e8f0] dark:border-gray-700/50 flex gap-4 p-4 group relative animate-slide-in-from-top"
            style={{ animationDelay: `${index * 50}ms`, opacity: 0 }}
        >
            {/* Vote Controls */}
            <div className="flex flex-col items-center justify-start pt-1 flex-shrink-0">
                <button
                    onClick={(e) => { e.stopPropagation(); onVote('up'); }}
                    className={`p-1.5 rounded-full transition-colors ${userVote === 'up' ? 'bg-blue-100 text-[#4299e6]' : 'text-[#4299e6] hover:bg-blue-100/50'}`}
                    aria-label="Upvote"
                >
                    <ArrowUpIcon className="h-5 w-5" />
                </button>
                <span className="font-bold text-lg my-1 text-gray-800 dark:text-gray-200">{netVotes}</span>
                <button
                    onClick={(e) => { e.stopPropagation(); onVote('down'); }}
                    className={`p-1.5 rounded-full transition-colors ${userVote === 'down' ? 'bg-red-100 text-red-500' : 'text-[#4299e6] hover:bg-red-100/50'}`}
                    aria-label="Downvote"
                >
                    <ArrowDownIcon className="h-5 w-5" />
                </button>
            </div>

            {/* Thread Content */}
            <div className="flex-grow cursor-pointer" onClick={onClick}>
                <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg text-[#2d3748] dark:text-gray-100">{thread.title}</h3>
                    <StatusIndicator status={thread.status} />
                </div>
                <div className="flex items-center gap-4 text-xs text-[#718096] dark:text-gray-400 mt-2">
                    <div className="flex items-center gap-2">
                        <img src={thread.authorAvatar} alt={thread.authorName} className="w-8 h-8 rounded-full"/>
                        <span>{thread.authorName}</span>
                    </div>
                    <span>•</span>
                    <span>{thread.timestamp ? new Date(thread.timestamp?.toDate()).toLocaleDateString() : 'Just now'}</span>
                    <span>•</span>
                    <span>{thread.replyCount} replies</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                    <span className="text-xs text-white font-medium bg-[#38b2ac] px-2.5 py-1 rounded-full">{thread.category}</span>
                    <span className="text-xs text-white font-medium bg-[#48bb78] px-2.5 py-1 rounded-full">{thread.language}</span>
                    <span className="text-xs text-white font-medium bg-[#ecc94b] px-2.5 py-1 rounded-full">{thread.difficulty}</span>
                </div>
            </div>

            {isAdmin && (
                <button
                    onClick={(e) => { e.stopPropagation(); onDelete(); }}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Delete thread"
                >
                    <TrashIcon className="h-4 w-4" />
                </button>
            )}
        </div>
    );
};

const CreateThreadModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onThreadCreated: () => void;
}> = ({ isOpen, onClose, userProfile, onThreadCreated }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState<DiscussionCategory>('Questions');
    const [language, setLanguage] = useState<DiscussionLanguage>('JavaScript');
    const [difficulty, setDifficulty] = useState<DiscussionDifficulty>('Beginner');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            alert("Title and content are required.");
            return;
        }
        setIsSubmitting(true);
        try {
            const newThreadData = {
                title,
                content,
                authorId: userProfile.id,
                authorName: userProfile.name,
                authorAvatar: userProfile.avatar,
                category,
                language,
                difficulty,
                status: 'Unsolved' as DiscussionStatus
            };
            await createThread(newThreadData);
            onThreadCreated();
            onClose();
        } catch (error) {
            console.error("Failed to create thread:", error);
            alert("Could not create thread. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create a New Discussion Thread">
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2 text-gray-900 dark:text-gray-100"/>
                <textarea placeholder="What's on your mind?" value={content} onChange={(e) => setContent(e.target.value)} required rows={6} className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2 text-gray-900 dark:text-gray-100"/>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <select value={category} onChange={(e) => setCategory(e.target.value as DiscussionCategory)} className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2 text-gray-900 dark:text-gray-100">
                        {categories.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                     <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2 text-gray-900 dark:text-gray-100">
                        {programmingLanguages.slice(1).map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                     <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as DiscussionDifficulty)} className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2 text-gray-900 dark:text-gray-100">
                        {difficulties.slice(1).map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                </div>
                <div className="flex justify-end pt-2">
                    <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Posting..." : "Post Thread"}</Button>
                </div>
            </form>
        </Modal>
    );
};

const DiscussionsPage: React.FC<DiscussionsPageProps> = ({ onSelectThread, user }) => {
  const [threads, setThreads] = useState<DiscussionThread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [filters, setFilters] = useState<GetThreadsFilters>({
    category: 'All Categories',
    language: 'All Languages',
    difficulty: 'All Levels',
    status: 'All Posts',
    sortBy: 'Newest',
    scope: 'All Threads',
  });

  const fetchAndSetThreads = async () => {
    setIsLoading(true);
    try {
      const fetchedThreads = await getThreads(filters, user.profile.id);
      setThreads(fetchedThreads);
    } catch (error) {
      console.error("Failed to fetch discussion threads:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAndSetThreads();
  }, [filters]);

  const handleFilterChange = (filterName: keyof GetThreadsFilters, value: string) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const handleDeleteThread = async (threadId: string) => {
    if (window.confirm("Are you sure you want to permanently delete this thread and all its replies?")) {
        try {
            await deleteThread(threadId);
            fetchAndSetThreads();
        } catch (error) {
            console.error("Failed to delete thread:", error);
            alert("Could not delete the thread. Please try again.");
        }
    }
  };

  const handleVoteOnThread = async (threadId: string, voteType: 'up' | 'down') => {
    const originalThreads = [...threads];
    const newThreads = threads.map(t => {
        if (t.id === threadId) {
            const isUpvoted = t.upvotedBy.includes(user.profile.id);
            const isDownvoted = t.downvotedBy.includes(user.profile.id);
            const newThread = { ...t, upvotedBy: [...t.upvotedBy], downvotedBy: [...t.downvotedBy] };

            if (voteType === 'up') {
                if (isUpvoted) {
                    newThread.upvotes--;
                    newThread.upvotedBy = newThread.upvotedBy.filter(id => id !== user.profile.id);
                } else {
                    newThread.upvotes++;
                    newThread.upvotedBy.push(user.profile.id);
                    if (isDownvoted) {
                        newThread.downvotes--;
                        newThread.downvotedBy = newThread.downvotedBy.filter(id => id !== user.profile.id);
                    }
                }
            } else { // 'down'
                if (isDownvoted) {
                    newThread.downvotes--;
                    newThread.downvotedBy = newThread.downvotedBy.filter(id => id !== user.profile.id);
                } else {
                    newThread.downvotes++;
                    newThread.downvotedBy.push(user.profile.id);
                    if (isUpvoted) {
                        newThread.upvotes--;
                        newThread.upvotedBy = newThread.upvotedBy.filter(id => id !== user.profile.id);
                    }
                }
            }
            return newThread;
        }
        return t;
    });
    setThreads(newThreads);

    try {
        await voteOnThread(threadId, user.profile.id, voteType);
    } catch (error) {
        console.error("Failed to vote on thread:", error);
        setThreads(originalThreads); // Revert on error
    }
  };

  const FilterSelect: React.FC<{ label: string; name: keyof GetThreadsFilters; options: readonly string[];}> = ({ label, name, options }) => (
      <div className="relative">
        <select
            value={filters[name]}
            onChange={(e) => handleFilterChange(name, e.target.value)}
            className="appearance-none bg-white dark:bg-gray-800 border border-[#38b2ac] rounded-full px-4 py-1.5 text-sm text-[#4a5568] dark:text-gray-300 focus:ring-2 focus:ring-[#38b2ac] focus:outline-none pr-8 cursor-pointer"
        >
          {options.map(o => <option key={o} value={o} className="bg-white dark:bg-gray-800">{o}</option>)}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#38b2ac]">
            <ChevronDownIcon className="h-4 w-4" />
        </div>
      </div>
  );

  return (
    <>
      <CreateThreadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userProfile={user.profile}
        onThreadCreated={fetchAndSetThreads}
      />
      <Card title="Discussions" icon={<ChatBubbleIcon />}>
        <div className="space-y-6">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div className="flex space-x-1 rounded-lg bg-gray-100 dark:bg-gray-900/50 p-1">
              {(scopeOptions).map(scope => (
                <button
                  key={scope}
                  onClick={() => handleFilterChange('scope', scope)}
                  className={`flex-1 px-4 py-2 text-base font-semibold rounded-lg transition-all duration-200 ${
                    filters.scope === scope
                    ? 'bg-[#4299e6] text-white shadow-[0_2px_8px_rgba(0,0,0,0.08)]'
                    : 'text-[#4a5568] dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700/50'
                  }`}
                >
                  {scope}
                </button>
              ))}
            </div>
            <Button onClick={() => setIsModalOpen(true)} icon={<PlusIcon />}>Create Thread</Button>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-md border border-gray-200 dark:border-gray-700 flex flex-wrap gap-x-6 gap-y-4 items-center">
              <FilterSelect label="Category" name="category" options={categories} />
              <FilterSelect label="Language" name="language" options={programmingLanguages} />
              <FilterSelect label="Difficulty" name="difficulty" options={difficulties} />
              <FilterSelect label="Status" name="status" options={statuses} />
              <FilterSelect label="Sort By" name="sortBy" options={sortOptions} />
          </div>

          <div className="space-y-4 min-h-[400px]">
            {isLoading ? (
              <div className="flex justify-center items-center h-full pt-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : threads.length > 0 ? (
              threads.map((thread, index) => (
                <ThreadItem 
                    key={thread.id} 
                    thread={thread}
                    index={index}
                    onClick={() => onSelectThread(thread.id, filters.scope)}
                    isAdmin={user.role === 'admin'}
                    onDelete={() => handleDeleteThread(thread.id)}
                    currentUser={user.profile}
                    onVote={(voteType) => handleVoteOnThread(thread.id, voteType)}
                />
              ))
            ) : (
              <div className="flex justify-center items-center h-full pt-16">
                  <p className="text-gray-500 dark:text-gray-400">No discussions found matching your filters.</p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </>
  );
};

export default DiscussionsPage;