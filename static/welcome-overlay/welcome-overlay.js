function highlightUIElement(tabName, inputboxID, buttonID) {
  hideOverlay();
  const active = sessionStorage.getItem('user');
  if (!active) return; // avoid showing tab when user is not logged in
  if (tabName) {
    $('a[data-tab="' + tabName + '"]').click();
  }
  if (inputboxID) {
    $('#' + inputboxID).effect('highlight', {color: 'blue'}, 1000);
  }
  if (buttonID) {
    $('#' + buttonID).effect('shake', 1000);
  }
}

$('.highlight-service').click(function() {
  highlightUIElement('main', 'title');
});

$('.highlight-hymn-singing').click(function() {
  highlightUIElement('utility', 'hymn_input', 'hymn_singing');
});

$('.highlight-morning-prayer').click(function() {
  highlightUIElement('utility', 'm_hymn_input', 'morning_prayer');
});

$('.highlight-holy-communion').click(function() {
  highlightUIElement('utility', 'hf_hymn_input', 'holy_communion');
});

$('.highlight-foot-washing').click(function() {
  highlightUIElement('utility', 'hf_hymn_input', 'foot_washing');
});

$('.highlight-announcements').click(function() {
  highlightUIElement('announcements', 'GA');
});

// hide welcome overlay in this session if user asks to:
let showWelcomeOverlay = false || (sessionStorage.getItem('showWelcomeOverlay') === 'true');
if (showWelcomeOverlay) {
  showOverlay();
} else {
  hideOverlay();
}
// hide sidebar if user is not logged in:
const active = sessionStorage.getItem('user');
if (active == null) {
  setTimeout(function() { // workaround
    collapseSideBar();
  }, 0);
}

$('button#stop-showing-welcome-overlay').click(function() {
  hideOverlay();
  showWelcomeOverlay = false;
  sessionStorage.setItem('showWelcomeOverlay', showWelcomeOverlay);
});

// Semantic UI sidebar settings:
$('.sidebar')
  .sidebar('setting', 'dimPage', false)
  .sidebar('setting', 'closable', false);

collapseSideBar();

function showOverlay() {
  $('#welcome-overlay').show();
  collapseSideBar();
}

function hideOverlay() {
  $('#welcome-overlay').hide();
  expandSidebar();
}

function expandSidebar() {
  $('.sidebar').sidebar('show');
  setTimeout(function() { // workaround
    $('.pusher').css({transform: 'translate3d(140px,0,0)'});
  }, 0);
}

function collapseSideBar() {
  $('.sidebar').sidebar('hide');
  $('.pusher').css({transform: 'translate3d(0,0,0)'});
  setTimeout(function() { // workaround
    $('.pusher').removeClass('dimmed');
  }, 0);
}
