start https://sporeas.surge.sh
open https://sporeas.surge.sh

# download Python 3.7 for Windows
Invoke-WebRequest https://www.python.org/ftp/python/3.7.7/python-3.7.7-amd64.exe -OutFile ./install-python.exe

# open Python graphical installer
./install-python.exe
# ./python-3.7.7-amd64.exe
