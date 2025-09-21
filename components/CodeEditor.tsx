import React from 'react';
import Button from './Button';

interface CodeEditorProps {
    code: string;
    setCode: (code: string) => void;
    language: string;
    setLanguage: (lang: string) => void;
    onRun: () => void;
    onSubmit: () => void;
    isRunning: boolean;
}

const programmingLanguages = ["javascript", "python", "java", "csharp", "cpp", "rust", "go"];

const CodeEditor: React.FC<CodeEditorProps> = ({ code, setCode, language, setLanguage, onRun, onSubmit, isRunning }) => {
    
    return (
        <div className="flex flex-col h-full">
            {/* Toolbar */}
            <div className="flex-shrink-0 flex items-center justify-between p-2 bg-gradient-to-b from-[#2d3748] to-[#1a202c]">
                <select 
                    value={language} 
                    onChange={e => setLanguage(e.target.value)} 
                    className="bg-transparent text-white border border-gray-600 rounded-[6px] px-2 py-1 text-sm focus:ring-blue-500 focus:border-blue-500"
                >
                    {programmingLanguages.map(lang => <option key={lang} value={lang} className="bg-gray-800">{lang.charAt(0).toUpperCase() + lang.slice(1)}</option>)}
                </select>
                <div className="flex items-center gap-2">
                    <Button variant="secondary" onClick={() => setCode('')} size="md" className="!h-[40px] !bg-[#718096] !text-white hover:!bg-gray-600">Reset Code</Button>
                    <Button variant="success-gradient" onClick={onRun} size="md" disabled={isRunning} className="!h-[40px]">Run Code</Button>
                    <Button variant="primary-gradient" onClick={onSubmit} size="md" disabled={isRunning} className="!h-[40px]">Submit Solution</Button>
                </div>
            </div>
            {/* Editor Area */}
            <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="flex-grow p-2 font-mono text-sm text-gray-300 bg-[#1a202c] focus:outline-none custom-scrollbar whitespace-pre resize-none"
                spellCheck="false"
                aria-label="Code Editor"
            />
        </div>
    );
};

export default CodeEditor;