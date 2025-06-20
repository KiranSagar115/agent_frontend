import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import MonacoEditor from '@monaco-editor/react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const languageOptions = [
  { label: 'Python', value: 'python', monaco: 'python' },
  { label: 'C', value: 'c', monaco: 'c' },
  { label: 'C++', value: 'cpp', monaco: 'cpp' },
  { label: 'Java', value: 'java', monaco: 'java' },
  { label: 'JavaScript', value: 'javascript', monaco: 'javascript' },
];

export default function SolutionEvaluator({ problem, onEvaluationComplete, onShowFeedbackModal }) {
  const [solution, setSolution] = useState('');
  const [language, setLanguage] = useState(languageOptions[0].value);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [error, setError] = useState(null);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [input, setInput] = useState('');
  const [activeTab, setActiveTab] = useState('output');
  const [successMessage, setSuccessMessage] = useState('');
  const [lastSubmitted, setLastSubmitted] = useState('');
  const [lastEvaluationResult, setLastEvaluationResult] = useState(null);
  const modalRef = useRef(null);

  // Helper to render feedback with bold
  function renderFeedbackWithBold(text) {
    if (!text) return null;
    if (typeof text === 'string') {
      const parts = text.split(/(\*\*[^*]+\*\*)/g);
      return parts.map((part, i) => {
        if (/^\*\*[^*]+\*\*$/.test(part)) {
          return <strong key={i}>{part.replace(/\*\*/g, '')}</strong>;
        }
        return <span key={i}>{part.replace(/\*\*/g, '')}</span>;
      });
    }
    if (Array.isArray(text)) {
      return text.map((item, idx) => <div key={idx}>{renderFeedbackWithBold(item)}</div>);
    }
    if (typeof text === 'object') {
      return Object.entries(text).map(([key, value]) => (
        <div key={key} className="mb-2">
          <strong>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong>
          <div>{renderFeedbackWithBold(value)}</div>
        </div>
      ));
    }
    return String(text);
  }

  // Modal close on outside click
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        // Handle outside click if needed
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleRunAndAnalyze = async () => {
    setIsRunning(true);
    setIsEvaluating(true);
    setOutput('');
    setError(null);
    setSuccessMessage('');
    try {
      let runRes;
      if (problem.problemType === 'code') {
        runRes = await axios.post(`${API_URL}/problems/run-code`, {
          code: solution,
          language,
          input,
          problemId: problem._id
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setOutput(runRes.data.stdout || runRes.data.stderr || runRes.data.error || 'No output');
        setSuccessMessage('Code executed successfully. Analyzing...');
      }
      let evalRes;
      if (problem.problemType === 'code') {
        evalRes = await axios.post(`${API_URL}/problems/evaluate-code`, {
          problemId: problem._id,
          solution: solution,
          language
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
      } else {
        evalRes = await axios.post(`${API_URL}/algorithm/evaluate`, {
          questionId: problem._id,
          answer: solution
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
      }
      setSuccessMessage('Code analysis successful.');
      setLastSubmitted(solution + (problem.problemType === 'code' ? language : ''));
      setLastEvaluationResult(evalRes.data);
      if (onEvaluationComplete) onEvaluationComplete(evalRes.data);
    } catch (err) {
      let msg = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to run or analyze code';
      if (err.response?.data?.raw) {
        msg += '\nAI raw response: ' + err.response.data.raw;
      }
      setError(msg);
    } finally {
      setIsRunning(false);
      setIsEvaluating(false);
    }
  };

  // Button should be disabled if code/algorithm is unchanged since last submit
  const isButtonDisabled = isRunning || isEvaluating || !solution.trim() || (lastSubmitted === (solution + (problem.problemType === 'code' ? language : '')));

  return (
    <div className="space-y-4">
      <div className="bg-black/20 rounded-2xl p-4 shadow-xl max-w-7xl mx-auto">
        <h3 className="text-lg font-semibold text-white mb-2">Your Solution</h3>
        {problem.problemType === 'code' ? (
          <>
            <div className="flex items-center mb-2 space-x-4">
              <label className="text-white/70">Language:</label>
              <select
                value={language}
                onChange={e => setLanguage(e.target.value)}
                className="bg-black/40 text-white p-2 rounded-lg"
              >
                {languageOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="mb-2 rounded-xl overflow-hidden border border-white/10" style={{ height: 320 }}>
              <MonacoEditor
                height="100%"
                language={languageOptions.find(l => l.value === language).monaco}
                value={solution}
                onChange={value => setSolution(value)}
                theme="vs-dark"
                options={{ fontSize: 16, minimap: { enabled: false }, fontLigatures: true, fontFamily: 'Fira Mono, monospace' }}
              />
            </div>
            <div className="mb-2">
              <label className="text-white/70">Custom Input (stdin):</label>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                className="w-full h-16 bg-black/40 text-white p-2 rounded-lg font-mono"
                placeholder="Enter input for your code (optional)"
              />
            </div>
            <div className="flex space-x-4 mt-4">
              <button
                onClick={handleRunAndAnalyze}
                disabled={isButtonDisabled}
                className={`px-8 py-2 rounded-lg flex items-center justify-center text-lg font-semibold shadow-md transition-all duration-200 ${
                  isButtonDisabled
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-600 hover:to-violet-700'
                } text-white min-w-[180px]`}
              >
                {(isRunning || isEvaluating) ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Running & Analyzing...
                  </>
                ) : (
                  'Run & Analyze'
                )}
              </button>
            </div>
            {successMessage && (
              <div className="mt-4 text-green-300 text-lg font-semibold">{successMessage}</div>
            )}
            {(output) && (
              <div className="mt-6">
                <div className="flex space-x-4 mb-2">
                  {problem.problemType === 'code' && (
                    <button
                      className={`px-4 py-2 rounded-t-lg text-lg font-medium transition-all duration-200 ${activeTab === 'output' ? 'bg-cyan-700 text-white' : 'bg-black/30 text-cyan-200'}`}
                      onClick={() => setActiveTab('output')}
                    >Output</button>
                  )}
                  {lastEvaluationResult && (
                    <button
                      className="px-4 py-2 rounded-t-lg text-lg font-medium transition-all duration-200 bg-violet-700 text-white hover:bg-violet-800"
                      onClick={() => onShowFeedbackModal && onShowFeedbackModal(lastEvaluationResult)}
                    >Feedback</button>
                  )}
                </div>
                <div className="rounded-b-lg bg-black/40 p-4 min-h-[120px]">
                  {activeTab === 'output' && problem.problemType === 'code' && (
                    <div className="text-green-300 font-mono whitespace-pre-wrap">
                      <strong>Output:</strong>
                      <div>{output}</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="mb-2">
              <label className="text-white/70">Describe your algorithm:</label>
              <textarea
                value={solution}
                onChange={e => setSolution(e.target.value)}
                className="w-full h-48 bg-black/40 text-white p-3 rounded-lg font-mono text-base"
                placeholder="Describe your algorithm step by step. Optionally include time/space complexity if you know it."
              />
            </div>
            <div className="flex space-x-4 mt-4">
              <button
                onClick={handleRunAndAnalyze}
                disabled={isButtonDisabled}
                className={`px-8 py-2 rounded-lg flex items-center justify-center text-lg font-semibold shadow-md transition-all duration-200 ${
                  isButtonDisabled
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-600 hover:to-violet-700'
                } text-white min-w-[180px]`}
              >
                {(isRunning || isEvaluating) ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Analyze'
                )}
              </button>
            </div>
            {successMessage && (
              <div className="mt-4 text-green-300 text-lg font-semibold">{successMessage}</div>
            )}
            {/* Feedback button for algorithm problems */}
            {lastEvaluationResult && (
              <div className="mt-4">
                <button
                  className="px-4 py-2 rounded-lg text-lg font-medium bg-violet-700 text-white hover:bg-violet-800 transition-all duration-200"
                  onClick={() => onShowFeedbackModal && onShowFeedbackModal(lastEvaluationResult)}
                >
                  Feedback
                </button>
              </div>
            )}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mt-4">
                <p className="text-red-200">{error}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 