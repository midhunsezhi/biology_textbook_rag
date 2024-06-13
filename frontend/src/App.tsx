import React from 'react';
import { Button, Container, Typography } from '@mui/material';

const App: React.FC = () => {
  return (
    <Container>
      <Typography variant="h1" component="h2" gutterBottom>
        Welcome to MUI with Create React App and TypeScript
      </Typography>
      <Button variant="contained" color="primary">
        Hello World
      </Button>
    </Container>
  );
};

export default App;
