#!/usr/bin/python
# -*- coding: utf-8 -*-
import sys

from flask import request
from flask import Response

import json
import itertools



def users_api(app):
    """
    API functions USER

    """
    app.route('/api/users/all')(users)
    app.route('/api/users/add', methods=['PUT'])(users_add)
    app.route('/api/users/login', methods=['GET'])(user_login)

def users():
    print('--------- users ---------')
    # procitati iz datoteke listu korisnika
    # format datoteke
    # <username>|<password>
    all = []
    with open('www/files/users.txt') as f:
        for el in f:
            parts = el[:-1].split('|')
            all.append({'username':parts[0], 'password':parts[1]})
    return Response(json.dumps(all), mimetype='application/json')

def users_add():
    print('--------- users add ---------')
    obj = request.json
    with open('www/files/users.txt', 'w') as f:
        f.print("{}|{}\n".format(obj['username'], obj['password']) )
    return Response(json.dumps({'rez': obj}), mimetype='application/json')

def user_login():
    print('--------------- user login ------------------')
    username = request.args.get("username")
    password = request.args.get("password")
    with open('www/files/users.txt') as f:
        for el in f:
            parts = el[:-1].split('|')
            print(parts, username, password)
            if username == parts[0] and password == parts[1]:
                return Response(json.dumps({'res':'success'}), mimetype='application/json')
    return Response(json.dumps({'res':'failure'}), mimetype='application/json')
