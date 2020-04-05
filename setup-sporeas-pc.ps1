# to run this file, right click on it inside File Explorer, and choose "Run with PowerShell"
 
function downloadPythonInstaller {
  # download Python 3.7 for Windows:
  Invoke-WebRequest https://www.python.org/ftp/python/3.7.7/python-3.7.7-amd64.exe -OutFile ./setup-python-pc.exe
}

function openPythonGraphicalInstaller {
  ./setup-python-pc.exe
}

function installPython {
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
    installPython
    installMoreDependencies
  }
  elseif ($PythonVersion -ne 3.7.7) {
    installPython
    installMoreDependencies
  }
}

function goToScriptFolder {
  cd $MyInvocation.MyCommand.Path
  # cd $PSScriptRoot
}

function runApp {
  Start-Process -NoNewWindow python3.7 basic_app.py
  Start-Sleep -s 3
  start http://127.0.0.1:9000/admin # if simulating: open http://127.0.0.1:9000/admin
}

# ---------------------

start https://sporeas.surge.sh # if simulating: open https://sporeas.surge.sh
installAllDependeciesOnce
goToScriptFolder # for some reason you need to tell the script to go to its own folder
runApp
Write-Host -NoNewLine 'Hit any key to close';
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown');

# ---------------------
