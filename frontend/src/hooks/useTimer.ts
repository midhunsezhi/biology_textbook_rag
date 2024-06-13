import { useState, useEffect } from 'react';

export const useTimer = (initialTime: number, quizStarted: boolean, quizEnded: boolean) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (quizStarted) {
      setTimeLeft(initialTime);
    }
  }, [initialTime, quizStarted]);

  useEffect(() => {
    if (quizStarted && !quizEnded && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [quizStarted, quizEnded, timeLeft]);

  return timeLeft;
};
