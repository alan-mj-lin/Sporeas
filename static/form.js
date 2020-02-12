//Sporeas 1.1.0
function en_sanitize (text) {
  const enReg = /^[a-zA-Z0-9-,:'" ]*$/;
  let invalid = false;
  if (enReg.test(text) == false){
    invalid = false;
  }
  return invalid;
}

function ch_sanitize (text) {
  const chReg = /^[a-zA-Z0-9-,:'" \u4E00-\u9FFF\u3400-\u4DFF\uF900-\uFAFF\u300C\u300D]*$/;
  let invalid = false;
  if (chReg.test(text)==false) {
    invalid = false;
  }
  return invalid;
}

$(document).ready(function() {
  $('#wip').hide();
  $('.ui.dropdown').dropdown({fullTextSearch: true});
  $('#content').hide();
  $('#project').attr('disabled', true);
  $('.menu .item').tab();
  const socket = io.connect('http://' + document.domain + ':' + location.port);

  $('#title').prop('disabled', false);
  $('#ch_title').prop('disabled', false);
  $('.ui.dropdown').removeClass('disabled');
  $('#verse').prop('disabled', false);

  if (sessionStorage) {
    const active = sessionStorage.getItem('user');
    console.log(sessionStorage.getItem('api'));
    if (sessionStorage.getItem('connected') == 'True') {
      $('#content').show();
      $('#connect').hide();
      $('#mainitem').addClass('active');
      $('#maintab').addClass('active');
      socket.emit('get state', {user: active});
    }
    if (sessionStorage.getItem('api')== 'false') {
      $('#toggle_label').removeClass('ui basic green label');
      $('#toggle').removeClass('ui green button');
      $('#toggle_label').addClass('ui basic red label');
      $('#toggle').addClass('ui red button');
      $('#toggle').html('Off');
    } else if (sessionStorage.getItem('api') == null) {
      sessionStorage.setItem('api', 'false');
      console.log(sessionStorage.getItem('api'));
    } else {
      $('#toggle_label').removeClass('ui basic red label');
      $('#toggle').removeClass('ui red button');
      $('#toggle_label').addClass('ui basic green label');
      $('#toggle').addClass('ui green button');
      $('#toggle').html('On');
    }
  }

  $('form#connect').submit(function() {
    if (/^[a-zA-Z0-9- ]*$/.test($('#user').val()) == false) {
      $('#connect_error').html('Input can only have alphabets and numbers');
      $('#connect').addClass('ui form error');
      return false;
    } else if ($.trim($('#user').val()) != '') {
      const user = $('#user').val();
      socket.emit('user active', {
        user: $('#user').val(),
      });
      socket.emit('get state', {user: $('#user').val()});
      sessionStorage.setItem('user', user);
      return false;
    }
  });

  socket.on('auth event', function(msg) {
    if (msg.auth != 'True') {
      sessionStorage.setItem('connected', 'True');
      $('#project').attr('disabled', false);
      $('#connect').removeClass('ui form error');
      $('#connect').addClass('ui form success');
      $('#con_msg').html('Connected to room: /'+ $('#user').val());
    } else {
      $('#connect').addClass('ui form error');
    }
  });

  socket.on('no passage', function(msg) {
    if (msg.out_of_range) {
      $('#error1').hide();
      $('#error2').show();
      $('#update').addClass('ui form error');
    }
  });

  $('#cam_hymn').click(function() {
	 socket.emit('camera request', {type: 'Hymn Singing'}); 
  });
  
  $('#cam_sermon').click(function() {
	  socket.emit('camera request', {type: 'Sermon'});
  });
  
  $('#project').click(function(event) {
    $('#content').show();
    $('#connect').hide();
    $('#mainitem').addClass('active');
    $('#maintab').addClass('active');
    $('#welcome-overlay').show();
    sessionStorage.setItem('showWelcomeOverlay', true);
    event.preventDefault();
  });

  socket.on('state form check', function() {
    const active = sessionStorage.getItem('user');
    if ($('#toggle').hasClass('ui green button')) {
      socket.emit('toggle api', {
        user: active, state: 'true',
      });
    } else {
      socket.emit('toggle api', {
        user: active,
        state: 'false',
      });
    }
  });

  $('#reset').click(function() {
    const active = sessionStorage.getItem('user');
    socket.emit('reset', {
      user: active,
      title: '',
      ch_title: '',
      hymn: '',
      book: '',
      verse: '',
    });
    return false;
  });

  $('#hymn_singing').click(function() {
    const active = sessionStorage.getItem('user');
    if (/^[a-zA-Z0-9-,: ]*$/.test($('#hymn_input').val()) == false) {
      $('#service_mode_error').removeClass('hidden');
    } else {
      $('#service_mode_error').addClass('hidden');
      socket.emit('custom message', {
        user: active,
        type: 'hymn',
        hymn: $('#hymn_input').val(),
      });
      return false;
    }
  });

  $('#morning_prayer').click(function() {
    const active = sessionStorage.getItem('user');
    if (/^[a-zA-Z0-9-,: ]*$/.test($('#m_hymn_input').val()) == false) {
      $('#service_mode_error').removeClass('hidden');
    } else {
      $('#service_mode_error').addClass('hidden');
      socket.emit('custom message', {
        user: active,
        type: 'morning',
        hymn: $('#m_hymn_input').val(),
      });
      return false;
    }
  });

  $('#holy_communion').click(function() {
    const active = sessionStorage.getItem('user');
    if (/^[a-zA-Z0-9-,: ]*$/.test($('#m_hymn_input').val()) == false) {
      $('#serivce_mode_error').removeClass('hidden');
    } else {
      $('#serivce_mode_error').addClass('hidden');
      socket.emit('custom message', {
        user: active,
        type: 'communion',
        hymn: $('#hf_hymn_input').val(),
      });
      return false;
    }
  });

  $('#foot_washing').click(function() {
    const active = sessionStorage.getItem('user');
    if (/^[a-zA-Z0-9-,: ]*$/.test($('#m_hymn_input').val()) == false) {
      $('#serivce_mode_error').removeClass('hidden');
    } else {
      $('#serivce_mode_error').addClass('hidden');
      socket.emit('custom message', {
        user: active,
        type: 'footwashing',
        hymn: $('#hf_hymn_input').val(),
      });
      return false;
    }
  });

  $('#toggle').click(function() {
    const active = sessionStorage.getItem('user');
    if ($('#toggle').hasClass('ui green button')) {
      $('#toggle_label').removeClass('ui basic green label');
      $('#toggle').removeClass('ui green button');
      $('#toggle_label').addClass('ui basic red label');
      $('#toggle').addClass('ui red button');
      $('#toggle').html('Off');
      sessionStorage.setItem('api', 'false');
      socket.emit('toggle api', {
        user: active, state: 'false',
      });
      return false;
    } else {
      $('#toggle_label').removeClass('ui basic red label');
      $('#toggle').removeClass('ui red button');
      $('#toggle_label').addClass('ui basic green label');
      $('#toggle').addClass('ui green button');
      $('#toggle').html('On');
      sessionStorage.setItem('api', 'true');
      socket.emit('toggle api', {
        user: active,
        state: 'true',
      });
      return false;
    }
  });

  $('#scroll').click(function() {
    const active = sessionStorage.getItem('user');
    socket.emit('hymn scroll', {
      user: active,
    });
  });

  $('#verse_update').click(function() {
    const active = sessionStorage.getItem('user');
    const apiState = sessionStorage.getItem('api');
    const msg = JSON.parse(localStorage.getItem(active));
    if (/^[a-zA-Z0-9-,: ]*$/.test($('#verse').val()) == false) {
      $('#error2').hide();
      $('#error1').show();
      $('#update').addClass('ui form error');
      return false;
    } else {
      $('#update').removeClass('ui form error');
      $('#update').addClass('ui form');
      let hymnStorage = msg.hymn;
      console.log(typeof(hymnStorage));
      hymnStorage = hymnStorage.split(':')[1].trim();
      socket.emit('my broadcast event', {
        user: active,
        title: msg.title,
        ch_title: msg.ch_title,
        hymn: hymnStorage,
        book: $('#ddbible option:selected').text(),
        verse: $('#verse').val(),
        hymn_scroll: msg.hymn_scroll,
        state: apiState,
      });
      return false;
    }
  });

  $('#new_tab').click(function() {
    window.open('http://127.0.0.1:9000/' + sessionStorage.getItem('user'), '_blank');
  });

  $('button.help').click(function() {
    window.open('http://127.0.0.1:9000/how-to', '_blank');
  });

  $('form#update').submit(function() {
    const apiState = sessionStorage.getItem('api');
    const invalidTitle = /^[a-zA-Z0-9-,:'" ]*$/.test($('#title').val()) == false;
    const chReg = /^[a-zA-Z0-9-,:'" \u4E00-\u9FFF\u3400-\u4DFF\uF900-\uFAFF\u300C\u300D]*$/;
    const invalidChTitle = chReg.test($('#ch_title').val()) == false;
    const invalidHymn = /^[a-zA-Z0-9-,:' ]*$/.test($('#hymn').val()) == false;
    const invalidVerse = /^[a-zA-Z0-9-,: ]*$/.test($('#verse').val()) == false;
    if (invalidTitle || invalidChTitle || invalidHymn || invalidVerse) {
      $('#error2').hide();
      $('#error1').show();
      $('#update').addClass('ui form error');
      return false;
    } else {
      $('#update').removeClass('ui form error');
      $('#update').addClass('ui form');
      const active = sessionStorage.getItem('user');
      socket.emit('my broadcast event', {
        user: active,
        title: $('#title').val(),
        ch_title: $('#ch_title').val(),
        hymn: $('#hymn').val(),
        book: $('#ddbible option:selected').text(),
        verse: $('#verse').val(),
        hymn_scroll: "null",
        state: apiState,
      });
      return false;
    }
  });

  $('#announce').click(function() {
    if (en_sanitize($('#GA').val()) || en_sanitize($('#FA').val()) || en_sanitize($('#RA').val()) || en_sanitize($('#RE').val())) {
      $('#announcements').addClass('ui form error');
      console.log('invalid');
      return false;
    } else if (ch_sanitize($('#ch_GA').val()) || ch_sanitize($('#ch_FA').val()) || ch_sanitize($('#ch_RA').val()) || ch_sanitize($('#ch_RE').val())) {
      $('#announcements').addClass('ui form error');
      console.log('invalid');
      return false;
    } else {
      $('#update').removeClass('error');
      const active = sessionStorage.getItem('user');
      socket.emit('announce', {
        user: active,
        GA: $('#GA').val(),
        FA: $('#FA').val(),
        RA: $('#RA').val(),
        RE: $('#RE').val(),
        ch_GA: $('#ch_GA').val(),
        ch_FA: $('#ch_FA').val(),
        ch_RA: $('#ch_RA').val(),
        ch_RE: $('#ch_RE').val()
      });
    }
  });

  $('#show_announce').click(function() {
    const active = sessionStorage.getItem('user');
    socket.emit('show announce', {user: active});
  });

  $('form#announcements textarea').each(function(i, e) {
    $(e).keyup(function() {
      const inputText = $(e).val();
      const lintedText = lintAnnouncement(inputText);
      $(e).val(lintedText);
    })
  });
});

function lintAnnouncement(inputText) {
  let foundSomethingToFix = false;
  const announcementRegex = /(^ +|^[-*]\D|^[0-9]+(\.|\)) )/i;
  // remove preceding spaces, "- ", "* ", "1. ", "1) ", but accept "1.2 million" and "-1 Celsius"
  let lintedText = inputText.split('\n');
  for (let i = 0; i < lintedText.length; i++) {
    if (!foundSomethingToFix && announcementRegex.test(lintedText[i])) {
      foundSomethingToFix = true;
    }
    lintedText[i] = lintedText[i].replace(announcementRegex, '');
  }
  if (foundSomethingToFix) {
    alert('Do not type in bullet points.\nJust use new lines (hit enter key) for each point.');
  }
  return lintedText.join('\n');
}
