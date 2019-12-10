# Toronto-TJC-AV

To set up locally:
1. Ensure Python 3.7 is installed (Ensure python version is not less than 3.6; Python 3.8 should not be used as it cannot setup eventlet)
2. pip install eventlet
3. pip install flask
4. pip install flask_socketio
5. run basic_app.py in command line

Windows setup to run the webapp on startup:
1. Create a batch script to run basic_app.py (this file should be located wherever basic_app.py is)
2. Create a vbs script to run the batch script in minimal mode (so that a cmd shell doesn't show up everytime you boot)
3. Create a shortcut for the vbs script and place it in the StartUp directory:
  - Go to START and type in "Run" and hit enter
  - In the prompt type in "shell:startup"
  - Place the shortcut in the directory
  
After these steps are taken the webapp should be able to run on every fresh boot of Windows

Linux startup:
- User systemctl and create a service script to run on startup

Mac?? look into launchctl
