import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';

interface EndScreenProps {
  score: number;
  totalQuestions: number;
  onRestart: () => void;
}

const EndScreen: React.FC<EndScreenProps> = ({ score, totalQuestions, onRestart }) => {
  return (
    <Container>
      <Box textAlign="center" mt={8}>
        <Typography variant="h4" gutterBottom>
          Quiz Completed!
        </Typography>
        <Typography variant="h6" gutterBottom>
          Your Score: {score}/{totalQuestions}
        </Typography>
        <Button variant="contained" color="primary" onClick={onRestart} size="large">
          Restart Quiz
        </Button>
      </Box>
    </Container>
  );
};

export default EndScreen;
