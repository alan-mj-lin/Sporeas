from flask import Flask, render_template, request, redirect, url_for
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

title = "Title"
hymn = "Hymn"
verse = "Verse"


@app.route('/')
def index():
    return render_template("index.html", titleString=title, hymnString=hymn, verseString=verse)


@app.route('/admin', methods=['GET', 'POST'])
def admin():
    return render_template("form.html")

@socketio.on('my broadcast event', namespace='/')
def test_message(message):
    global title
    global hymn
    global verse

    title = message['title']
    hymn = message['hymn']
    verse = message['verse']
    emit('refresh', namespace='/', broadcast=True)

if __name__ == '__main__':
    socketio.run(app)
