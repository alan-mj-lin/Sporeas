// TODO: refactor DRY

$('button#highlight-service').click(function() {
  $('#welcome-overlay').hide();
  const active = sessionStorage.getItem('user');
  if (!active) return; // avoid showing tab when user is not logged in
  document.querySelector('a[data-tab="main"]').click();
});

$('button#highlight-hymn-singing').click(function() {
  $('#welcome-overlay').hide();
  const active = sessionStorage.getItem('user');
  if (!active) return; // avoid showing tab when user is not logged in
  document.querySelector('a[data-tab="utility"]').click();
});

$('button#highlight-morning-prayer').click(function() {
  $('#welcome-overlay').hide();
  const active = sessionStorage.getItem('user');
  if (!active) return; // avoid showing tab when user is not logged in
  document.querySelector('a[data-tab="utility"]').click();
});

$('button#highlight-announcements').click(function() {
  $('#welcome-overlay').hide();
  const active = sessionStorage.getItem('user');
  if (!active) return; // avoid showing tab when user is not logged in
  document.querySelector('a[data-tab="announcements"]').click();
});

$('button#highlight-holy-communion').click(function() {
  $('#welcome-overlay').hide();
  const active = sessionStorage.getItem('user');
  if (!active) return; // avoid showing tab when user is not logged in
  document.querySelector('a[data-tab="utility"]').click();
});

$('button#highlight-foot-washing').click(function() {
  $('#welcome-overlay').hide();
  const active = sessionStorage.getItem('user');
  if (!active) return; // avoid showing tab when user is not logged in
  document.querySelector('a[data-tab="utility"]').click();
});

// hide welcome overlay in this session if user asks to:
let showWelcomeOverlay = false || (sessionStorage.getItem('showWelcomeOverlay') === 'true');
if (showWelcomeOverlay) {
  $('#welcome-overlay').show();
} else {
  $('#welcome-overlay').hide();
}
console.log(showWelcomeOverlay)
console.log(sessionStorage.getItem('showWelcomeOverlay') === 'true')
$('button#stop-showing-welcome-overlay').click(function() {
  $('#welcome-overlay').hide();
  showWelcomeOverlay = false;
  sessionStorage.setItem('showWelcomeOverlay', showWelcomeOverlay);
});
