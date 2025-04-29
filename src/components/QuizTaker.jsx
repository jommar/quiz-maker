// src/components/QuizTaker.jsx

import React, { useState, useEffect, useCallback } from "react";
import { loadQuizzes } from "../utils/storage";
import QuizResult from "./QuizResult";
import { shuffleArray, shuffleOptionsInQuestions } from "../utils/randomizer";

const QuizTaker = ({ quizIndex, onBack }) => {
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);

  const startQuiz = useCallback(() => {
    const quizzes = loadQuizzes();
    const selectedQuiz = quizzes[quizIndex];
    setQuiz(selectedQuiz);

    let finalQuestions = [...selectedQuiz.questions];

    if (selectedQuiz.config.randomizeQuestions) {
      finalQuestions = shuffleArray(finalQuestions);
    }

    if (selectedQuiz.config.randomizeOptions) {
      finalQuestions = shuffleOptionsInQuestions(finalQuestions);
    }

    setQuestions(finalQuestions);
    setCurrentQuestionIndex(0);
    setSelectedAnswers(Array(finalQuestions.length).fill(null));
    setShowResult(false);
  }, [quizIndex]);

  useEffect(() => {
    startQuiz();
  }, [startQuiz]);

  const handleAnswer = (selectedOptionIndex) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[currentQuestionIndex] = {
      questionIndex: currentQuestionIndex,
      selected: selectedOptionIndex,
    };
    setSelectedAnswers(updatedAnswers);

    // Immediately move to next question after answering
    setTimeout(() => {
      if (currentQuestionIndex + 1 < questions.length) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // All questions answered, check if ready to finish
        if (updatedAnswers.every((ans) => ans !== null)) {
          setShowResult(true);
        }
      }
    }, 300); // small delay to show button color change (optional)
  };

  const nextQuestion = () => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Finish the quiz
      if (selectedAnswers.every((ans) => ans !== null)) {
        setShowResult(true);
      } else {
        alert("Please answer all questions first!");
      }
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = selectedAnswers[currentQuestionIndex];

  if (!quiz || questions.length === 0) return <div>Loading...</div>;

  if (showResult) {
    return (
      <QuizResult
        quiz={{ ...quiz, questions }}
        selectedAnswers={selectedAnswers}
        onBack={onBack}
      />
    );
  }

  const isCorrect = currentAnswer?.selected === currentQuestion.answer;

  return (
    <div style={{ padding: "20px" }}>
      <h2>{quiz.title}</h2>
      <h4>
        Question {currentQuestionIndex + 1} of {questions.length}
      </h4>

      <div style={{ marginBottom: "20px" }}>
        <p style={{ fontWeight: "bold" }}>{currentQuestion.question}</p>

        {currentQuestion.options.map((opt, idx) => {
          const isSelected = currentAnswer?.selected === idx;
          const isCorrectAnswer = idx === currentQuestion.answer;

          let backgroundColor = "";
          if (isSelected) {
            if (
              quiz.config.showCorrectAnswersWhileAnswering &&
              currentAnswer &&
              !isCorrect
            ) {
              backgroundColor = isCorrectAnswer ? "#4caf50" : "#f44336"; // Green correct, Red wrong
            } else {
              backgroundColor = "#2196f3"; // Blue selected
            }
          } else if (
            quiz.config.showCorrectAnswersWhileAnswering &&
            currentAnswer &&
            !isCorrect &&
            isCorrectAnswer
          ) {
            backgroundColor = "#4caf50"; // Green for correct answer
          }

          return (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              style={{
                display: "block",
                width: "100%",
                marginBottom: "10px",
                padding: "10px",
                cursor: "pointer",
                backgroundColor,
              }}
            >
              {opt}
            </button>
          );
        })}

        {/* Show feedback if answered wrong */}
        {currentAnswer &&
          !isCorrect &&
          quiz.config.showCorrectAnswersWhileAnswering && (
            <div
              style={{
                marginTop: "10px",
                padding: "10px",
                backgroundColor: "#fff3cd",
                border: "1px solid #ffeeba",
                color: "#856404",
              }}
            >
              Wrong Answer! Correct Answer:{" "}
              <strong>{currentQuestion.options[currentQuestion.answer]}</strong>
            </div>
          )}
      </div>

      <div style={{ marginTop: "20px" }}>
        {currentQuestionIndex > 0 && (
          <button onClick={previousQuestion} style={{ marginRight: "10px" }}>
            Previous
          </button>
        )}
        <button onClick={nextQuestion} style={{ marginRight: "10px" }}>
          {currentQuestionIndex + 1 === questions.length
            ? "Finish Quiz"
            : "Next"}
        </button>
        <button onClick={startQuiz} style={{ marginRight: "10px" }}>
          Restart Quiz
        </button>
        <button onClick={onBack}>Back to Quiz List</button>
      </div>
    </div>
  );
};

export default QuizTaker;
