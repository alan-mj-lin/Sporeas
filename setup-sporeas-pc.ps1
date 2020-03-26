function installPythonIfMissing {
  # # download Python 3.7 for Windows:
  # Invoke-WebRequest https://www.python.org/ftp/python/3.7.7/python-3.7.7-amd64.exe -OutFile ./install-python.exe
  $p = &{python -V} 2>&1
  if ($p -is [System.Management.Automation.ErrorRecord]) { # got error: not installed
    # ./install-python.exe # open Python graphical installer
    ./setup-python-pc.exe # open Python graphical installer
  } elseif ($PythonVersion -ne 2.7.7) {
    # ./install-python.exe # open Python graphical installer
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
  # start-process powershell
  # Invoke-Item C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe
  open http://127.0.0.1:9000/admin
  python basic_app.py
}

function installDepsAndStartRightAway {
  installDependencies
  Start-Sleep -s 3
  startAppRightAway
}

# ---------------------

# start https://sporeas.surge.sh
open https://sporeas.surge.sh

installDepsAndStartRightAway

# ---------------------
