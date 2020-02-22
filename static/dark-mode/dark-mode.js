// aka batman mode

let darkModeOn = false;
let invertableClassElements = [];
$(document).ready(function() {
  setup();
});
function setup() {
  // get/set invertableClassElements and session storage
  if (invertableClassElements.length === 0) {
    // for better perf, only run once
    invertableClassElements = Array.from($('.invertable'));
    sessionStorage.setItem('invertableClassElements', invertableClassElements);
  } else if (sessionStorage.getItem('invertableClassElements')) {
    invertableClassElements = Array.from(JSON.parse(sessionStorage.getItem('invertableClassElements')));
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
  invertableClassElements.forEach(function(e) {
    $(e).removeClass('inverted');
  });
}

function goDarkMode() {
  $('link[href="/static/dark-mode/dark-mode.css"]').removeAttr('disabled');
  invertableClassElements.forEach(function(e) {
    $(e).addClass('inverted');
  });
}
