from flask import Flask, request, jsonify
from hip_agent import HIPAgent

app = Flask(__name__)
hip_agent = HIPAgent()

@app.route('/get_answer', methods=['POST'])
def get_answer():
    data = request.json
    question = data.get('question')
    options = data.get('options')
    
    if not question or not options:
        return jsonify({'error': 'Invalid input'}), 400
    
    correct_index = hip_agent.get_response(question, options)
    return jsonify({'correct_index': correct_index})

if __name__ == '__main__':
    app.run(debug=True)
