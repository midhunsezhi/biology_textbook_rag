export const getModelAnswer = async (question: string, options: string[]): Promise<number> => {
  const response = await fetch('http://localhost:5000/get_answer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ question, options }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch model answer');
  }

  const data = await response.json();
  return data.correct_index;
};
