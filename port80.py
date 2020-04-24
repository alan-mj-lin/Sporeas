from flask_socketio import SocketIO
from flask import Flask, request, redirect, url_for
import eventlet
eventlet.monkey_patch(socket=False)
app = Flask(__name__)
socketio = SocketIO(
        app,
        manage_session=False,
        logger=True
    )


@app.before_request
def before_request():
    url = request.url.replace('http://', 'https://', 1)
    if '3.20.236.34' in url:
        url = request.url.replace('3.20.236.34', 'service.tjcav.com', 1)
    code = 301
    return redirect(url, code=code)


@app.route('/', methods=['GET', 'POST', 'HEAD'])
def root_redirect():
    url = 'https://service.tjcav.com/admin'
    code = 301
    return redirect(url, code=code)


if __name__=='__main__':
    socketio.run(
            app,
            host='0.0.0.0',
            port=80,
            debug=True
        )
