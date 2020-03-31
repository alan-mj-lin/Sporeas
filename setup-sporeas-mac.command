#!/bin/bash

function downloadPythonInstaller() {
  # download Python 3.7 for Mac:
  curl -o setup-python-mac.pkg https://www.python.org/ftp/python/3.7.7/python-3.7.7-macosx10.9.pkg
}

function openPythonGraphicalInstaller() {
  open setup-python-mac.pkg
}

function installPythonIfMissing() {
  echo 'Python is not set up or installed. Attempting install now.'
  downloadPythonInstaller
  openPythonGraphicalInstaller
}

function installMoreDependencies() {
  echo 'Installing more dependencies.'
  # pip3 is included with Python 3
  pip3 install eventlet
  pip3 install flask
  pip3 install flask_socketio
  pip3 install requests
  pip3 install pyOpenSSL==19.1.0
}

function installAllDependeciesOnce() {
  if ! [ -x "$(command -v python3.7)" ]; then
    installPythonIfMissing
    installMoreDependencies
  fi
}

function runApp() {
  python3.7 basic_app.py & sleep 3s; open http://127.0.0.1:9000/admin &
}

# ---------------------

open https://sporeas.surge.sh
cd ~/Desktop
installAllDependeciesOnce
cd ~/Desktop/Sporeas
runApp
read -p 'Hit any key to close'

# ---------------------
