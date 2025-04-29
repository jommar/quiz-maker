// src/components/QuizCreator.jsx

import React, { useState, useEffect } from 'react';
import { saveQuizzes, loadQuizzes } from '../utils/storage';

const QuizCreator = ({ onSave, quizData }) => {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const [config, setConfig] = useState({
    randomizeQuestions: true,
    randomizeOptions: true,
    showCorrectAnswersWhileAnswering: false,
  });

  useEffect(() => {
    if (quizData) {
      setTitle(quizData.title || '');
      setQuestions(quizData.questions || []);
      setConfig(quizData.config || {});
    }
  }, [quizData]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: '',
        options: ['', '', '', ''],
        answer: 0
      }
    ]);
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...questions];
    if (field === 'question') {
      updated[index].question = value;
    } else if (field.startsWith('option')) {
      const optionIndex = parseInt(field.replace('option', ''));
      updated[index].options[optionIndex] = value;
    } else if (field === 'answer') {
      updated[index].answer = parseInt(value);
    }
    setQuestions(updated);
  };

  const updateConfig = (field) => {
    setConfig({
      ...config,
      [field]: !config[field]
    });
  };

  const saveQuiz = () => {
    if (!title || questions.length === 0) {
      alert('Please provide a title and at least one question.');
      return;
    }

    const quiz = {
      title,
      questions,
      config
    };

    if (quizData && quizData.index !== undefined) {
      // If editing, pass quiz + index
      onSave(quiz, quizData.index);
    } else {
      // If creating new
      const existing = loadQuizzes();
      existing.push(quiz);
      saveQuizzes(existing);
      alert('Quiz saved!');
      onSave();
    }

    // Reset form only if creating new
    if (!quizData) {
      setTitle('');
      setQuestions([]);
      setConfig({
        randomizeQuestions: true,
        randomizeOptions: true,
        showCorrectAnswersWhileAnswering: false,
      });
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>{quizData ? 'Edit Quiz' : 'Create New Quiz'}</h2>

      <input
        type="text"
        placeholder="Quiz Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: '100%', marginBottom: '20px' }}
      />

      {/* CONFIG SETTINGS */}
      <div style={{ marginBottom: '20px' }}>
        <label>
          <input
            type="checkbox"
            checked={config.randomizeQuestions}
            onChange={() => updateConfig('randomizeQuestions')}
          />
          Randomize Questions
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            checked={config.randomizeOptions}
            onChange={() => updateConfig('randomizeOptions')}
          />
          Randomize Options
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            checked={config.showCorrectAnswersWhileAnswering}
            onChange={() => updateConfig('showCorrectAnswersWhileAnswering')}
          />
          Show Correct Answer Immediately
        </label>
      </div>

      {/* QUESTIONS */}
      {questions.map((q, idx) => (
        <div key={idx} style={{ marginBottom: '30px', padding: '10px', border: '1px solid #ccc' }}>
          <input
            type="text"
            placeholder={`Question ${idx + 1}`}
            value={q.question}
            onChange={(e) => updateQuestion(idx, 'question', e.target.value)}
            style={{ width: '100%', marginBottom: '10px' }}
          />
          {q.options.map((opt, optIdx) => (
            <input
              key={optIdx}
              type="text"
              placeholder={`Option ${optIdx + 1}`}
              value={opt}
              onChange={(e) => updateQuestion(idx, `option${optIdx}`, e.target.value)}
              style={{ width: '100%', marginBottom: '5px' }}
            />
          ))}
          <select
            value={q.answer}
            onChange={(e) => updateQuestion(idx, 'answer', e.target.value)}
            style={{ width: '100%', marginTop: '10px' }}
          >
            {q.options.map((opt, optIdx) => (
              <option key={optIdx} value={optIdx}>
                Correct Answer: {opt || `Option ${optIdx + 1}`}
              </option>
            ))}
          </select>
        </div>
      ))}

      <button onClick={addQuestion} style={{ marginRight: '10px' }}>
        Add Question
      </button>
      <button onClick={saveQuiz}>
        {quizData ? 'Save Changes' : 'Save Quiz'}
      </button>
    </div>
  );
};

export default QuizCreator;
