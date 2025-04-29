// src/components/QuizList.jsx

import React, { useEffect, useState } from 'react';
import { loadQuizzes, saveQuizzes, loadBestScores, clearBestScores } from '../utils/storage';

const QuizList = ({ onSelectQuiz, onEditQuiz }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [bestScores, setBestScores] = useState({});

  useEffect(() => {
    refreshQuizzes();
  }, []);

  const refreshQuizzes = () => {
    setQuizzes(loadQuizzes());
    setBestScores(loadBestScores());
  };

  const handleDelete = (index) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this quiz?');
    if (!confirmDelete) return;

    const updatedQuizzes = [...quizzes];
    updatedQuizzes.splice(index, 1);
    saveQuizzes(updatedQuizzes);
    refreshQuizzes();
  };

  const handleClearBestScores = () => {
    const confirmClear = window.confirm('Are you sure you want to clear ALL best scores?');
    if (!confirmClear) return;

    clearBestScores();
    refreshQuizzes();
    alert('All best scores have been cleared.');
  };

  const handleClearBestScoreForQuiz = (quizTitle) => {
    const confirmClear = window.confirm(`Clear best score for "${quizTitle}"?`);
    if (!confirmClear) return;

    const data = localStorage.getItem('bestScores');
    if (!data) return;

    const bestScores = JSON.parse(data);
    delete bestScores[quizTitle];
    localStorage.setItem('bestScores', JSON.stringify(bestScores));
    refreshQuizzes();
    alert(`Best score for "${quizTitle}" has been cleared.`);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Select a Quiz</h2>

      <button
        onClick={handleClearBestScores}
        style={{
          backgroundColor: '#ff9800',
          color: 'white',
          border: 'none',
          padding: '8px 15px',
          marginBottom: '20px',
          cursor: 'pointer'
        }}
      >
        Clear All Best Scores
      </button>

      {quizzes.length === 0 && <p>No quizzes found. Please create one!</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {quizzes.map((quiz, idx) => (
          <li
            key={idx}
            style={{
              border: '1px solid #ccc',
              marginBottom: '10px',
              padding: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}
          >
            <div style={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => onSelectQuiz(idx)}>
              {quiz.title}
              {bestScores[quiz.title] !== undefined && (
                <div style={{ fontSize: '0.8rem', color: 'green' }}>
                  Best Score: {bestScores[quiz.title]} / {quiz.questions.length}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
              {bestScores[quiz.title] !== undefined && (
                <button
                  onClick={() => handleClearBestScoreForQuiz(quiz.title)}
                  style={{
                    backgroundColor: '#ff5722',
                    color: 'white',
                    border: 'none',
                    padding: '5px 8px',
                    cursor: 'pointer'
                  }}
                >
                  Clear Score
                </button>
              )}
              <button
                onClick={() => onEditQuiz(idx)}
                style={{
                  backgroundColor: '#2196f3',
                  color: 'white',
                  border: 'none',
                  padding: '5px 10px',
                  cursor: 'pointer'
                }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(idx)}
                style={{
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  padding: '5px 10px',
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuizList;
