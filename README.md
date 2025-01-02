# DeskHead: AI-Driven Stock Trading Platform

## Overview
**DeskHead** is an innovative AI-powered trading platform developed in collaboration with MIT-sponsored research. It features AI agents such as **Risk Analyst AI**, **Researcher AI**, and **Trader AI** to assist traders with real-time predictions, risk assessments, and market research. By addressing core challenges like missed price spikes, scattered historical data, and trader skepticism, DeskHead has transformed the trading experience, empowering traders to make faster and more reliable decisions.

---

## Features
1. **Real-Time Data Pipeline**  
   Built with Kafka to process market feeds and news data instantly, reducing latency significantly.

2. **Centralized Historical Data Storage**  
   MongoDB integration ensures all historical stock events are systematically stored, enabling easy analysis.

3. **Spike Prediction Model**  
   Leveraged DBSCAN clustering to identify patterns and predict price spikes with 40% higher accuracy.

4. **Explainable Predictions**  
   Historical precedents are linked to predictions, fostering trader trust and confidence.

5. **Lightning-Fast Insights**  
   Predictions are delivered in under 2 seconds, enabling traders to act on market movements without hesitation.

---

## Problem Statement
1. **Missed Opportunities**  
   Price spikes often went unnoticed or were flagged too late for action.

2. **Fragmented Historical Data**  
   Disorganized data storage made it difficult to recognize actionable patterns.

3. **Skeptical Traders**  
   Lack of trust in predictions due to insufficient explainability and accuracy.

---

## Solution Approach


### Step 1: System Design  
   - Built a robust data pipeline for ingesting and organizing historical and real-time data.  
   - Developed a scalable prediction model to detect both expected and unexpected price spikes.

### Step 2: Model Deployment  
   - Implemented DBSCAN clustering for pattern recognition.  
   - Integrated AI agents to dynamically recalibrate predictions based on live data.

---

## System Architecture

![image](https://github.com/user-attachments/assets/ef1b6f83-8f8a-426b-bce4-f1936ab1248e)


**How it Works:**  
1. The user (Desk Head) triggers AI agents based on prompts or events.  
2. Agents reference custom tools and retrieve data, synthesizing complex information into actionable insights.  
3. Alerts, updates, and relevant links are provided to users in real-time.

---

## Screenshots
![image](https://github.com/user-attachments/assets/4d2b7b8c-967c-4438-a36f-379043f70fe6)


---

## Challenges
1. **Data Overload**  
   Filtered thousands of daily inputs from news articles, social media, and market feeds to prioritize relevance.  

2. **False Positives**  
   Improved model reliability with trader feedback and explainability features.  

---

## Achievements
- **40% Improvement in Spike Prediction Accuracy**  
  Enhanced traders' ability to identify unexpected market movements.  

- **Centralized Historical Database**  
  Organized data storage with MongoDB for seamless analysis and learning.  

- **Sub-2-Second Prediction Speeds**  
  Real-time insights empower traders to act without delays.  

- **Restored Trader Confidence**  
  Transparent predictions linked to historical patterns increased trust in the system.  

---

## Tools and Technologies
- **Data Storage:** MongoDB, SQLite  
- **Real-Time Processing:** Kafka  
- **Machine Learning:** DBSCAN Clustering, YFinance API, PolygonAPI, FinnHub Utils.
- **Programming Languages:** Python  
- **Visualization:** Custom-built interactive interfaces  

---

## Installation and Setup

### Prerequisites
- Python 3.7 or later
- MongoDB
- Kafka

### Commands to Install And Run Chatbot:
```bash
cd Finrobot
pip install -r requirements.txt

```bash
cd api
python app.py


---

## Future Enhancements
- Expand AI agent capabilities for deeper market analysis.  
- Incorporate additional data sources for enriched predictions.  
- Improve latency further for near-instant responses.  
