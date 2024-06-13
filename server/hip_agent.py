from openai import OpenAI
import pandas as pd
import numpy as np
from scipy.spatial.distance import cosine
import json
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()
class HIPAgent:
    def __init__(self):
        self.client = OpenAI(
            api_key=os.environ.get("OPENAI_API_KEY"),
        )
        self.embeddings_df = pd.read_csv("embeddings.csv")
        self.embeddings_df['embedding'] = self.embeddings_df['embedding'].apply(eval)

    def get_embedding(self, text):
        return self.client.embeddings.create(input = [text], model='text-embedding-3-small').data[0].embedding

    def find_relevant_context(self, question):
        question_embedding = self.get_embedding(question)
        embeddings = self.embeddings_df['embedding'].tolist()
        similarities = [1 - cosine(question_embedding, embedding) for embedding in embeddings]
        best_match_index = np.argmax(similarities)
        return self.embeddings_df.iloc[best_match_index]['chunk']

    def get_response(self, question, answer_choices):
        system_prompt = """
         You're an assistant trying to answer multiple choice questions on Biology based on provided context.
         You'll be given 4 options for each question and you have to select the correct one.
         Only use the provided context to answer the question.
         Your response should be the index of the correct option as a JSON object.

         Example1:

            Context: The Los Angeles Dodgers won the World Series in 2020.
            Question: Where was world series played?
            Options: Los Angeles, New York, Miami, Chicago
            
            Your response: {"correct_index": 0}

        Example2:
            
            Context: The Los Angeles Dodgers won the World Series in 2020.
            Question: Who won the world series in 2020?
            Options: New York Yankees, Los Angeles Dodgers, Miami Marlins, Chicago Cubs
            
            Your response: {"correct_index": 1}
        """
        context = self.find_relevant_context(question)

        response = self.client.chat.completions.create(
            model="gpt-3.5-turbo-0125",
            response_format={ "type": "json_object" },
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"""
                    Context: {context}
                    Question: {question}
                    Options: {', '.join(answer_choices)}
                """},
            ]
        )
        
        answer_content = response.choices[0].message.content

        try:
            answer_json = json.loads(answer_content)
            correct_index = answer_json['correct_index']
        except:
            correct_index = -1
        
        return correct_index
