//Sporeas 1.1.0
function en_sanitize (text) {
  const enReg = /^[a-zA-Z0-9-,:'"() ]*$/;
  let invalid = false;
  if (enReg.test(text) == false){
    invalid = false;
  }
  return invalid;
}

function ch_sanitize (text) {
  const chReg = /^[a-zA-Z0-9-,:'"() \u4E00-\u9FFF\u3400-\u4DFF\uF900-\uFAFF\u300C\u300D]*$/;
  let invalid = false;
  if (chReg.test(text)==false) {
    invalid = false;
  }
  return invalid;
}

$(document).ready(function() {
  $('.ui.dropdown').dropdown({fullTextSearch: true});
  $('#content').hide();
  $('#project').attr('disabled', true);
  $('#sidebar').hide();
  $('.menu .item').tab();
  const socket = io.connect('https://' + document.domain + ':' + location.port);

  $('#title').prop('disabled', false);
  $('#ch_title').prop('disabled', false);
  $('.ui.dropdown').removeClass('disabled');
  $('#verse').prop('disabled', false);

  if (sessionStorage) {
    const active = sessionStorage.getItem('user');
    // console.log(sessionStorage.getItem('api'));
    // console.log(active);
    if (sessionStorage.getItem('connected') == 'True') {
      $('#content').show();
      $('#sidebar').show();
      $('#connect').hide();
      $('#mainitem').addClass('active');
      $('#maintab').addClass('active');
      socket.emit('user active', {
        user: active,
      });
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
      // console.log(sessionStorage.getItem('api'));
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
      //sessionStorage.removeItem('user');
    }
  });

  socket.on('no passage', function(msg) {
    if (msg.out_of_range) {
      $('#error1').hide();
      $('#error2').show();
      $('#update').addClass('ui form error');
    }
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
    if (/^[a-zA-Z0-9-,:() ]*$/.test($('#hymn_input').val()) == false) {
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
    if (/^[a-zA-Z0-9-,:() ]*$/.test($('#m_hymn_input').val()) == false) {
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
    if (/^[a-zA-Z0-9-,:() ]*$/.test($('#m_hymn_input').val()) == false) {
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
    if (/^[a-zA-Z0-9-,:() ]*$/.test($('#m_hymn_input').val()) == false) {
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
      // console.log(typeof(hymnStorage));
      if (hymnStorage){
        hymnStorage = hymnStorage.split(':')[1].trim();
      } else {
        hymnStorage = ''
      }
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
    window.open('https://tjcav.ceed.se/' + sessionStorage.getItem('user'), '_blank');
  });

  $('button.help').click(function() {
    window.open('https://tjcav.ceed.se/how-to', '_blank');
  });

  $('form#update').submit(function() {
    const apiState = sessionStorage.getItem('api');
    const invalidTitle = /^[a-zA-Z0-9-,:'"() ]*$/.test($('#title').val()) == false;
    const chReg = /^[a-zA-Z0-9-,:'"() \u4E00-\u9FFF\u3400-\u4DFF\uF900-\uFAFF\u300C\u300D]*$/;
    const invalidChTitle = chReg.test($('#ch_title').val()) == false;
    const invalidHymn = /^[a-zA-Z0-9-,:'() ]*$/.test($('#hymn').val()) == false;
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

  $('#add_announce').click(function() {
    if (en_sanitize($('#engAnn').val())) {
      $('#announcements').addClass('ui form error');
      // console.log('invalid');
      return false;
    } else if (ch_sanitize($('#chAnn').val())) {
      $('#announcements').addClass('ui form error');
      // console.log('invalid');
      return false;
    } else if (en_sanitize($('#announcement_title').val()) || ch_sanitize($('#announcement_title').val())){
      $('#announcements').addClass('ui form error');
      // console.log('invalid');
      return false;
    } else {
      $('#announcements').removeClass('error');
      const active = sessionStorage.getItem('user');
      socket.emit('add announce', {
        user: active,
        english: $('#engAnn').val().replace(/ /g, '&nbsp;'), // &nbsp; to preserve spacing in HTML
        chinese: $('#chAnn').val().replace(/ /g, '&nbsp;'),
        department: $('#dd_dep option:selected').text(),
      });
    }
  });

  $('#ann_update').click(function(){
    if (en_sanitize($('#bible_reading').val()) || en_sanitize($('#dish_washing').val())) {
      $('#announcements').addClass('ui form error');
      // console.log('invalid');
      return false;
    } else {
      const active = sessionStorage.getItem('user');
      socket.emit('header update', {
        user: active,
        bible_reading: $('#dd_reading option:selected').text() + ' ' + $('#bible_reading').val(),
        cleaning: $('#cleaning_group option:selected').text(),
        dish_washing: $('#dish_washing').val(),
      });
    }
  });

  $('#clear_announce').click(function() {
    const active = sessionStorage.getItem('user');
    socket.emit('clear announce', {user: active});
  });

  $('#delete_announce').click(function() {
    const active = sessionStorage.getItem('user');
    socket.emit('delete announce', {user: active});
  });

  $('#show_announce').click(function() {
    const active = sessionStorage.getItem('user');
    socket.emit('show announce', {user: active});
  });

  $('#edit_announce').click(function() {
    const active = sessionStorage.getItem('user');
    window.open('https://tjcav.ceed.se/' + sessionStorage.getItem('user') + '_announcement', '_blank');
  });
});
