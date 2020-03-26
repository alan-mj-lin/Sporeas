# to run this file, right click on it inside File Explorer, and choose "Run with PowerShell"
 
function downloadPythonInstaller {
  # download Python 3.7 for Windows:
  Invoke-WebRequest https://www.python.org/ftp/python/3.7.7/python-3.7.7-amd64.exe -OutFile ./setup-python-pc.exe
}

function installPythonIfMissing {
  $p = & { python -V } 2>&1
  if ($p -is [System.Management.Automation.ErrorRecord]) { # got error: not installed
    downloadPythonInstaller
    ./setup-python-pc.exe # open Python graphical installer
  }
  elseif ($PythonVersion -ne 2.7.7) {
    downloadPythonInstaller
    ./setup-python-pc.exe # open Python graphical installer
  }
}

function installDependencies {
  pip install eventlet
  pip install flask
  pip install flask_socketio
  pip install requests
  pip install pyOpenSSL==19.1.0
}

function startAppRightAway {
  start http://127.0.0.1:9000/admin
  python basic_app.py
}

function installDepsAndStartRightAway {
  installDependencies
  Start-Sleep -s 3
  startAppRightAway
}

# ---------------------

start https://sporeas.surge.sh
cd ~/Desktop
installPythonIfMissing
cd ~/Desktop/Sporeas
installDepsAndStartRightAway

# ---------------------
