import React, { useState, useEffect } from 'react';
import ChallengeView from '../ChallengeView';
import { UserProfile, HackathonRequest, Hackathon, ProblemStatement } from '../../types';
import Button from '../Button';
import Modal from '../Modal';
import Card from '../Card';
import TrophyIcon from '../icons/TrophyIcon';
import Countdown from '../Countdown';
import ChevronDownIcon from '../icons/ChevronDownIcon';
import ChevronUpIcon from '../icons/ChevronUpIcon';
import { requestHackathon, getHackathons, getRequestsByUser, registerForHackathon, isUserRegistered, getUserRegistrations } from '../../services/hackathonService';

const programmingLanguages = [
    "JavaScript", "Python", "Java", "C#", "TypeScript", "C++", "PHP", "Go",
    "Ruby", "Swift", "Kotlin", "Rust", "SQL"
];

interface HackathonsPageProps {
    onChallengeFinished: () => void;
    user: UserProfile;
    onStartChallenge: (language: string) => void;
}

const HackathonCard: React.FC<{ hackathon: Hackathon; user: UserProfile; onRegister: (hackathonId: string) => void; isRegistered: boolean }> = ({ hackathon, user, onRegister, isRegistered }) => {
    const [expandedSection, setExpandedSection] = useState<string | null>(null);

    const toggleSection = (section: string) => {
        setExpandedSection(prev => prev === section ? null : section);
    };

    const sections = [
        { id: 'rules', title: 'Rules & Eligibility' },
        { id: 'prizes', title: 'Prizes & Rewards' },
        { id: 'problems', title: 'Problem Statements' },
    ];
    
    const DifficultyPill: React.FC<{ difficulty: 'Easy' | 'Medium' | 'Hard' }> = ({ difficulty }) => {
        const colors = {
            Easy: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
            Medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
            Hard: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
        };
        return <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${colors[difficulty]}`}>{difficulty}</span>;
    };

    return (
        <div className="bg-gradient-to-br from-[#2d3748] to-[#1a202c] text-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-700/50">
            {/* Banner */}
            <div className="h-48 bg-cover bg-center relative" style={{ backgroundImage: `url(${hackathon.bannerUrl})` }}>
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm p-6 flex flex-col justify-end">
                    <h3 className="text-3xl font-black text-white shadow-md">{hackathon.title}</h3>
                    <p className="text-gray-200 text-sm mt-1 shadow-md">{hackathon.description}</p>
                </div>
            </div>

            {/* Main Info */}
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    <Countdown targetDate={hackathon.startDate.toDate()} />
                    <div className="md:col-span-2 flex flex-col md:flex-row justify-end items-center gap-4">
                        <div className="text-center md:text-right">
                           <p className="text-sm font-semibold text-gray-300">Starts: {hackathon.startDate.toDate().toLocaleString()}</p>
                           <p className="text-sm font-semibold text-gray-300">Ends: {hackathon.endDate.toDate().toLocaleString()}</p>
                        </div>
                        <Button 
                            variant="primary-gradient" 
                            size="lg" 
                            className="w-full md:w-auto shadow-lg" 
                            disabled={hackathon.status !== 'Upcoming' || isRegistered}
                            onClick={() => onRegister(hackathon.id)}
                        >
                            {isRegistered ? 'Registered ✓' : (hackathon.status === 'Upcoming' ? 'Register Now' : hackathon.status)}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Accordion for Details */}
            <div className="border-t border-white/10">
                {sections.map(section => (
                    <div key={section.id} className="border-b border-white/10 last:border-b-0">
                        <button onClick={() => toggleSection(section.id)} className="w-full flex justify-between items-center p-4 hover:bg-white/5 focus:outline-none">
                            <h4 className="font-semibold text-gray-100">{section.title}</h4>
                            {expandedSection === section.id ? <ChevronUpIcon /> : <ChevronDownIcon />}
                        </button>
                        {expandedSection === section.id && (
                            <div className="p-6 bg-black/20 animate-fade-in-up">
                                {section.id === 'rules' && <ul className="list-disc pl-5 space-y-2 text-sm text-gray-300">{hackathon.rules.map((rule, i) => <li key={i}>{rule}</li>)}</ul>}
                                {section.id === 'prizes' && <ul className="list-disc pl-5 space-y-2 text-sm text-gray-300">{hackathon.prizes.map((prize, i) => <li key={i}>{prize}</li>)}</ul>}
                                {section.id === 'problems' && (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        {hackathon.problemStatements.map((ps, index) => (
                                            <div key={ps.id} className={`p-4 rounded-lg border border-gray-700 ${index % 2 === 0 ? 'bg-white/5' : 'bg-white/10'}`}>
                                                <div className="flex justify-between items-center mb-2">
                                                    <h5 className="font-bold text-gray-100">{ps.title}</h5>
                                                    <DifficultyPill difficulty={ps.difficulty} />
                                                </div>
                                                <p className="text-sm text-gray-300 mb-3">{ps.description}</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {ps.tags.map(tag => <span key={tag} className="text-xs bg-white/10 text-gray-300 px-2 py-1 rounded-full">{tag}</span>)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const HackathonRequestItem: React.FC<{ request: HackathonRequest }> = ({ request }) => {
    const status = request.status;
     const statusColor = {
        pending: 'bg-yellow-500/20 text-yellow-700 dark:bg-yellow-500/30 dark:text-yellow-300',
        approved: 'bg-green-500/20 text-green-700 dark:bg-green-500/30 dark:text-green-300',
        rejected: 'bg-red-500/20 text-red-700 dark:bg-red-500/30 dark:text-red-300',
    };
    return (
        <div className="p-3 bg-white dark:bg-gray-800/80 rounded-lg flex justify-between items-center border border-gray-200 dark:border-gray-700">
            <div className="flex-grow">
                <p className="text-sm text-gray-600 dark:text-gray-300 italic">"{request.requestText}"</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Requested on: {new Date(request.timestamp.toDate()).toLocaleDateString()}
                </p>
            </div>
            <span className={`text-xs font-bold py-1 px-2.5 rounded-full capitalize ${statusColor[status]}`}>
                {status}
            </span>
        </div>
    );
};


const HackathonsPage: React.FC<HackathonsPageProps> = ({ onChallengeFinished, user, onStartChallenge }) => {
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const [requestText, setRequestText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [registrationToast, setRegistrationToast] = useState('');

    const [hackathons, setHackathons] = useState<Hackathon[]>([]);
    const [myRequests, setMyRequests] = useState<HackathonRequest[]>([]);
    const [registrationStates, setRegistrationStates] = useState<Record<string, boolean>>({});
    const [isLoading, setIsLoading] = useState(true);

    const fetchPageData = async () => {
        setIsLoading(true);
        try {
            const hackathonsPromise = getHackathons();
            const requestsPromise = getRequestsByUser(user.id);
            const [fetchedHackathons, fetchedRequests] = await Promise.all([hackathonsPromise, requestsPromise]);
            setHackathons(fetchedHackathons);
            setMyRequests(fetchedRequests);
            
            // Check registration status for each hackathon
            if (fetchedHackathons.length > 0) {
                const registrationPromises = fetchedHackathons.map(h => 
                    isUserRegistered(h.id, user.id).catch(err => {
                        console.warn(`Failed to check registration for hackathon ${h.id}:`, err);
                        return false; // Default to not registered if check fails
                    })
                );
                const registrationResults = await Promise.all(registrationPromises);
                const registrationMap: Record<string, boolean> = {};
                fetchedHackathons.forEach((h, index) => {
                    registrationMap[h.id] = registrationResults[index];
                });
                setRegistrationStates(registrationMap);
            }
        } catch (error) {
            console.error("Failed to load hackathons page data:", error);
            // Set some default/empty state so the page doesn't break
            setHackathons([]);
            setMyRequests([]);
            setRegistrationStates({});
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPageData();
    }, [user.id]);
    
    const handleHackathonRegistration = async (hackathonId: string) => {
        try {
            setIsSubmitting(true);
            await registerForHackathon(hackathonId, user.id, user.name, user.email);
            setRegistrationStates(prev => ({ ...prev, [hackathonId]: true }));
            setRegistrationToast('Successfully registered for hackathon! 🎉');
            setTimeout(() => setRegistrationToast(''), 3000);
        } catch (error: any) {
            console.error('Registration failed:', error);
            alert(error.message || 'Failed to register for hackathon. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleConfirmRequest = async () => {
        if (!requestText.trim()) {
            alert('Please provide a reason or idea for your hackathon request.');
            return;
        }
        setIsSubmitting(true);
        try {
            await requestHackathon(user.id, user.name, user.email, requestText);
            setIsRequestModalOpen(false);
            setRequestText('');
            setShowSuccessToast(true);
            setTimeout(() => setShowSuccessToast(false), 3000);
            fetchPageData(); // Refresh requests list
        } catch (error) {
            console.error("Failed to submit hackathon request:", error);
            alert("There was an error submitting your request. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gradient">Upcoming Hackathons</h1>
                <Button size="lg" variant="secondary" onClick={() => setIsRequestModalOpen(true)}>
                    Request a Hackathon
                </Button>
            </div>
            
            <div className="space-y-8">
                 {isLoading ? (
                    <p className="text-center p-12 text-gray-500">Loading Hackathons...</p>
                ) : hackathons.length > 0 ? (
                    hackathons.map(h => 
                        <HackathonCard 
                            key={h.id} 
                            hackathon={h} 
                            user={user}
                            onRegister={handleHackathonRegistration}
                            isRegistered={registrationStates[h.id] || false}
                        />
                    )
                ) : (
                    <p className="text-center p-12 text-gray-500">No hackathons scheduled. Check back soon!</p>
                )}
            </div>

            <Card title="My Hackathon Requests" icon={<TrophyIcon />}>
                 <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar p-1">
                    {isLoading ? (
                        <p className="text-center p-8">Loading requests...</p>
                    ) : myRequests.length > 0 ? (
                        myRequests.map(req => <HackathonRequestItem key={req.id} request={req} />)
                    ) : (
                        <p className="text-center p-8 text-gray-500">You haven't requested any hackathons yet.</p>
                    )}
                </div>
            </Card>
            
            <Modal
                isOpen={isRequestModalOpen}
                onClose={() => setIsRequestModalOpen(false)}
                title="Request a New Hackathon"
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Have an idea for a hackathon? Let us know! Your request will be sent to the admins for review.
                    </p>
                    <div>
                        <label htmlFor="request-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Your Idea / Reason
                        </label>
                        <textarea
                            id="request-text"
                            rows={4}
                            className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm text-gray-900 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
                            value={requestText}
                            onChange={(e) => setRequestText(e.target.value)}
                            placeholder="e.g., A hackathon focused on AI-powered developer tools."
                        />
                    </div>
                    <div className="flex justify-end space-x-2 pt-2">
                        <Button variant="secondary" onClick={() => setIsRequestModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleConfirmRequest} disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Confirm Request'}
                        </Button>
                    </div>
                </div>
            </Modal>
            
            {showSuccessToast && (
                <div className="fixed bottom-10 right-10 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg animate-fade-in-up z-50">
                    Your hackathon request has been sent!
                </div>
            )}
            
            {registrationToast && (
                <div className="fixed bottom-10 right-10 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg animate-fade-in-up z-50">
                    {registrationToast}
                </div>
            )}
        </div>
    );
};

export default HackathonsPage;