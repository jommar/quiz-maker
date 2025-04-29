// src/components/QuizImportExport.jsx

import React, { useState, useEffect } from 'react';
import { loadQuizzes, saveQuizzes } from '../utils/storage';

const QuizImportExport = ({ onBack }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedIndexes, setSelectedIndexes] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    const loadedQuizzes = loadQuizzes();
    setQuizzes(loadedQuizzes);
  }, []);

  const handleSelectQuiz = (index) => {
    if (selectedIndexes.includes(index)) {
      setSelectedIndexes(selectedIndexes.filter((i) => i !== index));
    } else {
      setSelectedIndexes([...selectedIndexes, index]);
    }
  };

  const handleExport = () => {
    const selectedQuizzes = selectedIndexes.map((i) => quizzes[i]);
    setText(JSON.stringify({ quizzes: selectedQuizzes }));
  };

  const handleImport = () => {
    try {
      const parsed = JSON.parse(text);

      if (!parsed.quizzes || !Array.isArray(parsed.quizzes)) {
        alert('Invalid format! Expected a "quizzes" array.');
        return;
      }

      saveQuizzes(parsed.quizzes);
      alert('Quizzes imported successfully!');
      onBack();
    } catch (error) {
      alert('Invalid JSON! Please check your pasted text.');
    }
  };

  const toggleSelectAll = () => {
    if (selectedIndexes.length === quizzes.length) {
      // Deselect all
      setSelectedIndexes([]);
    } else {
      // Select all
      setSelectedIndexes(quizzes.map((_, idx) => idx));
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Import / Export Quizzes</h2>

      {/* New Select All and Selected Count */}
      <div style={{ marginBottom: '10px' }}>
        <button onClick={toggleSelectAll} style={{ marginRight: '10px' }}>
          {selectedIndexes.length === quizzes.length ? 'Deselect All' : 'Select All'}
        </button>
        <span>Selected {selectedIndexes.length} / {quizzes.length} quizzes</span>
      </div>

      {/* Quiz List */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {quizzes.map((quiz, idx) => (
          <li
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '8px 10px',
              border: '1px solid #ccc',
              borderRadius: '5px',
              marginBottom: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              gap: '10px',
            }}
          >
            <input
              type="checkbox"
              checked={selectedIndexes.includes(idx)}
              onChange={() => handleSelectQuiz(idx)}
              style={{
                flexShrink: 0,
                width: '18px',
                height: '18px',
              }}
            />
            <span style={{ fontSize: '1.1rem', flexGrow: 1 }}>
              {quiz.title}
            </span>
          </li>
        ))}
      </ul>

      {/* Export/Import Actions */}
      <button onClick={handleExport} style={{ marginBottom: '10px', marginRight: '10px' }}>
        Export Selected
      </button>

      <h4>Exported / Import JSON:</h4>
      <textarea
        style={{ width: '100%', height: '300px', marginBottom: '20px' }}
        value={text}
        onChange={(e) => setText(e.target.value)}
      ></textarea>

      <div>
        <button onClick={handleImport} style={{ marginRight: '10px' }}>
          Import Quizzes
        </button>
        <button onClick={onBack}>
          Back
        </button>
      </div>
    </div>
  );
};

export default QuizImportExport;
