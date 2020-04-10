# [Sporeas](https://translate.google.com/?hl=en#el/en/σπορέας)

**Sporeas ([σπορέας](https://translate.google.com/?hl=en#el/en/σπορέας)) is Greek for "sower".**

The main purpose of this application is to help sermon speakers get their message across by projecting sermon
titles and bible verses to help the listener follow along, in hopes that they can get the most out of the
messages on the pulpit. In that sense it helps with the "sowing" process of the word, and therefore it has
been given the name "sporeas" which is greek for "sower".

[![Build Status](https://travis-ci.com/alan-mj-lin/Sporeas.svg?branch=master)](https://travis-ci.com/alan-mj-lin/Sporeas)

## To set up locally:
1. Ensure Python 3.7 is installed. Ensure python version is not less than 3.6; Python 3.8 should not be used as it cannot setup eventlet. You can check in command line with: `python --version` or with `python3 --version`
2. `pip install eventlet`
3. `pip install flask`
4. `pip install flask_socketio`
5. `pip install requests`
6. `pip install pyOpenSSL==19.1.0` -> otherwise monkey patching for eventlet will break stuff
5. Run basic_app.py in command line: `python basic_app.py`
6. Go to http://127.0.0.1:9000/admin in your browser

### To get feedback on code best practices:
- For python: `bash pyCodeFeedback.sh`
- For javascript: `bash jsCodeFeedback.sh`

### To run the automated test from CLI:

1. Check that you have Node.js and npm: `node --version` and `npm --version` in CLI. If get error messages, install [Node.js](https://nodejs.org). Then go inside our project folder and install project dependencies with `npm install` just once.
2. Ideally close all browser windows (this avoids having previous state affect the current test run).
3. [`npm run test`](https://github.com/alan-mj-lin/Sporeas/blob/Sporeas-1.1.0/package.json) or just `npm t` (either one will run `basic_app.py` and then [`selenium-side-runner`](https://selenium.dev/selenium-ide/docs/en/introduction/command-line-runner))
    - _Or_ to run the test with visuals showing: `npm run test-visually` and wait for all automatically-opened tabs to close. **_NOTE: AVOID TOUCHING ANYTHING IN THE BROWSER WHILE THIS IS RUNNING._**
3. When it's done, you should see all tests passed (green) in the CLI.

### To edit the automated test (or run it manually):

(Make sure that you have `basic_app.py` already running.)

1. Install the [Chrome](https://www.google.com/chrome) extension [Selenium IDE](https://chrome.google.com/webstore/detail/selenium-ide/mooikfkahbdckldjjndioackbalphokd).
2. Click on the extension's icon and "Open an existing project": select the [Sporeas-test.side](https://github.com/alan-mj-lin/Sporeas/blob/Sporeas-1.1.0/Sporeas-test.side) file.
3. You can now edit/run the test. It should look something like [this](https://www.dropbox.com/s/4vi8o41twjafhsu/Selenium_IDE_Chrome_Extension_Demo.mov).

## To update the easy setup instructions at <https://sporeas.surge.sh>

```bash
npm run surge
```

## Windows setup to run the webapp on startup:
1. Create a batch script to run basic_app.py (this file should be located wherever basic_app.py is)
2. Create a vbs script to run the batch script in minimal mode (so that a cmd shell doesn't show up everytime you boot)
3. Create a shortcut for the vbs script and place it in the StartUp directory:
  - Go to START and type in "Run" and hit enter
  - In the prompt type in "shell:startup"
  - Place the shortcut in the directory
  
After these steps are taken the webapp should be able to run on every fresh boot of Windows

## Linux startup:
- Use systemctl and create a service script to run on startup

## Mac??
(look into launchctl)
