import React, { useState } from 'react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function SolutionEvaluator({ problem, onEvaluationComplete }) {
  const [solution, setSolution] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    try {
      setIsEvaluating(true);
      setError(null);
      setEvaluationResult(null);

      console.log('Submitting solution:', {
        problemId: problem._id,
        problemType: problem.problemType,
        gridType: problem.gridType
      });

      const response = await axios.post(`${API_URL}/problems/evaluate`, {
        problemId: problem._id,
        solution: solution,
        problemType: problem.problemType,
        gridType: problem.gridType
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      console.log('Received evaluation response:', response.data);
      setEvaluationResult(response.data);
      if (onEvaluationComplete) {
        onEvaluationComplete(response.data);
      }
    } catch (error) {
      console.error('Evaluation error:', error);
      console.error('Error response:', error.response?.data);
      setError(
        error.response?.data?.message || 
        error.response?.data?.error || 
        error.message || 
        'Failed to evaluate solution'
      );
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-black/20 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-2">Your Solution</h3>
        <textarea
          value={solution}
          onChange={(e) => setSolution(e.target.value)}
          className="w-full h-48 bg-black/40 text-white p-4 rounded-lg font-mono"
          placeholder="Write your solution here..."
        />
        <button
          onClick={handleSubmit}
          disabled={isEvaluating || !solution.trim()}
          className={`mt-4 px-6 py-2 rounded-lg flex items-center justify-center ${
            isEvaluating || !solution.trim()
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-700'
          } text-white min-w-[150px]`}
        >
          {isEvaluating ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            'Submit Solution'
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
          <p className="text-red-200">{error}</p>
        </div>
      )}

      {isEvaluating && (
        <div className="bg-black/20 rounded-lg p-8 text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-12 h-12 text-purple-400 animate-spin" />
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-white">Analyzing Your Solution</h3>
              <p className="text-gray-300">Please wait while we evaluate your algorithm...</p>
            </div>
            <div className="w-full max-w-md h-2 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full animate-pulse" style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>
      )}

      {evaluationResult && !isEvaluating && (
        <div className="bg-black/20 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Algorithm Analysis</h3>
          
          {/* Accuracy Score */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300">Accuracy Score</span>
              <span className="text-2xl font-bold text-white">{evaluationResult.accuracy}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div 
                className="h-2.5 rounded-full transition-all duration-500"
                style={{ 
                  width: `${evaluationResult.accuracy}%`,
                  backgroundColor: evaluationResult.accuracy >= 80 ? '#22c55e' : 
                                 evaluationResult.accuracy >= 60 ? '#eab308' : '#ef4444'
                }}
              />
            </div>
          </div>

          {/* Complexity Analysis */}
          {evaluationResult.complexity && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-white mb-2">Complexity Analysis</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="text-purple-400 mb-1">Time Complexity</h5>
                  <p className="text-gray-300">{evaluationResult.complexity.time}</p>
                </div>
                <div className="bg-black/30 rounded-lg p-4">
                  <h5 className="text-purple-400 mb-1">Space Complexity</h5>
                  <p className="text-gray-300">{evaluationResult.complexity.space}</p>
                </div>
              </div>
            </div>
          )}

          {/* Strengths and Weaknesses */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {evaluationResult.strengths && evaluationResult.strengths.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Strengths</h4>
                <ul className="space-y-2">
                  {evaluationResult.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-400 mr-2">✓</span>
                      <span className="text-gray-300">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {evaluationResult.weaknesses && evaluationResult.weaknesses.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Areas for Improvement</h4>
                <ul className="space-y-2">
                  {evaluationResult.weaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-yellow-400 mr-2">!</span>
                      <span className="text-gray-300">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Detailed Feedback */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-white mb-2">Detailed Analysis</h4>
            <div className="bg-black/30 rounded-lg p-4">
              <p className="text-gray-300 whitespace-pre-wrap">{evaluationResult.feedback}</p>
            </div>
          </div>

          {/* Suggestions */}
          {evaluationResult.suggestions && evaluationResult.suggestions.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">Improvement Suggestions</h4>
              <ul className="space-y-2">
                {evaluationResult.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-purple-400 mr-2">•</span>
                    <span className="text-gray-300">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 