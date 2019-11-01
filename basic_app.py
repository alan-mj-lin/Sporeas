import requests, json
from flask import Flask, render_template, request, session
from flask_socketio import SocketIO, emit
from flask_session import Session
import collections

API_KEY = '5e293004cbb7d9cb44f9266cdfed76e9401bd8a0'
API_URL = 'https://api.esv.org/v3/passage/text/'
CH_API_URL = 'http://getbible.net/json?'
app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
# app.config['SESSION_TYPE'] = 'filesystem'
# Session(app)
socketio = SocketIO(app, manage_session=False, logger=True, cors_allowed_origins=['http://127.0.0.1:9000', 'https://127.0.0.1:9000','https://api.esv.org', 'http://getbible.net', 'https://tjc-av.herokuapp.com', 'http://tjc-av.herokuapp.com', 'https://192.168.0.120', 'http://192.168.0.120'])
title = "Title"
ch_title = "Chinese Title"
hymn = ''
book = ''
verse = ''
overlay = ''
ch_overlay = ''
username = ''
user_list = {}
project_list = {}


def find(key, dictionary):
    for k, v in dictionary.items():
        if k == key:
            yield v
        elif isinstance(v, dict):
            for result in find(key, v):
                yield result
        elif isinstance(v, list):
            for d in v:
                for result in find(key, d):
                    yield result


def get_chinese_text(passage):
    chinese_overlay = ''
    version = 'cut'
    url = CH_API_URL + 'passage=' + passage + '&version=' + version
    print(url)
    response = requests.get(url)
    passages = response.content.decode()
    passages = passages.replace('(', '')
    passages = passages.replace(';', '')
    passages = passages.replace(')', '')
    print(passages)
    passages = json.loads(passages, object_pairs_hook=collections.OrderedDict)
    print(passages)
    text_list = list(find('verse', passages))
    verse_nr = list(find('verse_nr', passages))
    j = 0
    for i in text_list:
        chinese_overlay += str(verse_nr[j])
        chinese_overlay += i
        j += 1
    return chinese_overlay


def get_esv_text(passage):
    params = {
        'q': passage,
        'include-headings': False,
        'include-footnotes': False,
        'include-verse-numbers': True,
        'include-short-copyright': False,
        'include-passage-references': False
    }

    headers = {
        'Authorization': 'Token %s' % API_KEY
    }

    response = requests.get(API_URL, params=params, headers=headers)

    passages = response.json()['passages']

    return passages[0].strip() if passages else 'Error: Passage not found'


@app.route('/<user>', methods=['GET', 'POST'])
def index(user):

    # return render_template("index.html", titleString=title, chTitleString=ch_title, hymnString=hymn, bookString=book, verseString=verse, overlayString=overlay, chOverlayString=ch_overlay)
    return render_template("index.html")


@app.route('/admin', methods=['GET', 'POST'])
def admin():
    return render_template("form.html")


@socketio.on('connect')
def connect_test():
    emit('get sid')


@socketio.on('get sid')
def get_session(message):
    user = message['user'].strip('/')
    if user != '':
        project_list[user] = request.sid

@socketio.on('user active')
def get_user(message):
    global username
    global user_list
    duplicate = False
    username = message['user']
    print(username)
    for key, value in user_list.items():
        if username == key:
            duplicate = True

    if not duplicate:
        user_list[username] = request.sid

    emit('auth event', {'auth': str(duplicate)})


@socketio.on('my broadcast event', namespace='/')
def test_message(message):
    global title
    global ch_title
    global hymn
    global book
    global verse
    global overlay
    global ch_overlay

    location = ''
    session_id = request.sid
    title = message['title']
    ch_title = message['ch_title']
    hymn = message['hymn']
    book = message['book']
    verse = message['verse']
    passage = message['book'].split('|')[0] + message['verse']
    print(passage)
    if book != '':
        overlay = get_esv_text(passage)
        ch_overlay = get_chinese_text(passage)

    for key, value in user_list.items():
        print("user: " + key)
        print("sid: " + value)
        print("active: " + session_id)
        if session_id == user_list[key]:
            location = key

    emit_session = project_list[location]
    print(location)
    print(emit_session)
    emit('refresh', {'title': title, 'ch_title': ch_title, 'verse': book + verse, 'overlay': overlay, 'ch_overlay': ch_overlay}, namespace='/', room=emit_session)


if __name__ == '__main__':
    socketio.run(app, host='127.0.0.1', port=9000, debug=True)

