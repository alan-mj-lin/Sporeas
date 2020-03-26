#!/bin/bash

function downloadPythonInstaller() {
  # download Python 3.7 for Mac:
  curl -o setup-python-mac.pkg https://www.python.org/ftp/python/3.7.7/python-3.7.7-macosx10.9.pkg
}

function installPythonIfMissing() {
  if ! [ -x "$(command -v python)" ]; then
    echo 'Python is not set up or installed. Attempting install now.'
    downloadPythonInstaller
    # open Python graphical installer:
    sudo installer -pkg ./setup-python-mac.pkg -target /
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
  open http://127.0.0.1:9000/admin
  python basic_app.py
}

function installDepsAndStartRightAway() {
  installDependencies
  sleep 3s
  startAppRightAway
}

# ---------------------

open https://sporeas.surge.sh
cd ~/Desktop
installPythonIfMissing
cd ~/Desktop/Sporeas
installDepsAndStartRightAway

# ---------------------
