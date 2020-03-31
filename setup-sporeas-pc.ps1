# to run this file, right click on it inside File Explorer, and choose "Run with PowerShell"
 
function downloadPythonInstaller {
  # download Python 3.7 for Windows:
  Invoke-WebRequest https://www.python.org/ftp/python/3.7.7/python-3.7.7-amd64.exe -OutFile ./setup-python-pc.exe
}

function openPythonGraphicalInstaller {
  ./setup-python-pc.exe
}

function installPythonIfMissing {
  Write-Host 'Python 3.7.7 is not set up or installed. Attempting install now.'
  downloadPythonInstaller
  openPythonGraphicalInstaller
}

function installMoreDependencies {
  Write-Host 'Installing more dependencies.'
  # pip3 is included with Python 3
  pip3 install eventlet
  pip3 install flask
  pip3 install flask_socketio
  pip3 install requests
  pip3 install pyOpenSSL==19.1.0
}

function installAllDependeciesOnce {
  $p = & { python3.7 -V } 2>&1
  if ($p -is [System.Management.Automation.ErrorRecord]) {
    installPythonIfMissing
    installMoreDependencies
  }
  elseif ($PythonVersion -ne 3.7.7) {
    installPythonIfMissing
    installMoreDependencies
  }
}

function runApp {
  # TODO: figure out how to run a delayed background task in PowerShell
  # and then run python3.7 first, and open page after 3s second delay
  start http://127.0.0.1:9000/admin
  Start-Sleep -s 3
  python3.7 basic_app.py
}

# ---------------------

start https://sporeas.surge.sh
cd ~/Desktop
installAllDependeciesOnce
cd ~/Desktop/Sporeas
runApp
Write-Host -NoNewLine 'Hit any key to close';
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown');

# ---------------------
