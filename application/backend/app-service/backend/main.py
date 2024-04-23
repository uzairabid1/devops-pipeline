from flask import Flask, render_template, jsonify
import requests
import time
from flask_cors import CORS
import threading
from dotenv import load_dotenv
import os

load_dotenv()
app = Flask(__name__)
CORS(app)

USERNAME = os.getenv('USERNAME')
PASSWORD = os.getenv('PASSWORD')

def fetch_data_from_jenkins():
    while True:
        # try:
            response = requests.get('http://18.224.139.9:8080/job/register-app-ci/lastBuild/wfapi/describe',
                                    auth=(USERNAME, PASSWORD))
            data = response.json()

            stages = []
            for stage in data['stages']:
                stages.append({
                    'name':   stage['name'],
                    'status': stage['status']
                })
            
            global latest_stages
            latest_stages = stages
            

            time.sleep(0.05)
        
        # except Exception as e:
        #     print("Error fetching data from Jenkins API:", e)


@app.route('/test')
def fetch_data():
    list_f =   {  
        "stages": [
        {
            "name": "Declarative: Checkout SCM",
            "status": "SUCCESS"
        },
        {
            "name": "Declarative: Tool Install",
            "status": "SUCCESS"
        },
        {
            "name": "Cleanup Workspace",
            "status": "SUCCESS"
        },
        {
            "name": "Checkout from SCM",
            "status": "SUCCESS"
        },
        {
            "name": "Build Application",
            "status": "SUCCESS"
        },
        {
            "name": "Test Application",
            "status": "SUCCESS"
        },
        {
            "name": "SonarQube Analysis",
            "status": "SUCCESS"
        },
        {
            "name": "Quality Gate",
            "status": "SUCCESS"
        },
        {
            "name": "Build & Push Docker Image",
            "status": "IN_PROGRESS"
        },
        {
            "name": "Trivy Scan",
            "status": "SUCCESS"
        },
        {
            "name": "Cleanup Artifacts",
            "status": "SUCCESS"
        },
        {
            "name": "Trigger CD Pipeline",
            "status": "SUCCESS"
        },
        {
            "name": "Declarative: Post Actions",
            "status": "SUCCESS"
        }
    ]
    }
    return list_f


fetch_data_thread = threading.Thread(target=fetch_data_from_jenkins)
fetch_data_thread.start()

latest_stages = []

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/stages')
def get_stages():
    return jsonify({'stages': latest_stages})

if __name__ == '__main__':
    app.run(debug=True,port=5001)
