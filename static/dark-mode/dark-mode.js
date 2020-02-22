// aka batman mode

let darkModeOn = true;
let invertClassElements = [];
$(document).ready(function() {
  // for better perf, only run once
  setup();
});
function setup() {
  // get/set invertClassElements and session storage
  if (invertClassElements.length === 0) {
    invertClassElements = Array.from($('.inverted'));
    sessionStorage.setItem('invertClassElements', invertClassElements);
  } else {
    invertClassElements = Array.from(JSON.parse(sessionStorage.getItem('invertClassElements')));
  }
  // get/set darkModeOn and session storage
  if (sessionStorage.getItem('darkModeOn')) {
    darkModeOn = sessionStorage.getItem('darkModeOn') === 'true';
  } else {
    sessionStorage.setItem('darkModeOn', darkModeOn);
  }
  setMode();
}

function setMode() {
  if (darkModeOn) {
    goDarkMode();
  } else {
    goLightMode();
  }
}

function toggleDarkMode() {
  if (darkModeOn) {
    goLightMode();
  } else {
    goDarkMode();
  }
  darkModeOn = !darkModeOn;
  sessionStorage.setItem('darkModeOn', darkModeOn);
}

function goLightMode() {
  $('link[href="/static/dark-mode/dark-mode.css"]').prop('disabled', true);
  invertClassElements.forEach(function(e) {
    $(e).removeClass('inverted');
  });
}

function goDarkMode() {
  $('link[href="/static/dark-mode/dark-mode.css"]').removeAttr('disabled');
  invertClassElements.forEach(function(e) {
    $(e).addClass('inverted');
  });
}
