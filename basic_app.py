import requests, json
from flask import Flask, render_template, request, session
from flask_socketio import SocketIO, emit, join_room, leave_room
from flask_session import Session
import collections

API_KEY = '5e293004cbb7d9cb44f9266cdfed76e9401bd8a0'
API_URL = 'https://api.esv.org/v3/passage/text/'
CH_API_URL = 'http://getbible.net/json?'
app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
app.config['SESSION_TYPE'] = 'filesystem'
Session(app)
socketio = SocketIO(app, manage_session=False, logger=True, cors_allowed_origins=['http://127.0.0.1:9000', 'https://127.0.0.1:9000','https://api.esv.org', 'http://getbible.net', 'https://tjc-av.herokuapp.com', 'http://tjc-av.herokuapp.com', 'https://192.168.0.120', 'http://192.168.0.120'])
title = "Title"
ch_title = "Chinese Title"
hymn = ''
book = ''
verse = ''
overlay = ''
ch_overlay = ''
username = ''
user_list = []
project_list = {}
rooms = {} # Room list for Route Broadcast feature


"""
This function is used to find any given key value in a very complicated JSON.
getbible.net's API is not as sophisticated enough that it just gives you the verse texts. 
It will return a JSON whichwe have to parse on our own.
"""
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


"""
Function to get the chinese verse text.
"""
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


"""
Function to get the english verse text.
"""
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


"""
Flask route for root directory
"""
@app.route('/<user>', methods=['GET', 'POST'])
def index(user):

    # return render_template("index.html", titleString=title, chTitleString=ch_title, hymnString=hymn, bookString=book, verseString=verse, overlayString=overlay, chOverlayString=ch_overlay)
    return render_template("index.html")


"""
Flask route for admin directory
"""
@app.route('/admin', methods=['GET', 'POST'])
def admin():
    return render_template("form.html")


"""
If a client connects call function to get the SID (Used for session management)
"""
@socketio.on('connect')
def connect_test():
    emit('get sid')


"""
Function to get the SID of a client connection. Called via connection to WebSocket.
"""
@socketio.on('get sid')
def get_session(message):
    global project_list
    global rooms # Route Broadcast Feature

    duplicate = False
    user = message['user'].strip('/')
    for key, value in project_list.items():
        if user == key:
            duplicate = True
    print(duplicate)
    print(user)
    join_room(user) # Route Broadcast Feature
    if user != '' and not duplicate:
        print(project_list)
        project_list[user] = request.sid


"""
Function to join a room according to user input, and emits to client whether to
allow the user access or not.
"""
@socketio.on('user active')
def get_user(message):
    global username
    global user_list
    global rooms # Route Broadcast Feature
    duplicate = False
    username = message['user'].replace(' ', '_')

    # Route Broadcast Feature
    if username != '':
        join_room(username)
        rooms[username] = []
        rooms[username].append(request.sid)
        emit('auth event', {'auth': str(duplicate)})
    # End of Route Broadcast Feature

    # Session Logic
    """
    print(username)
    for i in user_list:
        if username == i:
            duplicate = True
    if not duplicate:
        user_list.append(username)
        emit('auth event', {'auth': str(duplicate)})
    """
    # End of Session Logic


"""
Disconnect event should cause client to leave the room, and delete the active room entry.
"""
@socketio.on('disconnect')
def disconnect_event():
    global user_list
    global project_list
    global rooms # Room Logic

    # Session Logic
    """
    # session_id = request.sid # Session Logic
    remove_user = ''
    
    
    for key, value in project_list.items():
        print("current: " +session_id)
        print("list: " + project_list[key])
        if session_id == project_list[key]:
            remove_user = key
            
    if remove_user != '':
        del project_list[remove_user]
        del user_list[remove_user]
    """
    # End Session Logic

    # Route Broadcast Logic
    active = request.sid
    for room in rooms:
        for num in range(len(rooms[room])):
            if rooms[room][num] == active:
                leave_room(room)
                del rooms[room][num]
    print(rooms)


"""
Function to send a reset event - clears the set verse.
"""
@socketio.on('reset', namespace='/')
def reset(message):
    active = message['user']
    emit('reset', {"verse": ''}, namespace='/', room=active)


"""
Function to set the projection screen to hymn singing mode.
"""
@socketio.on('hymn singing', namespace='/')
def hymn_singing_mode(message):
    global title
    global ch_title
    global hymn
    global book
    global verse
    global overlay
    global ch_overlay

    title = message['title']
    ch_title = message['ch_title']
    hymn = message['hymn']
    book = message['book']
    verse = message['verse']
    active = message['user']

    emit('refresh', {"title": title, "ch_title": ch_title, "hymn": hymn, "verse": book + verse, "overlay": overlay,
                     "ch_overlay": ch_overlay}, namespace='/', room=active)


"""
Main function for form handling. Emits the message to active clients in the same room only.
"""
@socketio.on('my broadcast event', namespace='/')
def test_message(message):
    global title
    global ch_title
    global hymn
    global book
    global verse
    global overlay
    global ch_overlay

    comma = False
    # session_id = request.sid

    title = message['title']
    ch_title = message['ch_title']
    hymn = message['hymn']
    book = message['book']
    verse = message['verse']
    extra_verse = ''
    for i in verse:
        if i == ',':
            extra_verse = verse.split(',')[1]
            comma = True
    passage = message['book'].split('|')[0] + message['verse']
    passage_remainder = passage.split(':')[0] + ':' + extra_verse
    active = message['user']

    # Debug Info
    print(active)
    print(message)
    print(passage)

    if book != '':
        if comma:
            overlay = get_esv_text(passage) + get_esv_text(passage_remainder)
        else:
            overlay = get_esv_text(passage)
        ch_overlay = get_chinese_text(passage)

    # Debug Info
    print(project_list)

    # Route Broadcast Feature
    emit('refresh', {"title": title, "ch_title": ch_title, "hymn": hymn, "verse": book + verse, "overlay": overlay, "ch_overlay": ch_overlay}, namespace='/', room=active)

    # Session Feature
    """
    emit_session = project_list[active]	
    print(emit_session)	
    emit('refresh', {"title": title, "ch_title": ch_title, "hymn": hymn, "verse": book + verse, "overlay": overlay, "ch_overlay": ch_overlay}, namespace='/', room=emit_session)
    """


if __name__ == '__main__':
    socketio.run(app, host='127.0.0.1', port=9000, debug=True)

