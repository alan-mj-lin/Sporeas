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
  
  var pythonInstaller = (os === 'Mac' ? 'python-3.7.7-macosx10.9.pkg' : 'python-3.7.7-amd64.exe');
  document.getElementById('python-installer').innerHTML = ' <code>' + pythonInstaller + '</code>';
  
  var downloadPythonInstallerLink = (os === 'Mac' ? 'https://www.python.org/ftp/python/3.7.7/python-3.7.7-macosx10.9.pkg': 'https://www.python.org/ftp/python/3.7.7/python-3.7.7-amd64.exe');
  document.getElementById('download-python-installer-link').href = downloadPythonInstallerLink;
  
  var pythonYoutubeLink = ' If in doubt, ask for help, or search on <a href="https://www.youtube.com/results?search_query=install+python+3.7+' + (os === 'Mac' ? 'on+mac' : 'on+windows') + '" target="_blank">YouTube</a>.';
  document.getElementById('python-youtube-link').innerHTML = pythonYoutubeLink;
  
  var depsInstaller = (os === 'Mac' ? 'setup-sporeas-mac.command' : 'setup-sporeas-pc.ps1');
  var action = (os === 'Mac' ? 'by double-clicking on ' : 'by <strong><em>right</em></strong>-clicking on ');
  var postAction = (os === 'Mac' ? '' : ' and choosing "Run with PowerShell".');
  var depsInstallerMessage = action + '<code>' + depsInstaller + '</code>' + postAction;
  document.getElementById('deps-installer').innerHTML = depsInstallerMessage;
  
  var stopSporeasAction = (os === 'Mac' ? 'double-click': '<strong><em>right</em></strong>-click');
  document.getElementById('stop-sporeas-action').innerHTML = stopSporeasAction;
  
  var stopSporeasFile = (os === 'Mac' ? ' stop-sporeas-mac.command' : ' stop-sporeas-pc.ps1');
  document.getElementById('stop-sporeas-file').innerHTML = stopSporeasFile;
  
  var stopSporeasPostAction = (os === 'Mac' ? '' : ' and choose "Run with PowerShell".');
  document.getElementById('stop-sporeas-post-action').innerHTML = stopSporeasPostAction;
}
