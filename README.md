## Beat the model!

This is simple app that makes you compete with a model to answer some biological questions.

The frontend is a quiz app that asks you multiple choice questions and you have to answer them. The model also answers the questions and you can see how you perform against it at the end.

The model is a simple RAG system built using a [biology textbook](/server/textbook.txt) as the knowledge source.
It is served as an api using flask.


### Frontend

#### Setup instructions

```bash
cd frontend
npm install
npm run start
```

### Backend
#### Setup instructions
```bash
cd server
touch .env
echo "OPENAI_API_KEY=openai_key_here" > .env
python3 -m venv beat-the-model
source beat-the-model/bin/activate
pip install -r requirements.txt
python generate_embeddings.py # This will take a while
python app.py
```

To see how the embeddings were generated, check [this script](/server/generate_embeddings.py).
