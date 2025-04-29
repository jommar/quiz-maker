// src/utils/storage.js

// Quizzes
export const saveQuizzes = (quizzes) => {
    localStorage.setItem('quizzes', JSON.stringify(quizzes));
  };
  
  export const loadQuizzes = () => {
    const data = localStorage.getItem('quizzes');
    return data ? JSON.parse(data) : [];
  };
  
  export const clearQuizzes = () => {
    localStorage.removeItem('quizzes');
  };
  
  // Best Scores
  export const saveBestScore = (quizTitle, score) => {
    const data = localStorage.getItem('bestScores');
    const bestScores = data ? JSON.parse(data) : {};
  
    // Save only if new score is higher
    if (!bestScores[quizTitle] || score > bestScores[quizTitle]) {
      bestScores[quizTitle] = score;
      localStorage.setItem('bestScores', JSON.stringify(bestScores));
    }
  };
  
  export const loadBestScores = () => {
    const data = localStorage.getItem('bestScores');
    return data ? JSON.parse(data) : {};
  };
  
  export const clearBestScores = () => {
    localStorage.removeItem('bestScores');
  };
  