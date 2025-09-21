import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, ProgrammingQuestion } from '../types';
import Button from './Button';
import Card from './Card';
import UsersIcon from './icons/UsersIcon';
import MicrophoneIcon from './icons/MicrophoneIcon';
import MicrophoneSlashIcon from './icons/MicrophoneSlashIcon';
import VideoCameraIcon from './icons/VideoCameraIcon';
import VideoCameraSlashIcon from './icons/VideoCameraSlashIcon';
import ChatBubbleIcon from './icons/ChatBubbleIcon';

interface Participant {
  id: string;
  name: string;
  avatar: string;
  role: 'host' | 'debugger' | 'optimizer' | 'tester';
  isActive: boolean;
  isMuted: boolean;
  hasVideo: boolean;
}

interface CollaborativeCodingRoomProps {
  user: UserProfile;
  roomId?: string;
  onExit: () => void;
}

const ROOM_ROLES = [
  { id: 'host', name: 'Host', description: 'Leads the session and coordinates', color: 'bg-purple-500' },
  { id: 'debugger', name: 'Debugger', description: 'Focuses on finding and fixing bugs', color: 'bg-red-500' },
  { id: 'optimizer', name: 'Optimizer', description: 'Improves code efficiency', color: 'bg-blue-500' },
  { id: 'tester', name: 'Tester', description: 'Creates and runs test cases', color: 'bg-green-500' },
];

const CollaborativeCodingRoom: React.FC<CollaborativeCodingRoomProps> = ({ user, roomId, onExit }) => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [currentCode, setCurrentCode] = useState('// Start coding together!');
  const [chatMessages, setChatMessages] = useState<{id: string, user: string, message: string, timestamp: Date}[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [myRole, setMyRole] = useState<string>('debugger');
  const [isMuted, setIsMuted] = useState(false);
  const [hasVideo, setHasVideo] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [currentProblem, setCurrentProblem] = useState<ProgrammingQuestion | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate connecting to a collaborative session
    const timer = setTimeout(() => {
      setIsConnected(true);
      // Add some mock participants
      const mockParticipants: Participant[] = [
        {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          role: myRole as any,
          isActive: true,
          isMuted,
          hasVideo,
        },
        {
          id: 'mock-1',
          name: 'Alex Chen',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
          role: 'host',
          isActive: true,
          isMuted: false,
          hasVideo: true,
        },
        {
          id: 'mock-2',
          name: 'Sarah Kim',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
          role: 'optimizer',
          isActive: true,
          isMuted: true,
          hasVideo: false,
        }
      ];
      setParticipants(mockParticipants);
      
      // Add welcome message
      setChatMessages([{
        id: '1',
        user: 'System',
        message: 'Welcome to the collaborative coding session! 🚀',
        timestamp: new Date()
      }]);

      // Set a sample problem
      setCurrentProblem({
        type: 'PROGRAMMING' as any,
        questionText: 'Two Sum Challenge',
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
        constraints: ['2 ≤ nums.length ≤ 10⁴', '-10⁹ ≤ nums[i] ≤ 10⁹', 'Only one valid answer exists'],
        testCases: [
          { input: 'nums = [2,7,11,15], target = 9', expectedOutput: '[0,1]', hidden: false },
          { input: 'nums = [3,2,4], target = 6', expectedOutput: '[1,2]', hidden: false }
        ]
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [user, myRole, isMuted, hasVideo]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now().toString(),
      user: user.name,
      message: newMessage,
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    setParticipants(prev => prev.map(p => 
      p.id === user.id ? { ...p, isMuted: !isMuted } : p
    ));
  };

  const toggleVideo = () => {
    setHasVideo(!hasVideo);
    setParticipants(prev => prev.map(p => 
      p.id === user.id ? { ...p, hasVideo: !hasVideo } : p
    ));
  };

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
  };

  const changeRole = (newRole: string) => {
    setMyRole(newRole);
    setParticipants(prev => prev.map(p => 
      p.id === user.id ? { ...p, role: newRole as any } : p
    ));
  };

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
          <p className="text-xl text-gray-600 dark:text-gray-300">Connecting to collaborative session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 mb-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <UsersIcon className="h-8 w-8 text-blue-500" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Collaborative Coding Room {roomId && `#${roomId}`}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {participants.length} participants • {currentProblem?.questionText || 'No problem selected'}
                </p>
              </div>
            </div>
            <Button variant="danger" onClick={onExit}>
              Leave Room
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Participants & Controls */}
          <div className="lg:col-span-1 space-y-4">
            {/* Participants */}
            <Card title="Participants" icon={<UsersIcon />}>
              <div className="space-y-3">
                {participants.map(participant => {
                  const role = ROOM_ROLES.find(r => r.id === participant.role);
                  return (
                    <div key={participant.id} className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="relative">
                        <img src={participant.avatar} alt={participant.name} className="w-10 h-10 rounded-full" />
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${role?.color}`}></div>
                      </div>
                      <div className="flex-grow">
                        <p className="font-semibold text-sm text-gray-900 dark:text-white">
                          {participant.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {role?.name}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        {participant.isMuted ? 
                          <MicrophoneSlashIcon className="h-4 w-4 text-red-500" /> : 
                          <MicrophoneIcon className="h-4 w-4 text-green-500" />
                        }
                        {participant.hasVideo ? 
                          <VideoCameraIcon className="h-4 w-4 text-green-500" /> : 
                          <VideoCameraSlashIcon className="h-4 w-4 text-gray-400" />
                        }
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Role Selection */}
            <Card title="My Role" icon={<UsersIcon />}>
              <div className="space-y-2">
                {ROOM_ROLES.map(role => (
                  <button
                    key={role.id}
                    onClick={() => changeRole(role.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      myRole === role.id 
                        ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 border border-blue-300' 
                        : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${role.color}`}></div>
                      <div>
                        <p className="font-semibold text-sm">{role.name}</p>
                        <p className="text-xs opacity-70">{role.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Controls */}
            <Card title="Controls" icon={<UsersIcon />}>
              <div className="space-y-2">
                <Button
                  onClick={toggleMute}
                  variant={isMuted ? "danger" : "secondary"}
                  size="sm"
                  className="w-full"
                >
                  {isMuted ? <MicrophoneSlashIcon className="h-4 w-4 mr-2" /> : <MicrophoneIcon className="h-4 w-4 mr-2" />}
                  {isMuted ? 'Unmute' : 'Mute'}
                </Button>
                <Button
                  onClick={toggleVideo}
                  variant={hasVideo ? "primary" : "secondary"}
                  size="sm"
                  className="w-full"
                >
                  {hasVideo ? <VideoCameraIcon className="h-4 w-4 mr-2" /> : <VideoCameraSlashIcon className="h-4 w-4 mr-2" />}
                  {hasVideo ? 'Stop Video' : 'Start Video'}
                </Button>
                <Button
                  onClick={toggleScreenShare}
                  variant={isScreenSharing ? "primary" : "secondary"}
                  size="sm"
                  className="w-full"
                >
                  {isScreenSharing ? 'Stop Sharing' : 'Share Screen'}
                </Button>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Problem Statement */}
            {currentProblem && (
              <Card title={currentProblem.questionText} icon={<UsersIcon />}>
                <div className="space-y-4">
                  <p className="text-gray-700 dark:text-gray-300">{currentProblem.description}</p>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Constraints:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {currentProblem.constraints.map((constraint, idx) => (
                        <li key={idx} className="text-sm text-gray-600 dark:text-gray-400">{constraint}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Test Cases:</h4>
                    {currentProblem.testCases.map((testCase, idx) => (
                      <div key={idx} className="bg-gray-50 dark:bg-gray-700 p-3 rounded text-sm">
                        <p><strong>Input:</strong> {testCase.input}</p>
                        <p><strong>Output:</strong> {testCase.expectedOutput}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {/* Code Editor */}
            <Card title="Shared Code Editor" icon={<UsersIcon />}>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Live collaborative editing • {participants.length} users connected
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary">Save</Button>
                    <Button size="sm" variant="primary">Run</Button>
                  </div>
                </div>
                <textarea
                  value={currentCode}
                  onChange={(e) => setCurrentCode(e.target.value)}
                  className="w-full h-96 bg-gray-900 text-green-400 font-mono text-sm p-4 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="// Start coding together..."
                />
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Output:</p>
                  <pre className="text-sm text-gray-800 dark:text-gray-200">
                    Click "Run" to see output...
                  </pre>
                </div>
              </div>
            </Card>
          </div>

          {/* Chat */}
          <div className="lg:col-span-1">
            <Card title="Team Chat" icon={<ChatBubbleIcon />}>
              <div className="flex flex-col h-96">
                <div className="flex-grow overflow-y-auto space-y-3 mb-4">
                  {chatMessages.map(msg => (
                    <div key={msg.id} className="text-sm">
                      <div className="flex justify-between items-start">
                        <span className="font-semibold text-gray-900 dark:text-white">{msg.user}</span>
                        <span className="text-xs text-gray-400">
                          {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mt-1">{msg.message}</p>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-grow px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                  />
                  <Button type="submit" size="sm">Send</Button>
                </form>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborativeCodingRoom;
