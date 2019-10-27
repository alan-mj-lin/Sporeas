import requests
from flask import Flask, render_template
from flask_socketio import SocketIO, emit

API_KEY = '5e293004cbb7d9cb44f9266cdfed76e9401bd8a0'
API_URL = 'https://api.esv.org/v3/passage/text/'

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

title = ''
ch_title = ''
hymn = ''
book = ''
verse = ''
overlay = ''

def get_esv_text(passage):
    params = {
        'q': passage,
        'include-headings': False,
        'include-footnotes': False,
        'include-verse-numbers': False,
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
    return render_template("index.html", titleString=title, chTitleString=ch_title, hymnString=hymn, bookString=book, verseString=verse, overlayString=overlay)


@app.route('/admin', methods=['GET', 'POST'])
def admin():
    return render_template("form.html", titleString=title, chTitleString=ch_title, hymnString=hymn, bookString=book, verseString=verse, overlayString=overlay)

@socketio.on('my broadcast event', namespace='/')
def test_message(message):
    global title
    global ch_title
    global hymn
    global book
    global verse
    global overlay

    title = message['title']
    ch_title = message['ch_title']
    hymn = message['hymn']
    book = message['book']
    verse = message['verse']
    passage = message['book'].split('|')[0] + message['verse']
    print(passage)
    if book != '':
        overlay = get_esv_text(passage)
    emit('refresh', namespace='/', broadcast=True)

if __name__ == '__main__':
    socketio.run(app, host='localhost', port=9000)

