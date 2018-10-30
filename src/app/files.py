import datetime
import pymongo

from flask import Response
from flask import redirect
from flask import request
from werkzeug.utils import secure_filename
import os
import datetime
import json


def files_routes(app):
    app.route('/api/files/upload/', methods=['POST'])(files_upload)
    app.route('/api/files/all/', methods=['GET'])(files_list)
    app.route('/api/files/remove/', methods=['GET'])(remove_file)
    app.route('/api/files/rename/', methods=['PUT'])(rename_file)


ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'zip', 'xml', 'rar', 'docx', 'xlsx'])
FILES_PATH = "www/files"

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def convert_to_isodates(obj):
    """Avoid problem with datetime serialization"""
    if type(obj) == type([]):
        for el in obj:
            # print(el)
            for k in el:
                eel = el[k]
                if isinstance(eel, datetime.datetime):
                    el[k] = eel.isoformat()
    else:
        for k in obj:
            eel = obj[k]
            if isinstance(eel, datetime.datetime):
                obj[k] = eel.isoformat()
    return obj

def files_upload():
    if 'file' not in request.files:
        return redirect(request.url)
    args = request.args
    path = FILES_PATH
    file = request.files['file']
    if file.filename == '':
        return redirect(request.url)
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        print(os.path.join(path, filename))
        file.save(os.path.join(path, filename))
        return 'ok', 200

def files_list():
    args = request.args
    path = FILES_PATH
    ret = []
    try:
        lst = os.listdir(path)
        print(lst)
    except OSError:
        pass
    else:
        for name in lst:
            fn = os.path.join(path, name)
            stat = os.stat(fn)
            st_mtime = datetime.datetime.fromtimestamp(stat.st_mtime)
            ret.append({'file': fn, 'size': stat.st_size, 'modified': st_mtime, 'name': name})
    ret = convert_to_isodates(ret)
    return Response(json.dumps(ret),  mimetype='application/json')

def remove_file():
    args = request.args
    path = FILES_PATH
    if('name' in args):
        name = args['name']
        try:
            os.remove(os.path.join(path, name))
        except OSError:
            pass
        return Response(json.dumps({'rez': 'ok'}),  mimetype='application/json')
    else:
        return Response(json.dumps({'rez': 'err'}),  mimetype='application/json')

def rename_file():
    path = FILES_PATH
    data = request.data
    item = json.loads(data)
    # print(item)
    try:
        name = item['old_name']
        new_name = item['name']
        os.rename(os.path.join(path, name), os.path.join(path, new_name))
        return Response(json.dumps(item),  mimetype='application/json')
    except OSError:
        return Response(json.dumps({'rez': 'err'}),  mimetype='application/json')
