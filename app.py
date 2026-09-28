"""
botyaraemoji — Flask emoji picker
Main application server
"""

from flask import Flask, render_template, jsonify, request
import json
import os
from pathlib import Path
from emojis import EMOJI_DATA

app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False

DATA_DIR = Path(__file__).parent / 'data'
SETTINGS_FILE = DATA_DIR / 'settings.json'


def ensure_data_dir():
    DATA_DIR.mkdir(exist_ok=True)
    if not SETTINGS_FILE.exists():
        SETTINGS_FILE.write_text('{}', encoding='utf-8')


def get_client_ip():
    if request.headers.get('X-Forwarded-For'):
        return request.headers['X-Forwarded-For'].split(',')[0].strip()
    if request.headers.get('X-Real-IP'):
        return request.headers['X-Real-IP']
    return request.remote_addr or '127.0.0.1'


def load_all_settings():
    try:
        return json.loads(SETTINGS_FILE.read_text(encoding='utf-8'))
    except (json.JSONDecodeError, FileNotFoundError):
        return {}


def save_all_settings(data):
    SETTINGS_FILE.write_text(
        json.dumps(data, ensure_ascii=False, indent=2),
        encoding='utf-8'
    )


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/emojis')
def api_emojis():
    return jsonify(EMOJI_DATA)


@app.route('/api/settings', methods=['GET'])
def get_settings():
    ip = get_client_ip()
    all_settings = load_all_settings()
    user_settings = all_settings.get(ip, {})
    return jsonify(user_settings)


@app.route('/api/settings', methods=['POST'])
def save_settings():
    ip = get_client_ip()
    all_settings = load_all_settings()
    user_data = request.get_json(silent=True)
    if user_data is None:
        return jsonify({'error': 'Invalid JSON'}), 400
    all_settings[ip] = user_data
    save_all_settings(all_settings)
    return jsonify({'status': 'ok'})


ensure_data_dir()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
