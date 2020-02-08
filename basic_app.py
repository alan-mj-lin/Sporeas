#!/usr/bin/env python3.7
# Sporeas 1.1.0
"""
This is the main file to run.
"""

# pylint: disable=invalid-name

# Need to monkey patch eventlet to prevent hang
import json
import re
import collections
import eventlet
import requests
from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit, join_room, leave_room

eventlet.monkey_patch()

API_KEY = '5e293004cbb7d9cb44f9266cdfed76e9401bd8a0'
API_URL = 'https://api.esv.org/v3/passage/text/'
CH_API_URL = 'http://getbible.net/json?'
CAM_API_URL = 'http://192.168.1.142/cgi-bin/recall.cgi?recall='
app = Flask(__name__)
socketio = SocketIO(app,
                    manage_session=False,
                    logger=True,
                    cors_allowed_origins=[
                        'http://127.0.0.1:9000',
                        'https://127.0.0.1:9000',
                        'https://api.esv.org',
                        'http://getbible.net',
                        'https://tjc-av.herokuapp.com',
                        'http://tjc-av.herokuapp.com',
                        'https://192.168.0.120',
                        'http://192.168.0.120',
						'http://192.168.1.142'
                    ])
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
rooms = {}  # Room list for Route Broadcast feature
roomState = {}  # Keep track of api state for each room


def find(key, dictionary):
    """
    This function is used to find any given key value in a very complicated
    JSON. getbible.net's API is not as sophisticated enough that it just gives
    you the verse texts. It will return a JSON which
    we have to parse on our own.
    """
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


def split_by_verse_esv(passage):
    """
    This function is used to process the english passages so that they
    can be displayed verse by verse.
    """
    verse_list = passage.split('[')
    for i in range(len(verse_list)):
        verse_list[i] = verse_list[i].replace("]", "").strip()

    try:
        verse_list.remove('')
    except ValueError:
        pass

    return verse_list


def get_chinese_text(passage):
    """
    Function to get the chinese verse text.
    """
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
    print('The ch_overlay is: ' + response.text)
    if response.text is None:
        return 'ERROR: Passage not found'
    else:
        return chinese_overlay


def get_esv_text(passage, comma):
    """
    Function to get the english verse text.
    """
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
    parsed = response.text
    parsed_dict = json.loads(parsed)
    query = parsed_dict['query']
    query = query.replace(u'\u2013', '-')
    print(parsed_dict)
    print(ascii(passage))
    print('The ASCII is: ' + ascii(query))
    if query != passage and not comma:
        print("NOT EQUAL")
        return 'ERROR: Passage not found'
    elif comma:
        query_list = query.split(';')
        string = ''
        for i in query_list:
            if i != query_list[-1]:
                string = string + i.split(':')[1] + ','
            else:
                string = string + i.split(':')[1]
        query = query_list[0].split(':')[0] + ":" + string
        query = query.replace(" ","")
        passage_sent = passage.replace(" ", "")
        print(passage_sent)
        print(query)
        if query != passage_sent:
            print("NOT EQUAL")
            return 'ERROR: Passage not found'
    else:
        print("EQUAL")
    passages = response.json()['passages']

    for i in passages:
        i.strip()

    return passages if passages else 'Error: Passage not found'


@app.route('/<user>', methods=['GET', 'POST'])
def index(user):
    """
    Flask route for root directory
    """
    return render_template("index.html")


@app.route('/admin', methods=['GET', 'POST'])
def admin():
    """
    Flask route for admin directory
    """
    return render_template("form.html")


@app.route('/how-to', methods=['GET', 'POST'])
def how_to():
    """
    Flask route for how-to directory
    """
    return render_template("how-to.html")


@socketio.on('connect')
def connect_test():
    """
    If a client connects call function to get the SID
    (Used for session management)
    """
    emit('get sid')


@socketio.on('get sid')
def get_session(message):
    """
    Function to get the SID of a client connection. Called via
    connection to WebSocket.
    """
    global project_list
    global rooms  # Route Broadcast Feature

    duplicate = False
    user = message['user'].strip('/')
    for key, value in project_list.items():
        if user == key:
            duplicate = True
    print(duplicate)
    print(user)
    join_room(user)  # Route Broadcast Feature
    if user != '' and not duplicate:
        print(project_list)
        project_list[user] = request.sid


@socketio.on('user active')
def get_user(message):
    """
    Function to join a room according to user input, and emits to client
    whether to allow the user access or not.
    """
    global username
    global user_list
    global rooms  # Route Broadcast Feature
    global roomState

    duplicate = False
    username = message['user'].replace(' ', '_')

    # Route Broadcast Feature
    for key, value in rooms.items():
        if username == key:
            duplicate = True

    if username != '':
        join_room(username)
        rooms[username] = []
        rooms[username].append(request.sid)
        roomState[username] = True
        emit('auth event', {'auth': str(duplicate)})
    # End of Route Broadcast Feature


@socketio.on('disconnect')
def disconnect_event():
    """
    Disconnect event should cause client to leave the room, and delete the
    active room entry.
    """
    global user_list
    global project_list
    global rooms  # Room Logic

    # Route Broadcast Logic
    active = request.sid
    left = ''
    for room in rooms:
        for num in range(len(rooms[room])):
            if rooms[room][num] == active:
                leave_room(room)
                left = room
                del rooms[room][num]

    if left != '' and len(rooms[left]) == 0:
        del rooms[left]
        del roomState[left]
    print(rooms)


@socketio.on('reset', namespace='/')
def reset(message):
    """
    Function to send a reset event - clears the set verse.
    """
    active = message['user']
    emit('reset', {"verse": ''}, namespace='/', room=active)


@socketio.on('toggle api', namespace='/')
def api_toggle_handler(message):
    """
    Function to handle api toggle.
    """
    global rooms
    active = message['user']
    state = message['state']
    print(rooms)
    roomState[active] = state
    emit('state check', {"state": state}, namespace='/', room=active)
    print(state)

	
@socketio.on('camera request', namespace='/')
def camera_rquest(message):
	"""
	Function to handle camera angle changes
	"""
	type = message['type']
	if type == 'Sermon':
		requests.get(CAM_API_URL + 'Sermon')
	elif type == 'Hymn Singing':
		requests.get(CAM_API_URL + 'Hymn%20Singing')


@socketio.on('custom message', namespace='/')
def custom_message(message):
    """
    Function to handle any service mode messages (hymn singing mode, morning
    prayer mode...)
    """
    global title
    global ch_title
    global hymn
    global book
    global verse
    global overlay
    global ch_overlay

    type = message['type']
    active = message['user']

    hymn = message['hymn']
    filtered = hymn_filter(hymn).split(",")
    if type == 'hymn':
        title = ''
        ch_title = ''
    elif type == 'morning':
        title = 'Morning Prayer'
        ch_title = '早禱會'
    elif type == 'communion':
        title = 'Holy Communion'
        ch_title = '聖餐禮'
    elif type == 'footwashing':
        title = 'Foot Washing'
        ch_title = '洗腳禮'

    emit('refresh', {
            "title": title,
            "ch_title": ch_title,
            "hymn": hymn,
            "verse": '',
            "book": '',
            "overlay": '',
            "ch_overlay": '',
            "hymn_list": filtered,
            "hymn_scroll": "null"
        }, namespace='/', room=active)
    print(filtered)


def hymn_filter(string):
    """
    Function to filter hymns for only numbers and commas.
    """
    colon = False
    for i in string:
        if i == ':':
            colon = True

    if colon:
        hymn_string = string.split(":")[1].strip()
    else:
        hymn_string = string

    clean = re.compile('<.*?>')

    return re.sub(clean, '', hymn_string)


@socketio.on('hymn scroll', namespace='/')
def hymn_scroll(message):
    """
    Function to notify hymn scroll event
    """
    active = message['user']
    emit('scroll', namespace='/', room=active)


@socketio.on('my broadcast event', namespace='/')
def test_message(message):
    """
    Main function for form handling. Emits the message to active clients in the
    same room only.
    """
    global title
    global ch_title
    global hymn
    global book
    global verse
    global overlay
    global ch_overlay
    global rooms

    out_of_range = False
    comma = False

    title = message['title']
    ch_title = message['ch_title']
    hymn = message['hymn']
    hymn = hymn_filter(hymn)
    print(hymn)
    hymnList = hymn.split(",")

    try:
        book = message['book']
        verse = message['verse']
    except KeyError:
        book = ''
        verse = ''

    if verse != '':
        extra_verse = ''
        for i in verse:
            if i == ',':
                extra_verse = verse.split(',')[1]
                comma = True
        passage = message['book'].split('|')[0] + message['verse']
        # passage_remainder = passage.split(':')[0] + ':' + extra_verse
        print(passage)

    active = message['user']
    state = message['state']

    # Debug Info
    print(state)
    print(type(state))
    print(active)
    print(message)

    if state == 'true' and book != '':
        if comma:
            overlay = get_esv_text(passage, comma) # + get_esv_text(passage_remainder)
            print(overlay)
        else:
            overlay = get_esv_text(passage, comma)
            print(overlay)
        try:
            ch_overlay = get_chinese_text(passage).splitlines()
            print(len(overlay))
            if len(overlay) == 1:
                overlay = split_by_verse_esv(overlay[0])
        except:
            out_of_range = True

    if overlay == 'ERROR: Passage not found' or ch_overlay == 'ERROR: Passage not found':
        out_of_range = True

    # Debug Info
    print(project_list)
    print(overlay)
    print(ch_overlay)
    # print(ch_overlay.splitlines()[0])
    # Route Broadcast Feature
    if not out_of_range:
        emit('refresh', {
            "title": title,
            "ch_title": ch_title,
            "hymn": hymn,
            "book": book,
            "verse": verse,
            "overlay": overlay,
            "ch_overlay": ch_overlay,
            "hymn_list": hymnList,
            "hymn_scroll": "null",
            "state": state
        }, namespace='/', room=active)
        print(hymnList)
    else:
        emit('no passage',
             {"out_of_range": out_of_range}, namespace='/', room=active)

    out_of_range = False

@socketio.on('announce', namespace='/')
def announce(message):
    print(message)
    active = message['user']
    eGA = message['GA'].splitlines()
    eFA = message['FA'].splitlines()
    eRA = message['RA'].splitlines()
    eRE = message['RE'].splitlines()
    cGA = message['ch_GA'].splitlines()
    cFA = message['ch_FA'].splitlines()
    cRA = message['ch_RA'].splitlines()
    cRE = message['ch_RE'].splitlines()
    print(eGA)
    emit('update announcements', {
         "GA": eGA,
         "FA": eFA,
         "RA": eRA,
         "RE": eRE,
         "ch_GA": cGA,
         "ch_FA": cFA,
         "ch_RA": cRA,
         "ch_RE": cRE
         }, namespace='/', room=active)


@socketio.on('show announce', namespace='/')
def show(message):
    active = message['user']
    emit('show announcements', namespace='/', room=active)


if __name__ == '__main__':
    socketio.run(app, host='127.0.0.1', port=9000, debug=True)
