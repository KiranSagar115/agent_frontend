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
  );

  const renderDifficultySelection = () => (
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
  );

  const renderProblemList = () => (
    <div className="space-y-6">
      {isLoading ? (
        Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 animate-pulse h-32 border border-white/10"
          >
            <div className="h-8 bg-white/20 rounded-lg w-3/4"></div>
          </div>
        ))
      ) : (
        problems.map((problem) => (
          <div
            key={problem._id}
            onClick={() => setSelectedProblem(problem)}
            className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-violet-400/30 transition-all duration-300 cursor-pointer hover:scale-[1.01] hover:shadow-lg hover:shadow-violet-500/20"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-violet-300 transition-colors duration-300">{problem.title}</h3>
                <div className="flex items-center space-x-6">
                  <span className={`text-base ${difficultyColors[problem.difficulty]}`}>
                    {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                  </span>
                  <span className="text-base text-white/60">
                    {problem.category}
                  </span>
                </div>
              </div>
              <div className="flex items-center">
                <Code2 className="w-6 h-6 text-violet-400 mr-3 group-hover:scale-110 transition-transform duration-300" />
                <ChevronRight className="w-6 h-6 text-violet-400 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );

  const renderProblemDetail = () => (
    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
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
        <SolutionEvaluator 
          problem={selectedProblem}
          onEvaluationComplete={(result) => {
            console.log('Evaluation complete:', result);
          }}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-900 to-cyan-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-pink-400/10 to-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-emerald-400/5 to-teal-600/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 pt-36 pb-8 px-8">
        <div className="max-w-6xl mx-auto">
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
    </div>
  );
} 