from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

title = "Title"
hymn = "Hymn"
verse = "Verse"


@app.route('/')
def index():
    global formRequest
    if formRequest:
        redirect(url_for('index'), code=302)
        formRequest = False
    return render_template("index.html", titleString=title, hymnString=hymn, verseString=verse)


@app.route('/admin', methods=['GET', 'POST'])
def admin():
    global title
    global hymn
    global verse

    if request.method == 'POST':
        result = request.form
        title = result.get('title')
        hymn = result.get('hymn')
        verse = result.get('verse')
    return render_template("form.html")


if __name__ == '__main__':
    app.run('127.0.0.1', 9000, debug=True)
