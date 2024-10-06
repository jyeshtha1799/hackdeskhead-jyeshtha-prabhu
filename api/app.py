# api/app.py
from flask import Flask, jsonify, request
from flask_cors import CORS
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))  # Add the parent directory to the Python path
from FinRobot.finrobot.app_function import single_agent_analysis
# from FinRobot.research_agent import research_company
from FinRobot.risk_agent import RiskAnalysisSession
from api.calendar_scrape import scrape_economic_calendar  # Import the function



app = Flask(__name__)
# CORS(app)
# CORS(app, resources={r"/*": {"origins": ["http://localhost:3000"]}})
CORS(app, resources={r"/*": {"origins": "*"}})


sessions = {}

@app.route('/api/start-risk-analysis', methods=['POST'])
def start_risk_analysis():
    company = request.json.get('company', 'Tesla')  # Default to 'Tesla' if not provided
    session_id = request.json.get('session_id')
    
    if not session_id:
        return jsonify({'error': 'Session ID is required'}), 400

    session = RiskAnalysisSession(company)
    session.perform_initial_analysis()
    sessions[session_id] = session
    
    return jsonify({'message': 'Risk analysis started', 'conversation_history': session.get_conversation_history()})



@app.route('/api/follow-up-question', methods=['POST'])
def follow_up_question():
    session_id = request.json.get('session_id')
    question = request.json.get('question')

    if not session_id or session_id not in sessions:
        return jsonify({'error': 'Invalid or missing session ID'}), 400

    if not question:
        return jsonify({'error': 'Question is required'}), 400

    session = sessions[session_id]

    session.ask_follow_up_question(question)

    return jsonify({'conversation_history': session.get_conversation_history()})

@app.route('/api/market-analysis', methods=['POST'])
def market_analysis():

    company = request.json.get('company', 'Tesla')  # Default to 'Apple' if not provided
    analysis = single_agent_analysis(company)
    return jsonify({'analysis': analysis})


@app.route('/healthcheck', methods = ['GET'])
def health_check():
    return jsonify('healthy')

@app.route('/events', methods = ['GET'])
def recent_events():
    events = scrape_economic_calendar()
    return jsonify({'eventx': events})



# @app.route('/api/risk-analysis', methods=['POST'])
# def risk_analysis():

#     company = request.json.get('company', 'Tesla')  # Default to 'Apple' if not provided
#     analysis = perform_risk_analysis(company)
#     return jsonify({'analysis': analysis})

# @app.route('/api/research-agent', methods=['POST'])
# def research_analysis():

#     company = request.json.get('company', 'Tesla')  # Default to 'Apple' if not provided
#     analysis = research_company(company)
#     return jsonify({'analysis': analysis})



if __name__ == '__main__':
    app.run(debug=True)