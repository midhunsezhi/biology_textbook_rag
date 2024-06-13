import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Question } from '../types';

interface QuizProps {
  question: Question;
  onNext: (isCorrect: boolean, userAnswer: string) => Promise<void>;
}

const Quiz: React.FC<QuizProps> = ({ question, onNext }) => {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

  const handleChoiceSelect = (choice: string) => {
    setSelectedChoice(choice);
  };

  const handleNext = async () => {
    if (selectedChoice !== null) {
      const isCorrect = selectedChoice === question.correctAnswer;
      await onNext(isCorrect, selectedChoice);
      setSelectedChoice(null);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>{question.question}</Typography>
      {question.choices.map((choice, index) => (
        <Button
          key={index}
          variant={selectedChoice === choice ? 'contained' : 'outlined'}
          color="primary"
          onClick={() => handleChoiceSelect(choice)}
          fullWidth
          sx={{ mb: 1 }}
        >
          {choice}
        </Button>
      ))}
      <Button
        variant="contained"
        color="secondary"
        onClick={handleNext}
        disabled={selectedChoice === null}
      >
        Next
      </Button>
    </Box>
  );
};

export default Quiz;
