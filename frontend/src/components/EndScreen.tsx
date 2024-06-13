import React from 'react';
import { Box, Typography, Button, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

interface AnswerRecord {
  question: string;
  userAnswer: string;
  modelAnswer: string;
  correctAnswer: string;
}

interface EndScreenProps {
  score: number;
  modelScore: number;
  totalQuestions: number;
  answers: AnswerRecord[];
  onRestart: () => void;
}

const EndScreen: React.FC<EndScreenProps> = ({ score, modelScore, totalQuestions, answers, onRestart }) => {
  const didUserBeatModel = score > modelScore;

  return (
    <Container>
      <Box textAlign="center" mt={8}>
        <Typography variant="h4" gutterBottom>
          Quiz Completed!
        </Typography>
        <Typography variant="h6" gutterBottom>
          Your Score: {score}/{totalQuestions}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Model's Score: {modelScore}/{totalQuestions}
        </Typography>
        <Typography variant="h6" gutterBottom color={didUserBeatModel ? 'green' : 'red'}>
          {didUserBeatModel ? 'Congratulations! You beat the model! 🎉' : 'Oh no! The model outsmarted you this time. 🤖'}
        </Typography>
        <TableContainer component={Paper} sx={{ mt: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Question</TableCell>
                <TableCell>User Answer</TableCell>
                <TableCell>Model Answer</TableCell>
                <TableCell>Correct Answer</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {answers.map((answer, index) => (
                <TableRow key={index}>
                  <TableCell>{answer.question}</TableCell>
                  <TableCell>{answer.userAnswer}</TableCell>
                  <TableCell>{answer.modelAnswer}</TableCell>
                  <TableCell>{answer.correctAnswer}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Button variant="contained" color="primary" onClick={onRestart} size="large" sx={{ mt: 4 }}>
          Restart Quiz
        </Button>
      </Box>
    </Container>
  );
};

export default EndScreen;
