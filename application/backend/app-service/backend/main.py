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
if USERNAME == 'pc':
    USERNAME = os.getenv('JENKINS_USER')
    
PASSWORD = os.getenv('PASSWORD')
print(USERNAME)
print(PASSWORD)

def fetch_data_from_ci():
    while True:
        response = requests.get('http://3.133.203.61:8080/job/register-app-ci/lastBuild/wfapi/describe',
                                auth=(USERNAME, PASSWORD))
        print(response)
        data = response.json()
        stages = []
        for stage in data['stages']:
            stages.append({
                'name':   stage['name'],
                'status': stage['status']
            })
        
        global latest_ci_stages
        latest_ci_stages = stages
        

        time.sleep(0.10)

def fetch_data_from_cd():
    while True:
        response = requests.get('http://3.133.203.61:8080/job/gitops-register-app-cd/lastBuild/wfapi/describe',
                                auth=(USERNAME, PASSWORD))
        data = response.json()

        stages = []
        for stage in data['stages']:
            stages.append({
                'name':   stage['name'],
                'status': stage['status']
            })
        
        global latest_cd_stages
        latest_cd_stages = stages
        

        time.sleep(0.10)


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
            "status": "SUCCESS"
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
            "status": "IN_PROGRESS"
        },
        {
            "name": "Declarative: Post Actions",
            "status": "SUCCESS"
        }
    ]
    }
    return list_f


fetch_data_ci = threading.Thread(target=fetch_data_from_ci)
fetch_data_cd = threading.Thread(target=fetch_data_from_cd)
fetch_data_ci.start()
fetch_data_cd.start()

latest_ci_stages = []
latest_cd_stages = []

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/ci_stages')
def get_ci_stages():
    return jsonify({'stages': latest_ci_stages})

@app.route('/cd_stages')
def get_cd_stages():
    return jsonify({'stages': latest_cd_stages})

if __name__ == '__main__':
    app.run(debug=True,port=5000)
