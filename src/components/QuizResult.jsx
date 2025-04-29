// src/components/QuizResult.jsx

import React, { useEffect, useState, useCallback } from "react";
import { saveBestScore } from "../utils/storage";

const QuizResult = ({ quiz, selectedAnswers, onBack }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const calculateCorrectAnswers = useCallback(() => {
    return selectedAnswers.filter((ans) => {
      const question = quiz.questions[ans.questionIndex];
      return ans.selected === question.answer;
    }).length;
  }, [quiz.questions, selectedAnswers]);

  useEffect(() => {
    saveBestScore(quiz.title, calculateCorrectAnswers());

    setIsDarkMode(document.body.classList.contains("dark-mode"));
  }, [quiz.title, calculateCorrectAnswers]);

  const correctAnswers = calculateCorrectAnswers();
  const totalQuestions = quiz.questions.length;

  const correctBg = isDarkMode ? "#2e7d32" : "#d4edda"; // Dark green or light green
  const wrongBg = isDarkMode ? "#c62828" : "#f8d7da"; // Dark red or light red
  const correctText = isDarkMode ? "#a5d6a7" : "#155724";
  const wrongText = isDarkMode ? "#ef9a9a" : "#721c24";

  return (
    <div style={{ padding: "20px" }}>
      <h2>Quiz Result: {quiz.title}</h2>

      <h3 style={{ color: "#4CAF50" }}>
        You scored {correctAnswers} out of {totalQuestions}
      </h3>

      {quiz.questions.map((q, idx) => {
        const selected = selectedAnswers.find(
          (ans) => ans.questionIndex === idx
        );
        const isCorrect = selected?.selected === q.answer;

        return (
          <div
            key={idx}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
              backgroundColor: isCorrect ? correctBg : wrongBg,
              color: isCorrect ? correctText : wrongText,
              borderRadius: "5px",
            }}
          >
            <p>
              <strong>
                Q{idx + 1}: {q.question}
              </strong>
            </p>
            <p>Your Answer: {q.options[selected?.selected] || "No Answer"}</p>
            {!isCorrect && <p>Correct Answer: {q.options[q.answer]}</p>}
          </div>
        );
      })}

      <button onClick={onBack} style={{ marginTop: "20px" }}>
        Back to Quiz List
      </button>
    </div>
  );
};

export default QuizResult;
