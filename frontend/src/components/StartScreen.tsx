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
          Welcome to Hippocratic's Beat the Model!
        </Typography>
        <Typography variant="h6" gutterBottom>
          Test your knowledge against our super-smart AI model. Can you beat it?
          Answer the questions and see if you can outsmart the machine!
        </Typography>
        <Button variant="contained" color="primary" onClick={onStart} size="large" sx={{ mt: 4 }}>
          Start Quiz
        </Button>
      </Box>
    </Container>
  );
};

export default StartScreen;
