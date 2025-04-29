import React, { useState, useEffect } from 'react';
import QuizCreator from './components/QuizCreator';
import QuizList from './components/QuizList';
import QuizTaker from './components/QuizTaker';
import QuizImportExport from './components/QuizImportExport';
import { loadQuizzes, saveQuizzes } from './utils/storage';

function App() {
  const [page, setPage] = useState('list');
  const [selectedQuizIndex, setSelectedQuizIndex] = useState(null);
  const [editQuizData, setEditQuizData] = useState(null);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    // Default to dark mode
    document.body.classList.add('dark-mode');
  }, []);

  const toggleTheme = () => {
    if (theme === 'dark') {
      document.body.classList.remove('dark-mode');
      document.body.classList.add('light-mode');
      setTheme('light');
    } else {
      document.body.classList.remove('light-mode');
      document.body.classList.add('dark-mode');
      setTheme('dark');
    }
  };

  const handleSelectQuiz = (index) => {
    setSelectedQuizIndex(index);
    setPage('take');
  };

  const handleEditQuiz = (index) => {
    const quizzes = loadQuizzes();
    setEditQuizData({ ...quizzes[index], index });
    setPage('edit');
  };

  const handleSaveEditedQuiz = (updatedQuiz, index) => {
    const quizzes = loadQuizzes();
    quizzes[index] = updatedQuiz;
    saveQuizzes(quizzes);
    alert('Quiz updated successfully!');
    setEditQuizData(null);
    setPage('list');
  };

  const handleBack = () => {
    setSelectedQuizIndex(null);
    setEditQuizData(null);
    setPage('list');
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* THEME TOGGLE */}
      <div style={{ marginBottom: '20px' }}>
        <button onClick={toggleTheme}>
          Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
        </button>
      </div>

      {/* PAGE NAVIGATION */}
      {(page === 'list' || page === 'create') && (
        <div style={{ marginBottom: '20px' }}>
          <button onClick={() => setPage('list')} style={{ marginRight: '10px' }}>
            Quiz List
          </button>
          <button onClick={() => { setEditQuizData(null); setPage('create'); }} style={{ marginRight: '10px' }}>
            Create Quiz
          </button>
          <button onClick={() => setPage('importexport')}>
            Import / Export
          </button>
        </div>
      )}

      {/* PAGES */}
      {page === 'list' && <QuizList onSelectQuiz={handleSelectQuiz} onEditQuiz={handleEditQuiz} />}
      {page === 'create' && <QuizCreator onSave={() => setPage('list')} />}
      {page === 'edit' && <QuizCreator quizData={editQuizData} onSave={handleSaveEditedQuiz} />}
      {page === 'take' && <QuizTaker quizIndex={selectedQuizIndex} onBack={handleBack} />}
      {page === 'importexport' && <QuizImportExport onBack={() => setPage('list')} />}
    </div>
  );
}

export default App;
