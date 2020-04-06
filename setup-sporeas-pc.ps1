# to run this file, right click on it inside File Explorer, and choose "Run with PowerShell"

function downloadPythonInstaller {
  # download Python 3.7 for Windows:
  [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
  Invoke-WebRequest -Uri https://www.python.org/ftp/python/3.7.7/python-3.7.7-amd64.exe -OutFile ./setup-python-pc.exe
}

function openPythonGraphicalInstaller {
  Start-Process setup-python-pc.exe -NoNewWindow -Wait
  Remove-Item setup-python-pc.exe

  $PyPath = ";" + $env:UserProfile + "\AppData\Local\Programs\Python\Python37\"
  $PyScriptPath =";" + $env:UserProfile + "\AppData\Local\Programs\Python\Python37\Scripts\"

  if ($env:Path -like "*$PyPath*") {
    Write-Host "Python path already exists"
  } else {
    Write-Host "Python path does not exist, adding path.."
    [Environment]::SetEnvironmentVariable("Path",$env:Path + $PyPath,"User")
  }
  
  if ($env:Path -like "*$PyScriptPath*") {
    Write-Host "Python scripts path already exists"
  } else {
    Write-Host "Python scripts path does not exist, adding path.."
    [Environment]::SetEnvironmentVariable("Path",$env:Path + $PyScriptPath,"User")
  }

  $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
}

function installPython {
  Write-Host 'Python 3.7.7 is not set up or installed. Attempting install now.'
  downloadPythonInstaller
  openPythonGraphicalInstaller
}

function installMoreDependencies {
  Write-Host 'Installing more dependencies.'
  # pip3 is included with Python 3
  py -3.7 -m pip install --upgrade pip
  pip3 install eventlet
  pip3 install flask
  pip3 install flask_socketio
  pip3 install requests
  pip3 install pyOpenSSL==19.1.0
}

function installAllDependeciesOnce {
  # install Python only if Python 3.7 is not already installed
  $cmd = $env:UserProfile + "\AppData\Local\Programs\Python\Python37\python.exe"
  $p = & $cmd -V 2>&1
  $Path = $env:UserProfile + "\AppData\Local\Programs\Python\Python37"
  $exp = Test-Path $Path
  if (-Not $exp) {
    Write-Host "Python37 does not exist"
    installPython
  }
  elseif ($p -is [System.Management.Automation.ErrorRecord]) {
    Write-Host "Error during python version query"
    installPython
  }
  elseif ($p -ne "Python 3.7.7") {
    Write-Host "Python version is not 3.7.7"
    installPython
  }
  # pip automatically checks if deps are already installed
  installMoreDependencies
}

function runApp {
  ./startup.vbs
  Start-Sleep -s 3
  start http://127.0.0.1:9000/admin # if simulating: open http://127.0.0.1:9000/admin
}

# ---------------------

start https://sporeas.surge.sh # if simulating: open https://sporeas.surge.sh
installAllDependeciesOnce # only if not already installed
runApp

# ---------------------
