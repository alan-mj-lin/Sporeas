import requests, json
from flask import Flask, render_template
from flask_socketio import SocketIO, emit
import collections

API_KEY = '5e293004cbb7d9cb44f9266cdfed76e9401bd8a0'
API_URL = 'https://api.esv.org/v3/passage/text/'
CH_API_URL = 'http://getbible.net/json?'
app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

title = "Title"
ch_title = "Chinese Title"
hymn = ''
book = ''
verse = ''
overlay = ''
ch_overlay = ''


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
        # i.strip('\u3000').strip('\r\n')
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

@app.route('/')
def index():
    return render_template("index.html", titleString=title, chTitleString=ch_title, hymnString=hymn, bookString=book, verseString=verse, overlayString=overlay, chOverlayString=ch_overlay)


@app.route('/admin', methods=['GET', 'POST'])
def admin():
    return render_template("form.html")


@socketio.on('my broadcast event', namespace='/')
def test_message(message):
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
    passage = message['book'].split('|')[0] + message['verse']
    print(passage)
    if book != '':
        overlay = get_esv_text(passage)
        ch_overlay = get_chinese_text(passage)
    emit('refresh', namespace='/', broadcast=True)

if __name__ == '__main__':
    socketio.run(app, host='localhost', port=9000)

