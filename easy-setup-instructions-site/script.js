adjustTextToOS();

function getOS() {
  if (navigator.platform.startsWith('Mac')) {
    return 'Mac';
  } else if (navigator.platform.startsWith('Win')) {
    return 'Windows';
  } else {
    return navigator.platform;
  }
}

function adjustTextToOS() {
  var os = getOS();
  if (!os) return;
  if (os !== 'Mac' && os !== 'Windows') {
    alert("Looks like you're not using a supported device. Please try using a Mac or Windows computer.");
    return;
  }
  var osMessage = "Looks like you're using a " + os + " computer.";
  document.getElementById('os-id').innerHTML = osMessage;
  var pythonDownloadLink = "https://www.python.org/downloads/release/python-377/" + (os === 'Mac' ? '#macos-users' : '#windows-users');
  document.getElementById('python-download-link').href = pythonDownloadLink;
  var pythonInstaller = (os === 'Mac' ? 'setup-python-mac.pkg' : 'setup-python-pc.exe');
  document.getElementById('python-installer').innerHTML = ': ' + '<code>' + pythonInstaller + '</code>';
  var pythonYoutubeLink = ' If in doubt, ask for help or search on <a href="https://www.youtube.com/results?search_query=install+python+3.7+' + (os === 'Mac' ? 'on+mac' : 'on+windows') + '" target="_blank">YouTube</a>.';
  document.getElementById('python-youtube-link').innerHTML = pythonYoutubeLink;
  var depsInstaller = (os === 'Mac' ? 'setup-sporeas-mac.command' : 'setup-sporeas-pc.ps1');
  var depsInstallerMessage = '<code>' + depsInstaller + '</code>';
  document.getElementById('deps-installer').innerHTML = depsInstallerMessage;
}
