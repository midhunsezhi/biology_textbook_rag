import React, { useState, useEffect } from 'react';
import { Container, Typography, Box } from '@mui/material';
import { questions } from './data/questions';
import Quiz from './components/Quiz';
import StartScreen from './components/StartScreen';
import EndScreen from './components/EndScreen';
import { getModelAnswer } from './utils/api';

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
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizEnded, setQuizEnded] = useState(false);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);

  useEffect(() => {
    if (quizStarted) {
      if (timeLeft > 0) {
        const timer = setInterval(() => {
          setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);
        return () => clearInterval(timer);
      } else if (timeLeft === 0) {
        setQuizEnded(true);
      }
    }
  }, [quizStarted, timeLeft]);

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setQuizEnded(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    setModelScore(0);
    setTimeLeft(20 * 60);
    setAnswers([]);
  };

  const handleNextQuestion = async (isCorrect: boolean, userAnswer: string) => {
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
  };

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
        />
      )}
    </Container>
  );
};

export default App;
