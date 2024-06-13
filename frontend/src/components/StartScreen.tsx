import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <Container>
      <Box textAlign="center" mt={8}>
        <Typography variant="h2" gutterBottom>
          Welcome to the Hippocratic Quiz!
        </Typography>
        <Typography variant="h6" gutterBottom>
          Test your knowledge and see how many questions you can answer correctly.
        </Typography>
        <Button variant="contained" color="primary" onClick={onStart} size="large">
          Start Quiz
        </Button>
      </Box>
    </Container>
  );
};

export default StartScreen;
