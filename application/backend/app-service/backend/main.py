from flask import Flask, render_template, jsonify, make_response, request
import requests
import time
from flask_mail import Mail, Message
from flask_cors import CORS
import threading
from dotenv import load_dotenv
import os
from datetime import datetime
import sqlite3
import bcrypt
import random
load_dotenv()
app = Flask(__name__)
CORS(app)

app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')

app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')

app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True
mail = Mail(app)


USERNAME = os.getenv('JENKINS_USERNAME')
if USERNAME == 'pc' or USERNAME == 'user':
    USERNAME = os.getenv('JENKINS_USER')
USERNAME = 'uzairabid1'

PASSWORD = os.getenv('PASSWORD')
print(USERNAME)
print(PASSWORD)

def generate_otp():
    return random.randint(0000, 9999)

def create_connection():
    conn = sqlite3.connect('database.db')
    return conn, conn.cursor()

def send_verification_email(email, otp):
    msg = Message('Welcome to IntelliDeploy - Verify your email',
                  sender='rmuuu123@gmail.com', recipients=[email])
    msg.body = f'Welcome to IntelliDeploy. Please verify your email by entering the Verification Code: {otp}'
    mail.send(msg)

def send_back_email(email):
    msg = Message('IntelliDeploy - You are registered successfully',
                  sender='rmuuu123@gmail.com',recipients=[email])
    msg.body = f'Welcome to IntelliDeploy.We are glad to have you on board.'
    mail.send(msg)

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
        
        result_ci = {
            'build_id': build_id,
            'build_status': build_status,
            'stages': stages
        }
        
        global latest_ci_stages
        latest_ci_stages = result_ci
        
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
        
        result_cd = {
            'build_id': build_id,
            'build_status': build_status,
            'stages': stages
        }
        
        global latest_cd_stages
        latest_cd_stages = result_cd
        

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

@app.route('/login', methods=['POST'])
def user_login():
    email_form = request.form.get('email')
    password_form = request.form.get('password')
    if not email_form or not password_form:
        return jsonify({'error': 'Email and password are required'}), 400
    conn, c = create_connection()
    try:
        c.execute("SELECT * FROM users WHERE email = ?", (email_form,))
        user = c.fetchone()
        if user:
            stored_hashed_password = user[1]
            if bcrypt.checkpw(password_form.encode('utf-8'), stored_hashed_password):
                user_details = {
                    'email': user[0],
                    'fname': user[2],
                    'lname': user[3]
                }
                return jsonify({'message': 'Login successful', 'user': user_details}), 200
            else:
                return jsonify({'error': 'Invalid email or password'}), 401
        else:
            return jsonify({'error': 'Invalid email or password'}), 401
    except Exception as e:
        return jsonify({'error': 'An error occurred: ' + str(e)}), 500
    finally:
        conn.close()

@app.route('/signup', methods=['POST'])
def user_signup():
    email_form = request.form.get('email')
    password_form = request.form.get('password')
    fname_form = request.form.get('fname')
    lname_form = request.form.get('lname')

    if not email_form or not password_form or not fname_form or not lname_form:
        return jsonify({'error': 'All fields are required'}), 400

    conn, c = create_connection()

    try:
        otp = generate_otp()
        send_verification_email(email_form, otp)
        
        password_hash = bcrypt.hashpw(password_form.encode('utf-8'), bcrypt.gensalt())
        c.execute("INSERT INTO users (email, password, fname, lname, otp, is_verified) VALUES (?, ?, ?, ?, ?, ?)",
                  (email_form, password_hash, fname_form, lname_form, otp,0))
        conn.commit()
        return jsonify({'message': 'Check your email for verification.'}), 200

    except Exception as e:
        return jsonify({'error': 'An error occurred: ' + str(e)}), 500
    finally:
        conn.close()


@app.route('/verify', methods=['POST'])
def verify_signup():
    email_form = request.args.get('email')
    otp_from_user = request.form.get('otp')
    conn, c = create_connection()
    try:
        c.execute("SELECT * FROM users WHERE email = ?", (email_form,))
        user = c.fetchone()
        if user:
            stored_otp = user[4]
            if int(otp_from_user) == stored_otp:
                c.execute("UPDATE users SET is_verified = 1 WHERE email = ?", (email_form,))
                conn.commit()
                send_back_email(email_form)
                return jsonify({'message': 'User Registered Successfully'}), 200
                
            else:
                return jsonify({'error': 'Invalid OTP'}), 401
        else:
            return jsonify({'error': 'Invalid email'}), 401
    except Exception as e:
        return jsonify({'error': 'An error occurred: ' + str(e)}), 500
        



if __name__ == '__main__':
    app.run(debug=True,port=5000)
