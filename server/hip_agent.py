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
         You are an assistant tasked with answering multiple choice questions on Biology using the provided context.
         For each question, you will be given four options, and you must select the correct one based on the context. 
         Evaluate all options thoroughly to determine the most accurate answer. If only one option is correct, select it. If multiple options are correct, select the most comprehensive option, if available (e.g., 'Both A and C').
         Your response should be formatted as a JSON object indicating the index of the correct option and reason.

        Example1:
            Context: The mitochondria is the powerhouse of the cell.
            Question: What is the powerhouse of the cell?
            Options: Nucleus, Mitochondria, Ribosome, Golgi apparatus

            Your response: {"correct_index": 1, "reason": "The mitochondria is known as the powerhouse of the cell."}
          
        Example2:
            
            Context: The five senses are sight, smell, taste, touch, and hearing.
            Question: Which of the following are considered as traditional human senses?
            Options: Sight, pain, Taste, Both A and C

            Your response: {"correct_index": 3, "reason": "Sight and Taste are considered human senses."}

         
        Example3:
            Context: types of blood cells include red blood cells, white blood cells, and platelets.
            Question: Which of the following are types of blood cells?
            Options: Red blood cells, Neurons, crap, Both A and C

            Your response: {"correct_index": 0, reason: "only red blood cells are types of blood cells among the options provided."}
        """

        context = self.find_relevant_context(question)

        response = self.client.chat.completions.create(
            model="gpt-3.5-turbo-0125",
            response_format={ "type": "json_object" },
            temperature=0,
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
