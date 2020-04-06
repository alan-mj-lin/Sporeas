#!/bin/bash

# to run this file, double click on it

function downloadPythonInstaller() {
  # download Python 3.7 for Mac:
  curl -o setup-python-mac.pkg https://www.python.org/ftp/python/3.7.7/python-3.7.7-macosx10.9.pkg
}

function deletePythonInstaller() {
  rm setup-python-mac.pkg
}

function openPythonGraphicalInstaller() {
  open setup-python-mac.pkg
}

function installPython() {
  echo 'Python is not set up or installed. Attempting install now.'
  downloadPythonInstaller
  openPythonGraphicalInstaller
}

function installMoreDependencies() {
  echo 'Installing more dependencies.'
  # pip3 is included with Python 3
  py -m pip install --upgrade pip
  pip3 install eventlet
  pip3 install flask
  pip3 install flask_socketio
  pip3 install requests
  pip3 install pyOpenSSL==19.1.0
}

function installAllDependeciesOnce() {
  # install Python only if Python 3.7 is not already installed
  if ! [ -x "$(command -v python3.7)" ]; then
    installPython
  else
    deletePythonInstaller
  fi
  # pip automatically checks if deps are already installed
  installMoreDependencies
}

function goToScriptFolder() {
  MY_PATH="`dirname \"$0\"`"
  echo "Going to: $MY_PATH"
  cd $MY_PATH
}

function runApp() {
  # signal no hangup with: nohup
  # prevent nohup output file with: >/dev/null 2>&1
  # run in background with: & at the end
  nohup bash -c 'python3.7 basic_app.py & (sleep 3s; open http://127.0.0.1:9000/admin)' >/dev/null 2>&1 &
}

# ---------------------

open https://sporeas.surge.sh
installAllDependeciesOnce # only if not already installed
goToScriptFolder # for some reason you need to tell the script to go to its own folder
runApp

# ---------------------
