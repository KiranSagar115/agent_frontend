import React, { useState, useEffect } from 'react';
import { Code2, ChevronRight, AlertCircle, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import SolutionEvaluator from '../components/SolutionEvaluator';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const difficultyColors = {
  easy: 'text-green-400',
  medium: 'text-yellow-400',
  hard: 'text-red-400'
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
        className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 hover:border-purple-500/50 transition-all h-64 flex flex-col items-center justify-center"
      >
        <Code2 className="w-16 h-16 text-purple-400 mb-6" />
        <h3 className="text-2xl font-semibold text-white mb-4">Code Problems</h3>
        <p className="text-gray-300 text-lg text-center">Practice coding implementation problems</p>
      </button>
      <button
        onClick={() => setSelectedType('algorithm')}
        className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 hover:border-purple-500/50 transition-all h-64 flex flex-col items-center justify-center"
      >
        <Code2 className="w-16 h-16 text-purple-400 mb-6" />
        <h3 className="text-2xl font-semibold text-white mb-4">Algorithm Problems</h3>
        <p className="text-gray-300 text-lg text-center">Solve algorithmic challenges</p>
      </button>
    </div>
  );

  const renderGridSelection = () => (
    <div className="grid grid-cols-2 gap-8">
      <button
        onClick={() => setSelectedGrid('frontend')}
        className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 hover:border-purple-500/50 transition-all h-64 flex flex-col items-center justify-center"
      >
        <h3 className="text-2xl font-semibold text-white mb-4">Frontend</h3>
        <p className="text-gray-300 text-lg text-center">Frontend development challenges</p>
      </button>
      <button
        onClick={() => setSelectedGrid('backend')}
        className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 hover:border-purple-500/50 transition-all h-64 flex flex-col items-center justify-center"
      >
        <h3 className="text-2xl font-semibold text-white mb-4">Backend</h3>
        <p className="text-gray-300 text-lg text-center">Backend development challenges</p>
      </button>
    </div>
  );

  const renderDifficultySelection = () => (
    <div className="grid grid-cols-3 gap-8">
      {['easy', 'medium', 'hard'].map((difficulty) => (
        <button
          key={difficulty}
          onClick={() => setSelectedDifficulty(difficulty)}
          className={`bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 hover:border-purple-500/50 transition-all h-64 flex flex-col items-center justify-center ${difficultyColors[difficulty]}`}
        >
          <h3 className="text-2xl font-semibold mb-4 capitalize">{difficulty}</h3>
          <p className="text-gray-300 text-lg text-center">Level {difficulty} challenges</p>
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
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 animate-pulse h-32"
          >
            <div className="h-8 bg-white/20 rounded w-3/4"></div>
          </div>
        ))
      ) : (
        problems.map((problem) => (
          <div
            key={problem._id}
            onClick={() => setSelectedProblem(problem)}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:border-purple-500/50 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-3">{problem.title}</h3>
                <div className="flex items-center space-x-6">
                  <span className={`text-base ${difficultyColors[problem.difficulty]}`}>
                    {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                  </span>
                  <span className="text-base text-gray-400">
                    {problem.category}
                  </span>
                </div>
              </div>
              <div className="flex items-center">
                <Code2 className="w-6 h-6 text-purple-400 mr-3" />
                <ChevronRight className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );

  const renderProblemDetail = () => (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
      <button
        onClick={() => setSelectedProblem(null)}
        className="flex items-center text-gray-300 hover:text-white mb-6 text-lg"
      >
        <ArrowLeft className="w-6 h-6 mr-2" />
        Back to Problems
      </button>
      <h2 className="text-3xl font-bold text-white mb-6">{selectedProblem.title}</h2>
      <div className="prose prose-invert max-w-none">
        <p className="text-gray-300 text-lg mb-8">{selectedProblem.description}</p>
        <div className="bg-black/20 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Test Cases</h3>
          {selectedProblem.testCases.map((testCase, index) => (
            <div key={index} className="mb-6 last:mb-0">
              <p className="text-gray-300 text-lg"><strong>Input:</strong> {testCase.input}</p>
              <p className="text-gray-300 text-lg"><strong>Output:</strong> {testCase.output}</p>
              <p className="text-gray-300 text-lg"><strong>Explanation:</strong> {testCase.explanation}</p>
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 pt-36 pb-8 px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          {/* <h1 className="text-4xl font-bold text-white mb-4">Debug Battle</h1> */}
          <p className="text-gray-300  text-xl">Choose your challenge and solve it!</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-6 mb-8 flex items-center">
            <AlertCircle className="w-6 h-6 text-red-400 mr-3" />
            <p className="text-red-200 text-lg">{error}</p>
          </div>
        )}

        {/* Navigation Steps */}
        {!selectedProblem && (
          <div className="mb-12">
            <div className="flex items-center justify-center space-x-8 mb-6">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${selectedType ? 'bg-purple-600' : 'bg-white/20'}`}>
                1
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${selectedGrid ? 'bg-purple-600' : 'bg-white/20'}`}>
                2
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${selectedDifficulty ? 'bg-purple-600' : 'bg-white/20'}`}>
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
  );
} 