from openai import OpenAI
import csv
import pandas as pd
import nltk
import os
from dotenv import load_dotenv
import concurrent.futures

# Load environment variables from .env file
load_dotenv()

client = OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY"),
)
# Read the textbook content
with open('textbook.txt', 'r') as file:
    textbook_content = file.read()

# Split content into sentences
sentences = nltk.sent_tokenize(textbook_content)

# Group sentences into chunks
def create_chunks(sentences, max_tokens=1000):
    chunks = []
    current_chunk = ""
    for sentence in sentences:
        if len(current_chunk) + len(sentence) <= max_tokens:
            current_chunk += " " + sentence
        else:
            chunks.append(current_chunk.strip())
            current_chunk = sentence
    if current_chunk:
        chunks.append(current_chunk.strip())
    return chunks

chunks = create_chunks(sentences)

print(f"Number of chunks: {len(chunks)}")

# Function to generate embeddings
def get_embedding(text):
    print(f"generating embedding for: {text}")
    return client.embeddings.create(input = [text], model='text-embedding-3-small').data[0].embedding

max_workers = os.cpu_count() or 1  # Fallback to 1 if os.cpu_count() returns None

# Generate embeddings concurrently
def generate_embeddings_concurrently(chunks):
    embeddings = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
        future_to_chunk = {executor.submit(get_embedding, chunk): chunk for chunk in chunks}
        for future in concurrent.futures.as_completed(future_to_chunk):
            chunk = future_to_chunk[future]
            try:
                embedding = future.result()
                embeddings.append((chunk, embedding))
            except Exception as e:
                print(f"Chunk {chunk} generated an exception: {e}")
    return embeddings

# Generate embeddings
embeddings = generate_embeddings_concurrently(chunks)

# Write embeddings to a CSV file
with open('embeddings.csv', 'w', newline='') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(['chunk', 'embedding'])
    for chunk, embedding in embeddings:
        writer.writerow([chunk, embedding])
