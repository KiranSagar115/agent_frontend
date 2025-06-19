import React, { useState, useEffect } from 'react';
import { Code2, ChevronRight, AlertCircle, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import SolutionEvaluator from '../components/SolutionEvaluator';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const difficultyColors = {
  easy: 'from-emerald-400/20 to-green-500/20 text-emerald-400',
  medium: 'from-amber-400/20 to-yellow-500/20 text-amber-400',
  hard: 'from-rose-400/20 to-red-500/20 text-rose-400'
};

export default function ProblemsPage() {
  const [problems, setProblems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState(null); // 'code' or 'algorithm'
  const [selectedGrid, setSelectedGrid] = useState(null); // 'frontend' or 'backend'
  const [selectedDifficulty, setSelectedDifficulty] = useState(null); // 'easy', 'medium', 'hard'
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [difficultyFilter, setDifficultyFilter] = useState(null);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const params = new URLSearchParams();
        if (selectedType) params.append('problemType', selectedType);
        if (selectedGrid) params.append('gridType', selectedGrid);
        if (selectedDifficulty) params.append('difficulty', selectedDifficulty);

        const response = await axios.get(`${API_URL}/problems?${params}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setProblems(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching problems:', error);
        setError('Failed to load problems. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProblems();
  }, [selectedType, selectedGrid, selectedDifficulty]);

  const renderTypeSelection = () => (
    <div className="grid grid-cols-2 gap-8">
      <button
        onClick={() => setSelectedType('code')}
        className="group bg-gradient-to-br from-violet-600/20 to-purple-600/20 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-violet-400/30 transition-all duration-300 h-64 flex flex-col items-center justify-center hover:scale-[1.02] hover:shadow-lg hover:shadow-violet-500/20"
      >
        <Code2 className="w-16 h-16 text-violet-400 mb-6 group-hover:scale-110 transition-transform duration-300" />
        <h3 className="text-2xl font-semibold text-white mb-4">Code Problems</h3>
        <p className="text-white/60 text-lg text-center">Practice coding implementation problems</p>
      </button>
      <button
        onClick={() => setSelectedType('algorithm')}
        className="group bg-gradient-to-br from-cyan-600/20 to-blue-600/20 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-cyan-400/30 transition-all duration-300 h-64 flex flex-col items-center justify-center hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/20"
      >
        <Code2 className="w-16 h-16 text-cyan-400 mb-6 group-hover:scale-110 transition-transform duration-300" />
        <h3 className="text-2xl font-semibold text-white mb-4">Algorithm Problems</h3>
        <p className="text-white/60 text-lg text-center">Solve algorithmic challenges</p>
      </button>
    </div>
  );

  const renderGridSelection = () => (
    <div>
      <button
        onClick={() => setSelectedType(null)}
        className="mb-8 flex items-center text-white/60 hover:text-white text-lg transition-colors duration-300"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </button>
      <div className="grid grid-cols-2 gap-8">
        <button
          onClick={() => setSelectedGrid('frontend')}
          className="group bg-gradient-to-br from-violet-600/20 to-purple-600/20 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-violet-400/30 transition-all duration-300 h-64 flex flex-col items-center justify-center hover:scale-[1.02] hover:shadow-lg hover:shadow-violet-500/20"
        >
          <h3 className="text-2xl font-semibold text-white mb-4 group-hover:scale-105 transition-transform duration-300">Frontend</h3>
          <p className="text-white/60 text-lg text-center">Frontend development challenges</p>
        </button>
        <button
          onClick={() => setSelectedGrid('backend')}
          className="group bg-gradient-to-br from-cyan-600/20 to-blue-600/20 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-cyan-400/30 transition-all duration-300 h-64 flex flex-col items-center justify-center hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/20"
        >
          <h3 className="text-2xl font-semibold text-white mb-4 group-hover:scale-105 transition-transform duration-300">Backend</h3>
          <p className="text-white/60 text-lg text-center">Backend development challenges</p>
        </button>
      </div>
    </div>
  );

  const renderDifficultySelection = () => (
    <div>
      <button
        onClick={() => setSelectedGrid(null)}
        className="mb-8 flex items-center text-white/60 hover:text-white text-lg transition-colors duration-300"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </button>
      <div className="grid grid-cols-3 gap-8">
        {['easy', 'medium', 'hard'].map((difficulty) => (
          <button
            key={difficulty}
            onClick={() => setSelectedDifficulty(difficulty)}
            className={`group bg-gradient-to-br ${difficultyColors[difficulty]} backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-${difficulty === 'easy' ? 'emerald' : difficulty === 'medium' ? 'amber' : 'rose'}-400/30 transition-all duration-300 h-64 flex flex-col items-center justify-center hover:scale-[1.02] hover:shadow-lg hover:shadow-${difficulty === 'easy' ? 'emerald' : difficulty === 'medium' ? 'amber' : 'rose'}-500/20`}
          >
            <h3 className="text-2xl font-semibold text-white mb-4 group-hover:scale-105 transition-transform duration-300 capitalize">{difficulty}</h3>
            <p className="text-white/60 text-lg text-center">Level {difficulty} challenges</p>
          </button>
        ))}
      </div>
    </div>
  );

  const renderProblemList = () => (
    <div>
      <button
        onClick={() => setSelectedDifficulty(null)}
        className="mb-8 flex items-center text-white/60 hover:text-white text-lg transition-colors duration-300"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </button>
      {/* Difficulty Filter Buttons */}
      <div className="flex gap-4 mb-8 justify-center">
        {['easy', 'medium', 'hard'].map((level) => (
          <button
            key={level}
            onClick={() => setDifficultyFilter(difficultyFilter === level ? null : level)}
            className={`px-6 py-2 rounded-full font-semibold text-lg border transition-all duration-200 focus:outline-none ${
              difficultyFilter === level
                ? 'bg-gradient-to-r from-violet-500 to-cyan-500 text-white border-violet-400 shadow-lg'
                : 'bg-black/30 text-white/70 border-white/10 hover:bg-violet-700/40 hover:text-white'
            }`}
          >
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </button>
        ))}
      </div>
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
      >
        {isLoading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 animate-pulse h-48 border border-white/10"
              style={{ aspectRatio: '1 / 1' }}
            >
              <div className="h-8 bg-white/20 rounded-lg w-3/4"></div>
            </div>
          ))
        ) : (
          problems
            .filter((problem) => !difficultyFilter || problem.difficulty === difficultyFilter)
            .map((problem) => (
              <div
                key={problem._id}
                onClick={() => setSelectedProblem(problem)}
                className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-violet-400/30 transition-all duration-300 cursor-pointer hover:scale-[1.01] hover:shadow-lg hover:shadow-violet-500/20 flex flex-col justify-between h-48"
                style={{ aspectRatio: '1 / 1' }}
              >
                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-violet-300 transition-colors duration-300 line-clamp-2">{problem.title}</h3>
                  <div className="flex items-center space-x-4 mt-auto">
                    <span className={`text-base ${difficultyColors[problem.difficulty]}`}>
                      {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                    </span>
                    <span className="text-base text-white/60">
                      {problem.category}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-end mt-2">
                  <Code2 className="w-5 h-5 text-violet-400 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  <ChevronRight className="w-5 h-5 text-violet-400 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );

  const renderProblemDetail = () => (
    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-0 border border-white/10 flex flex-col md:flex-row overflow-hidden min-w-0 w-full">
      {/* Left: Problem description and test cases */}
      <div className="md:w-2/5 w-full p-10 border-r border-white/10 bg-black/10 min-w-0">
        <button
          onClick={() => setSelectedProblem(null)}
          className="flex items-center text-white/60 hover:text-white mb-6 text-lg transition-colors duration-300"
        >
          <ArrowLeft className="w-6 h-6 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
          Back to Problems
        </button>
        <h2 className="text-3xl font-bold text-white mb-6">{selectedProblem.title}</h2>
        <div className="prose prose-invert max-w-none">
          <p className="text-white/80 text-lg mb-8">{selectedProblem.description}</p>
          <div className="bg-gradient-to-br from-black/20 to-black/10 backdrop-blur-xl rounded-2xl p-6 mb-8 border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-4">Test Cases</h3>
            {selectedProblem.testCases.map((testCase, index) => (
              <div key={index} className="mb-6 last:mb-0">
                <p className="text-white/80 text-lg"><strong>Input:</strong> {testCase.input}</p>
                <p className="text-white/80 text-lg"><strong>Output:</strong> {testCase.output}</p>
                <p className="text-white/80 text-lg"><strong>Explanation:</strong> {testCase.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Right: Code editor/compiler */}
      <div className="md:w-3/5 w-full p-10 bg-gradient-to-br from-slate-900/80 to-cyan-900/80 flex flex-col justify-between min-w-0">
        <SolutionEvaluator 
          problem={selectedProblem}
          onShowFeedbackModal={(result) => { setEvaluationResult(result); setShowFeedbackModal(true); }}
        />
      </div>
    </div>
  );

  // Feedback modal rendering
  function renderFeedbackWithBold(text) {
    if (!text) return null;
    if (typeof text === 'string') {
      // Detect code block (triple backticks)
      const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
      let lastIndex = 0;
      const elements = [];
      let match;
      while ((match = codeBlockRegex.exec(text)) !== null) {
        // Text before code
        if (match.index > lastIndex) {
          const before = text.slice(lastIndex, match.index);
          if (before) elements.push(<span key={lastIndex}>{before.split(/(\*\*[^*]+\*\*)/g).map((part, i) => /^\*\*[^*]+\*\*$/.test(part) ? <strong key={i}>{part.replace(/\*\*/g, '')}</strong> : <span key={i}>{part.replace(/\*\*/g, '')}</span>)}</span>);
        }
        // Code block
        const lang = match[1] || '';
        const code = match[2];
        elements.push(
          <div key={match.index} className="my-4">
            <pre className="bg-[#181c24] text-green-200 rounded-xl p-4 overflow-x-auto text-sm font-mono border border-white/10" style={{lineHeight: '1.5', maxHeight: 300}}>
              <code className={`language-${lang}`}>{code}</code>
            </pre>
          </div>
        );
        lastIndex = match.index + match[0].length;
      }
      // Remaining text after last code block
      if (lastIndex < text.length) {
        const after = text.slice(lastIndex);
        if (after) elements.push(<span key={lastIndex + 'after'}>{after.split(/(\*\*[^*]+\*\*)/g).map((part, i) => /^\*\*[^*]+\*\*$/.test(part) ? <strong key={i}>{part.replace(/\*\*/g, '')}</strong> : <span key={i}>{part.replace(/\*\*/g, '')}</span>)}</span>);
      }
      return elements;
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

  function FeedbackModal() {
    if (!evaluationResult) return null;
    React.useEffect(() => {
      // Prevent background scroll
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }, []);
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setShowFeedbackModal(false)}>
        <div
          className="bg-purple-500 bg-opacity-100 max-w-6xl w-full mx-4 rounded-2xl p-8 shadow-2xl border border-violet-700/40 relative max-h-[90vh] overflow-y-auto"
          style={{ boxSizing: 'border-box' }}
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={() => setShowFeedbackModal(false)}
            className="absolute top-4 right-4 text-black text-2xl font-bold hover:text-violet-400 z-10 bg-black/40 rounded-full w-10 h-10 flex items-center justify-center"
            aria-label="Close"
          >
            &times;
          </button>
          <h4 className="text-2xl font-bold text-black mb-4">AI Feedback</h4>
          <div className="text-lg text-black leading-relaxed mb-4 whitespace-pre-wrap">
            {renderFeedbackWithBold(evaluationResult.feedback)}
          </div>
          {evaluationResult.complexity && (
            <div className="flex space-x-8 mb-4">
              <div className="bg-cyan-900/60 rounded-lg px-4 py-2 text-cyan-200 font-semibold">Time: {evaluationResult.complexity.time || 'N/A'}</div>
              <div className="bg-cyan-900/60 rounded-lg px-4 py-2 text-cyan-200 font-semibold">Space: {evaluationResult.complexity.space || 'N/A'}</div>
            </div>
          )}
          {evaluationResult.strengths && evaluationResult.strengths.length > 0 && (
            <div className="mb-4">
              <strong className="text-green-300">Strengths:</strong>
              <ul className="flex flex-wrap gap-2 mt-2">
                {evaluationResult.strengths.map((s, i) => (
                  <li key={i} className="bg-green-900/60 text-green-200 px-3 py-1 rounded-full text-base">{renderFeedbackWithBold(s)}</li>
                ))}
              </ul>
            </div>
          )}
          {evaluationResult.weaknesses && evaluationResult.weaknesses.length > 0 && (
            <div className="mb-4">
              <strong className="text-red-300">Weaknesses:</strong>
              <ul className="flex flex-wrap gap-2 mt-2">
                {evaluationResult.weaknesses.map((s, i) => (
                  <li key={i} className="bg-red-900/60 text-red-200 px-3 py-1 rounded-full text-base">{renderFeedbackWithBold(s)}</li>
                ))}
              </ul>
            </div>
          )}
          {evaluationResult.suggestions && evaluationResult.suggestions.length > 0 && (
            <div className="mb-4">
              <strong className="text-yellow-300">Suggestions:</strong>
              <ul className="list-disc ml-6 mt-2">
                {evaluationResult.suggestions.map((s, i) => (
                  <li key={i} className="mb-1 text-yellow-100">
                    {typeof s === 'string' ? renderFeedbackWithBold(s) : s && typeof s === 'object' ? (
                      <div>
                        {s.description && <div>{renderFeedbackWithBold(s.description)}</div>}
                        {s.code_snippet && (
                          <pre className="bg-black/60 text-green-200 rounded p-2 mt-1 overflow-x-auto"><code>{s.code_snippet}</code></pre>
                        )}
                      </div>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {typeof evaluationResult.accuracy === 'number' && (
            <div className="mt-4">
              <span className="inline-block bg-violet-700 text-white px-6 py-3 rounded-full text-xl font-bold shadow-lg">Accuracy Score: {evaluationResult.accuracy}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-900 to-cyan-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-pink-400/10 to-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-emerald-400/5 to-teal-600/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 pt-24 pb-8 px-2 w-[98vw] max-w-[1800px] mx-auto">
        <div className="relative w-full min-w-0 mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            {/* <h1 className="text-4xl font-bold text-white mb-4">Debug Battle</h1> */}
            <p className="text-white/80 text-xl">Choose your challenge and solve it!</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 backdrop-blur-sm border border-red-400/30 text-red-100 p-4 rounded-2xl shadow-lg animate-in slide-in-from-top-2 duration-300 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">{error}</span>
              </div>
            </div>
          )}

          {/* Navigation Steps */}
          {!selectedProblem && (
            <div className="mb-12">
              <div className="flex items-center justify-center space-x-8 mb-6">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all duration-300 ${
                  selectedType ? 'bg-gradient-to-r from-violet-600 to-purple-600 shadow-lg shadow-violet-500/30' : 'bg-white/10'
                }`}>
                  1
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all duration-300 ${
                  selectedGrid ? 'bg-gradient-to-r from-violet-600 to-purple-600 shadow-lg shadow-violet-500/30' : 'bg-white/10'
                }`}>
                  2
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all duration-300 ${
                  selectedDifficulty ? 'bg-gradient-to-r from-violet-600 to-purple-600 shadow-lg shadow-violet-500/30' : 'bg-white/10'
                }`}>
                  3
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          {selectedProblem ? (
            renderProblemDetail()
          ) : (
            <>
              {!selectedType && renderTypeSelection()}
              {selectedType && !selectedGrid && renderGridSelection()}
              {selectedType && selectedGrid && !selectedDifficulty && renderDifficultySelection()}
              {selectedType && selectedGrid && selectedDifficulty && renderProblemList()}
            </>
          )}
        </div>
      </div>

      {showFeedbackModal && <FeedbackModal />}
    </div>
  );
} 