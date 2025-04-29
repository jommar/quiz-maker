// src/utils/randomizer.js

export const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };
  
  export const shuffleOptionsInQuestions = (questions) => {
    return questions.map((q) => {
      const originalOptions = q.options.map((opt, index) => ({
        text: opt,
        index
      }));
  
      const shuffledOptions = shuffleArray(originalOptions);
  
      const newAnswerIndex = shuffledOptions.findIndex(opt => opt.index === q.answer);
  
      return {
        ...q,
        options: shuffledOptions.map(opt => opt.text),
        answer: newAnswerIndex
      };
    });
  };
  