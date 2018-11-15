from flask import Flask
from flask import request
from flask import Response
from flask import jsonify
import json
from io import StringIO
import os

from app.files import files_routes
from app.users import users_api

app = Flask(__name__, static_folder='www')


@app.route('/<path:path>')
def static_file(path):
    try:    
        return app.send_static_file(path)
    except: 
        return "Error"

@app.route('/')
def root():
    return app.send_static_file('index.html')


files_routes(app)
users_api(app)


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080, debug=True, use_reloader=True)
