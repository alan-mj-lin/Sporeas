// TODO: refactor DRY

$('button#highlight-service').click(function() {
  $('#welcome-overlay').hide();
  const active = sessionStorage.getItem('user');
  if (!active) return; // avoid showing tab when user is not logged in
  $('a[data-tab="main"]').click();
  $('input#title').effect('highlight', {color: 'blue'}, 1000);
});

$('button#highlight-hymn-singing').click(function() {
  $('#welcome-overlay').hide();
  const active = sessionStorage.getItem('user');
  if (!active) return; // avoid showing tab when user is not logged in
  $('a[data-tab="utility"]').click();
  $('#hymn_input').effect('highlight', {color: 'blue'}, 1000);
  $('button#hymn_singing').effect('shake', 1000);
});

$('button#highlight-morning-prayer').click(function() {
  $('#welcome-overlay').hide();
  const active = sessionStorage.getItem('user');
  if (!active) return; // avoid showing tab when user is not logged in
  $('a[data-tab="utility"]').click();
  $('#m_hymn_input').effect('highlight', {color: 'blue'}, 1000);
  $('button#morning_prayer').effect('shake', 1000);
});

$('button#highlight-announcements').click(function() {
  $('#welcome-overlay').hide();
  const active = sessionStorage.getItem('user');
  if (!active) return; // avoid showing tab when user is not logged in
  $('a[data-tab="announcements"]').click();
  $('#GA').effect('highlight', {color: 'blue'}, 1000);
});

$('button#highlight-holy-communion').click(function() {
  $('#welcome-overlay').hide();
  const active = sessionStorage.getItem('user');
  if (!active) return; // avoid showing tab when user is not logged in
  $('a[data-tab="utility"]').click();
  $('#hf_hymn_input').effect('highlight', {color: 'blue'}, 1000);
  $('button#holy_communion').effect('shake', 1000);
});

$('button#highlight-foot-washing').click(function() {
  $('#welcome-overlay').hide();
  const active = sessionStorage.getItem('user');
  if (!active) return; // avoid showing tab when user is not logged in
  $('a[data-tab="utility"]').click();
  $('#hf_hymn_input').effect('highlight', {color: 'blue'}, 1000);
  $('button#foot_washing').effect('shake', 1000);
});

// hide welcome overlay in this session if user asks to:
let showWelcomeOverlay = false || (sessionStorage.getItem('showWelcomeOverlay') === 'true');
if (showWelcomeOverlay) {
  $('#welcome-overlay').show();
} else {
  $('#welcome-overlay').hide();
}
$('button#stop-showing-welcome-overlay').click(function() {
  $('#welcome-overlay').hide();
  showWelcomeOverlay = false;
  sessionStorage.setItem('showWelcomeOverlay', showWelcomeOverlay);
});
