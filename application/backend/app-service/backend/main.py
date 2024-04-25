from flask import Flask, render_template, jsonify
import requests
import time
from flask_cors import CORS
import threading
from dotenv import load_dotenv
import os
from datetime import datetime

load_dotenv()
app = Flask(__name__)
CORS(app)

USERNAME = os.getenv('USERNAME')
if USERNAME == 'pc':
    USERNAME = os.getenv('JENKINS_USER')

PASSWORD = os.getenv('PASSWORD')
print(USERNAME)
print(PASSWORD)

def milis_to_datetime(timestamp):
    timestamp_seconds = timestamp / 1000
    date_time = datetime.utcfromtimestamp(timestamp_seconds)

    formatted_date = date_time.strftime("%b, %d")
    formatted_time = date_time.strftime("%H:%M")
    return formatted_date + " " + formatted_time


def fetch_data_from_ci():
    while True:
        response = requests.get('http://3.133.203.61:8080/job/register-app-ci/lastBuild/wfapi/describe',
                                auth=(USERNAME, PASSWORD))
        data = response.json()
        
        build_id = data.get('id')
        build_status = data.get('status')
        stages = []
        for stage in data.get('stages', []):
            duration = float(int(stage['durationMillis'])/1000)
            time_started = milis_to_datetime(int(stage['startTimeMillis']))
            stages.append({
                'name':   stage['name'],
                'status': stage['status'],
                'duration': duration,
                'time_started': time_started
            })
        
        result = {
            'build_id': build_id,
            'build_status': build_status,
            'stages': stages
        }
        
        global latest_ci_stages
        latest_ci_stages = result
        
        time.sleep(0.10)

def fetch_data_from_cd():
    while True:
        response = requests.get('http://3.133.203.61:8080/job/gitops-register-app-cd/lastBuild/wfapi/describe',
                                auth=(USERNAME, PASSWORD))
        data = response.json()
        build_id = int(data.get('id'))
        build_status = data.get('status')
        stages = []
        for stage in data.get('stages', []):
            duration = float(int(stage['durationMillis'])/1000)
            time_started = milis_to_datetime(int(stage['startTimeMillis']))
            stages.append({
                'name':   stage['name'],
                'status': stage['status'],
                'duration': duration,
                'time_started': time_started
            })
        
        result = {
            'build_id': build_id,
            'build_status': build_status,
            'stages': stages
        }
        
        global latest_cd_stages
        latest_cd_stages = result
        

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
