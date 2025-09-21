import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ConceptQuestion, CodeExecutionResult, UserProfile, ConceptAttempt } from '../types';
import { getQuestionForConcept, runConceptCode, submitConceptAttempt } from '../services/conceptService';
import Button from './Button';
import CodeEditor from './CodeEditor';
import Modal from './Modal';
import CheckIcon from './icons/CheckIcon';
import XIcon from './icons/XIcon';
import ClockIcon from './icons/ClockIcon';

interface ConceptSolveViewProps {
  conceptSlug: string;
  user: UserProfile;
  onUpdateUser: (updatedUserData: Partial<UserProfile>) => Promise<void>;
  onExit: () => void;
  onSolveNew: (conceptSlug: string) => void;
}

const LoadingScreen: React.FC<{ conceptSlug: string }> = ({ conceptSlug }) => (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-blue-500"></div>
        <p className="mt-6 text-2xl text-gray-700 dark:text-gray-300">Loading Concept: {conceptSlug}...</p>
    </div>
);

const ResultPill: React.FC<{ status: 'PASS' | 'FAIL' | 'RUNNING' }> = ({ status }) => {
    const styles = {
        PASS: {
            icon: <CheckIcon className="h-4 w-4 text-[#48bb78]" />,
            label: 'PASS',
            classes: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
        },
        FAIL: {
            icon: <XIcon className="h-4 w-4 text-[#f56565]" />,
            label: 'FAIL',
            classes: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
        },
        RUNNING: {
            icon: <ClockIcon className="h-4 w-4 text-[#ecc94b]" />,
            label: 'RUNNING',
            classes: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300'
        }
    };
    const current = styles[status];
    return (
      <span className={`flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${current.classes}`}>
        {current.icon}
        {current.label}
      </span>
    );
};


const ConceptSolveView: React.FC<ConceptSolveViewProps> = ({ conceptSlug, user, onUpdateUser, onExit, onSolveNew }) => {
  const [question, setQuestion] = useState<ConceptQuestion | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');

  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [runResult, setRunResult] = useState<CodeExecutionResult | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [activeTestCaseTab, setActiveTestCaseTab] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    getQuestionForConcept(conceptSlug)
      .then(q => {
        setQuestion(q);
        // A simple starter code simulation
        const starterCode = `function solve() {\n  // Write your code here\n}`;
        setCode(starterCode);
        setRunResult(null);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load concept question.");
      })
      .finally(() => setIsLoading(false));

  }, [conceptSlug]);

  const handleRunCode = async () => {
    if (!question || isRunning) return;
    setIsRunning(true);
    setRunResult(null);
    try {
        const result = await runConceptCode(code, language, question.testCases);
        setRunResult(result);
    } catch (e: any) {
        setRunResult({ success: false, error: e.message || 'Failed to run code.', testResults: [] });
    } finally {
        setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!question || isSubmitting) return;
    setIsSubmitting(true);
    try {
        const result = await runConceptCode(code, language, question.testCases);
        setRunResult(result);

        const attempt: Omit<ConceptAttempt, 'id' | 'timestamp'> = {
            userId: user.id,
            conceptId: question.id,
            timeTaken: 0, // Timer not implemented in this view
            solved: result.success,
            code: code,
        };
        await submitConceptAttempt(attempt);

        if (result.success) {
            await onUpdateUser({ questionsSolved: (user.questionsSolved || 0) + 1 });
            setIsSuccessModalOpen(true);
        } else {
            alert(`Submission complete. You failed one or more test cases.`);
        }
    } catch (e: any) {
        alert(`An error occurred during submission: ${e.message}`);
    } finally {
        setIsSubmitting(false);
    }
  };

  if (isLoading) return <LoadingScreen conceptSlug={conceptSlug} />;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;
  if (!question) return <div className="text-center p-8">Question not found.</div>;

  const visibleTestCases = question.testCases.filter(tc => !tc.hidden);
  
  return (
    <>
    <Modal isOpen={isSuccessModalOpen} onClose={() => { setIsSuccessModalOpen(false); onExit(); }} title="Congratulations!" showConfetti>
        <div className="text-center p-4">
            <h3 className="text-xl font-semibold text-[#2d3748] dark:text-white">Solution Accepted!</h3>
            <p className="text-gray-500 mt-2">You've successfully solved {question.title}. Keep up the great work!</p>
            <div className="mt-6">
                <Button onClick={() => { setIsSuccessModalOpen(false); onExit(); }}>Continue</Button>
            </div>
        </div>
    </Modal>
    <div className="flex h-[calc(100vh-120px)] gap-4">
      {/* Left Panel: Problem */}
      <div className="w-[35%] bg-white rounded-[8px] border border-[#e2e8f0] p-6 flex flex-col overflow-hidden">
        <div className="flex-shrink-0 border-b border-[#e2e8f0] pb-3 mb-3">
             <div className="flex space-x-1">
                {visibleTestCases.map((tc, index) => (
                    <button 
                        key={index} 
                        onClick={() => setActiveTestCaseTab(index)}
                        className={`px-3 py-2 text-sm font-semibold rounded-t-md transition-colors duration-300 ${activeTestCaseTab === index ? 'bg-[#38b2ac] text-white' : 'bg-[#e2e8f0] text-[#718096] hover:bg-[#f7fafc]'}`}
                    >
                        Case {index + 1}
                    </button>
                ))}
            </div>
        </div>
        <div className="flex-grow overflow-y-auto custom-scrollbar pr-2" style={{ lineHeight: 1.6 }}>
            <h2 className="text-lg font-semibold text-[#2d3748] mb-4">{question.title}</h2>
            <div className="text-[#4a5568] text-[16px] space-y-4" dangerouslySetInnerHTML={{ __html: question.questionText.replace(/\n/g, '<br />') }} />
             <div className="mt-4">
                 <h3 className="text-md font-semibold text-[#2d3748] mb-2">Test Case {activeTestCaseTab + 1}</h3>
                 <div className="text-sm font-mono bg-gray-100 p-3 rounded-md">
                     <p><span className="font-semibold">Input:</span> {visibleTestCases[activeTestCaseTab].input}</p>
                     <p><span className="font-semibold">Expected:</span> {visibleTestCases[activeTestCaseTab].expectedOutput}</p>
                 </div>
            </div>
        </div>
      </div>
      
      {/* Right Panel: Editor & Console */}
      <div className="w-[65%] flex flex-col gap-4">
        <div className="flex-grow flex flex-col bg-[#1a202c] rounded-[8px] overflow-hidden">
          <CodeEditor code={code} setCode={setCode} language={language} setLanguage={setLanguage} onRun={handleRunCode} onSubmit={handleSubmit} isRunning={isRunning || isSubmitting}/>
        </div>
        <div className="h-48 flex flex-col bg-white rounded-[8px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden">
            <div className="p-3 border-b font-semibold text-gray-700">Results</div>
             <div className="p-3 flex-grow overflow-auto custom-scrollbar bg-gray-50">
                {isRunning && <ResultPill status="RUNNING" />}
                {runResult?.error && <pre className="text-xs font-mono text-[#c53030] bg-[#fed7d7] p-2 rounded whitespace-pre-wrap">Error: {runResult.error}</pre>}
                {runResult?.testResults && (
                    <div className="space-y-2">
                        {runResult.testResults.map((res, i) => (
                             <div key={i} className="flex items-center justify-between p-2 bg-white rounded animate-fade-in-stagger" style={{ animationDelay: `${i * 100}ms` }}>
                                <p className="font-semibold text-sm">Test Case {i+1}</p>
                                <ResultPill status={res.passed ? 'PASS' : 'FAIL'} />
                             </div>
                        ))}
                    </div>
                )}
             </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default ConceptSolveView;
