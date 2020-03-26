#!/bin/bash

function installPythonIfMissing() {
  if ! [ -x "$(command -v python)" ]; then
    echo 'Python is not set up or installed. Attempting install now.'
    # # download Python 3.7 for Mac:
    # curl -o install-python.exe https://www.python.org/ftp/python/3.7.7/python-3.7.7-macosx10.9.pkg
    # # open Python graphical installer:
    # ./install-python.exe
    sudo ./setup-python-mac.pkg
  fi
}

function installDependencies() {
  pip install eventlet
  pip install flask
  pip install flask_socketio
  pip install requests
  pip install pyOpenSSL==19.1.0
}

function startAppRightAway() {
  # open -a Terminal
  open http://127.0.0.1:9000/admin
  python3 basic_app.py
}

function installDepsAndStartRightAway() {
  # installDependencies
  sleep 3s
  startAppRightAway
}

# ---------------------

open https://sporeas.surge.sh

installDepsAndStartRightAway

# ---------------------
