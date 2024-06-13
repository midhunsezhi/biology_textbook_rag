import React, { useState, useEffect, useCallback } from 'react';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import { questions as allQuestions } from './data/questions';
import Quiz from './components/Quiz';
import StartScreen from './components/StartScreen';
import EndScreen from './components/EndScreen';
import { getModelAnswer } from './utils/api';
import { useTimer } from './hooks/useTimer';

interface AnswerRecord {
  question: string;
  userAnswer: string;
  modelAnswer: string;
  correctAnswer: string;
}

const App: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [modelScore, setModelScore] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizEnded, setQuizEnded] = useState(false);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState(allQuestions);

  const timePerQuestion = 60; // 1 minute per question
  const initialTime = questions.length * timePerQuestion; // initial time based on number of questions
  const timeLeft = useTimer(initialTime, quizStarted, quizEnded);

  useEffect(() => {
    if (quizStarted && timeLeft === 0) {
      setQuizEnded(true);
    }
  }, [quizStarted, timeLeft]);

  const handleStartQuiz = useCallback(() => {
    // Randomly select 5 questions from allQuestions
    const shuffledQuestions = allQuestions.sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffledQuestions.slice(0, 5);
    setQuestions(selectedQuestions);
    setQuizStarted(true);
    setQuizEnded(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    setModelScore(0);
    setAnswers([]);
  }, []);

  const handleNextQuestion = useCallback(async (isCorrect: boolean, userAnswer: string) => {
    setLoading(true);
    const question = questions[currentQuestionIndex];
    const modelAnswerIndex = await getModelAnswer(question.question, question.choices);
    const modelAnswer = question.choices[modelAnswerIndex];
    const isModelCorrect = modelAnswer === question.correctAnswer;

    setAnswers((prevAnswers) => [
      ...prevAnswers,
      {
        question: question.question,
        userAnswer,
        modelAnswer,
        correctAnswer: question.correctAnswer,
      },
    ]);

    if (isCorrect) {
      setScore(score + 1);
    }
    if (isModelCorrect) {
      setModelScore(modelScore + 1);
    }
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizEnded(true);
    }
    setLoading(false);
  }, [currentQuestionIndex, modelScore, questions, score]);

  if (!quizStarted) {
    return <StartScreen onStart={handleStartQuiz} />;
  }

  if (quizEnded) {
    return <EndScreen score={score} modelScore={modelScore} totalQuestions={questions.length} answers={answers} onRestart={handleStartQuiz} />;
  }

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h6">Score: {score}/{questions.length}</Typography>
        <Typography variant="h6">
          Time Left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
        </Typography>
        <Typography variant="h6">
          Questions Left: {questions.length - currentQuestionIndex}
        </Typography>
      </Box>
      {currentQuestionIndex < questions.length && (
        <Quiz
          question={questions[currentQuestionIndex]}
          onNext={(isCorrect, userAnswer) => handleNextQuestion(isCorrect, userAnswer)}
          loading={loading}
        />
      )}
    </Container>
  );
};

export default App;
