/* eslint-disable require-jsdoc */
//Sporeas 1.1.0
function isOverflown(element) {
  console.log(element.scrollHeight);
  console.log($(window.top).height());
  return element.scrollHeight > $(window.top).height();
}

function stringProcessToInt(string) {
  string = string.replace(/\D/g, '');
  return parseInt(string);
}

function update_announce(announceList, id){
  for (i=0; i<announceList.length; i++){
    let bullet = $("<li></li>").text(announceList[i]);
    console.log(bullet);
    console.log(announceList[i]);
    $('#' + id).append(bullet);
  }
}

function screenAdjust(element) {
  let user = window.location.pathname;
  user = user.substr(1);
  const msg = JSON.parse(localStorage.getItem(user));
  const fontSize = document.getElementById('title').style.fontSize;
  fontSizeInt = stringProcessToInt(fontSize);
  let newFontSize = '';
  console.log(fontSizeInt);
  console.log(isOverflown(element));
  while (isOverflown(element) != true) {
    if (fontSizeInt < 100) {
      fontSizeInt = fontSizeInt + 5;
    } else {
      break;
    }
    newFontSize = fontSizeInt.toString() + 'px';
    console.log(newFontSize);
    document.getElementById('title').style.fontSize = newFontSize;
    document.getElementById('ch_title').style.fontSize = newFontSize;
    document.getElementById('hymn').style.fontSize = newFontSize;
    document.getElementById('verse').style.fontSize = newFontSize;
    console.log(document.getElementById('title').style.fontSize);
    msg.font = newFontSize;
    localStorage.setItem(user, JSON.stringify(msg));
  }
  while (isOverflown(element)) {
    fontSizeInt = fontSizeInt - 5;
    newFontSize = fontSizeInt.toString() + 'px';
    console.log(newFontSize);
    document.getElementById('title').style.fontSize = newFontSize;
    document.getElementById('ch_title').style.fontSize = newFontSize;
    document.getElementById('hymn').style.fontSize = newFontSize;
    document.getElementById('verse').style.fontSize = newFontSize;
    console.log(document.getElementById('title').style.fontSize);
    msg.font = newFontSize;
    localStorage.setItem(user, JSON.stringify(msg));
  }
}

function spaceBar(e){
  let user = window.location.pathname;
  user = user.substr(1);
  const msg = JSON.parse(localStorage.getItem(user));
  console.log(msg);
  const eng_verses = msg.overlay;
  const ch_verses = msg.ch_overlay;
  console.log(eng_verses);
  if ($('#modal').hasClass("visible") && e.which === 32) {
    //console.log($('#overlay').html());
    for (i = 0; i < eng_verses.length; i++) {
      //console.log(eng_verses[i]);
      if ($('#overlay').html() == eng_verses[i] && i+1 < eng_verses.length){
        $('#overlay').html(eng_verses[i+1]);
        $('#ch_overlay').html(ch_verses[i+1]);
        break;
      } else if ($('#overlay').html() == eng_verses[i] && i+1 == eng_verses.length){
        $('.ui.basic.modal').modal('toggle');
        break;
      }
    }
    console.log("SPACEBAR Pressed");
  } else if (e.which === 32 && $('#verse').text().length > 6 && $('#grid').is(':visible') ){
    $('.ui.basic.modal').modal('toggle');
    $('#overlay').html(eng_verses[0]);
    $('#ch_overlay').html(ch_verses[0]);
  }
}

$(document).ready(function() {
  $('.ui.modal').modal();
  $('.ui.basic.modal').modal({centered: false});
  $('#grid').show();
  $('#break1').show();
  $('#break2').show();
  $('#announcements').hide();
  const protocol = window.location.protocol;
  const socket = io.connect(
      protocol + '//' + document.domain + ':' + location.port
  );
  socket.on('connect', function() {
    socket.emit('get sid', {user: window.location.pathname});
  });

  let user = window.location.pathname;
  user = user.substr(1);
  console.log(user);

  var msg = JSON.parse(localStorage.getItem(user));
  var announcements = JSON.parse(localStorage.getItem(user+'_ann'));

  if (msg == null){
    var msg = {
      "title": "English Title",
      "ch_title": "Chinese Title",
      "verse": '',
      "book": '',
      "overlay": '',
      "ch_overlay": '',
      "state": 'false',
      "font": '100px'
    }
  }

  if (announcements != null){
    $("li").remove();
    update_announce(announcements.GA, 'GA');
    update_announce(announcements.FA, 'FA');
    update_announce(announcements.RA, 'RA');
    update_announce(announcements.RE, 'RE');
    update_announce(announcements.ch_GA, 'cGA');
    update_announce(announcements.ch_RA, 'cRA');
    update_announce(announcements.ch_FA, 'cFA');
    update_announce(announcements.ch_RE, 'cRE');
  }

  const font = msg.font;

  $('#title').html(msg.title);
  $('#ch_title').html(msg.ch_title);
  $('#hymn').html(msg.hymn);
  $('#verse').html(msg.book + msg.verse);
  $('#innerTitle').html(msg.title);
  $('#innerChTitle').html(msg.ch_title);
  $('#overlay').html(msg.overlay[0]);
  $('#ch_overlay').html(msg.ch_overlay[0]);
  if (msg.state != null){
    if(msg.state != 'true'){
      $(window).off('keypress', spaceBar);
    } else {
      $(window).on('keypress', spaceBar);
    }
  } else {
    $(window).off('keypress', spaceBar);
  }
  if (font) {
    document.getElementById('title').style.fontSize = font;
    document.getElementById('ch_title').style.fontSize = font;
    document.getElementById('hymn').style.fontSize = font;
    document.getElementById('verse').style.fontSize = font;
  }

  localStorage.setItem(user, JSON.stringify(msg));

  socket.on('state check', function(msg) {
    const storage = JSON.parse(localStorage.getItem(user));
    console.log(msg.state);
    console.log(typeof(msg.state));
    console.log(storage.hymn);
    if (msg.state == 'true') {
      socket.emit('my broadcast event', {
        user: user,
        title: storage.title,
        ch_title: storage.ch_title,
        hymn: storage.hymn,
        book: storage.book,
        verse: storage.verse,
        state: msg.state,
      });
      $(window).on('keypress', spaceBar);
      storage.state = 'true';
      localStorage.setItem(user, JSON.stringify(storage));
    } else {
      $(window).off('keypress', spaceBar);
      storage.state = 'false';
      localStorage.setItem(user, JSON.stringify(storage));
    }
  });

  socket.on('refresh', function(msg) {
    $('#title').html(msg.title);
    $('#ch_title').html(msg.ch_title);
    $('#hymn').html('讚美詩 Hymn: '+msg.hymn);
    msg.hymn = $('#hymn').html();
    $('#verse').html(msg.book + msg.verse);
    $('#innerTitle').html(msg.title);
    $('#innerChTitle').html(msg.ch_title);
    $('#overlay').html(msg.overlay[0]);
    $('#ch_overlay').html(msg.ch_overlay[0]);
    console.log(msg);
    localStorage.setItem(user, JSON.stringify(msg));
    screenAdjust(document.getElementById('grid'));
    $('#announcements').hide();
    $('#grid').show();
    $('#break1').show();
    $('#break2').show();
  });

  // WIP
  socket.on('scroll', function() {
    const msg = JSON.parse(localStorage.getItem(user));
    const scrollState = msg.hymn_scroll;
    const hymnList = msg.hymn_list;
    let temp = '';
    let scrollStateVal = 0;
    const check = hymnList.length -1;
    console.log(scrollState);
    console.log(typeof(scrollState));
    console.log(hymnList);
    console.log(hymnList.length);
    console.log(typeof(hymnList));
    console.log(parseInt(scrollState));
    console.log(scrollState.toString());
    console.log(check);
    if (hymnList == null || scrollState == null) {
      return;
    }
    $('#hymn').html('讚美詩 Hymn: ');
    if (scrollState == 'null') {
      console.log('entered');
      scrollStateVal = 0;
      temp = '<u>' + hymnList[0] + '</u>';
      console.log(temp);
      msg.hymn_scroll = '0';
      localStorage.setItem(user, JSON.stringify(msg));
      for (i=0; i < hymnList.length; i++) {
        if (i == 0) {
          $('#hymn').append(temp);
        } else {
          $('#hymn').append(', ' + hymnList[i]);
        }
      }
      msg.hymn = $('#hymn').html();
      localStorage.setItem(user, JSON.stringify(msg));
      return;
    } else if (parseInt(scrollState) >= 0 && parseInt(scrollState) < check) {
      scrollStateVal = parseInt(scrollState);
      scrollStateVal ++;
      for (i=0; i < hymnList.length; i++) {
        if (i == scrollStateVal) {
          temp = '<u>' + hymnList[i] + '</u>';
          console.log(temp);
          $('#hymn').append(', ' + temp);
        } else if (i == 0 && i != scrollStateVal) {
          $('#hymn').append(hymnList[0]);
        } else {
          $('#hymn').append(', ' + hymnList[i]);
        }
      }

      console.log(scrollStateVal.toString());
      msg.hymn_scroll = scrollStateVal.toString();
      msg.hymn = $('#hymn').html();
      localStorage.setItem(user, JSON.stringify(msg));
      return;
    } else if (check == parseInt(scrollState) || check < parseInt(scrollState)) {
      scrollStateVal = 0;
      console.log(temp);
      msg.hymn_scroll = 'null';
      $('#hymn').html('讚美詩 Hymn: ' + msg.hymn_list);
      msg.hymn = $('#hymn').html();
      localStorage.setItem(user, JSON.stringify(msg));
      return;
    }
  });

  socket.on('reset', function(msg) {
    const msgActive = JSON.parse(localStorage.getItem(user));
    /*
    msg.title = $('#title').html();
    msg.hymn = $('#hymn').html();
    msg.ch_title = $('#ch_title').html();
    msg.overlay = $('#overlay').html();
    msg.ch_overlay = $('#ch_overlay').html();
    */
    $('#verse').html(msg.verse);
    msgActive.book = '';
    msgActive.verse = '';
    localStorage.setItem(user, JSON.stringify(msgActive));

    //console.log(msg);
    //localStorage.setItem(user, JSON.stringify(msg));
  });

  socket.on('update announcements', function(msg){
    $("li").remove();
    update_announce(msg.GA, 'GA');
    update_announce(msg.FA, 'FA');
    update_announce(msg.RA, 'RA');
    update_announce(msg.RE, 'RE');
    update_announce(msg.ch_GA, 'cGA');
    update_announce(msg.ch_RA, 'cRA');
    update_announce(msg.ch_FA, 'cFA');
    update_announce(msg.ch_RE, 'cRE');
    localStorage.setItem(user+'_ann', JSON.stringify(msg));
    $('#grid').hide();
    $('#break1').hide();
    $('#break2').hide();
    $('#announcements').show();
  });

  socket.on('show announcements', function(msg){
    $('#grid').hide();
    $('#break1').hide();
    $('#break2').hide();
    $('#announcements').show();
  });
});
