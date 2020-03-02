/* eslint-disable require-jsdoc */
//Sporeas 1.1.0

var date = new Date();
let month = parseInt(date.getMonth());
month = month + 1;
var dateString = date.getFullYear() + "-" + month.toString() + "-" +date.getDate();

function isOverflown(element) {
  // console.log(element.scrollHeight);
  // console.log($(window.top).height());
  return element.scrollHeight > $(window.top).height();
}

function transformedIsOverflown(element) {
  // console.log(element.getBoundingClientRect().height);
  // console.log($(window.top).height());
  return element.getBoundingClientRect().height > $(window.top).height();
}

function stringProcessToInt(string) {
  string = string.replace(/\D/g, '');
  return parseInt(string);
}

function update_announce(announceList, id){
  for (i=0; i<announceList.length; i++){
    let bullet = $("<li></li>").text(announceList[i]);
    // console.log(bullet);
    // console.log(announceList[i]);
    $('#' + id).append(bullet);
  }
}
var element_count = 0;
function screenAdjust(element) {
  let user = window.location.pathname;
  user = user.substr(1);
  const msg = JSON.parse(localStorage.getItem(user));
  const fontSize = document.getElementById('title').style.fontSize;
  fontSizeInt = stringProcessToInt(fontSize);
  let newFontSize = '';
  // console.log(fontSizeInt);
  // console.log(isOverflown(element));
  while (isOverflown(element) != true) {
    if (fontSizeInt < 100) {
      fontSizeInt = fontSizeInt + 5;
    } else {
      break;
    }
    newFontSize = fontSizeInt.toString() + 'px';
    // console.log(newFontSize);
    document.getElementById('title').style.fontSize = newFontSize;
    document.getElementById('ch_title').style.fontSize = newFontSize;
    document.getElementById('hymn').style.fontSize = newFontSize;
    document.getElementById('verse').style.fontSize = newFontSize;
    // console.log(document.getElementById('title').style.fontSize);
    msg.font = newFontSize;
    localStorage.setItem(user, JSON.stringify(msg));
  }
  while (isOverflown(element)) {
    fontSizeInt = fontSizeInt - 5;
    newFontSize = fontSizeInt.toString() + 'px';
    // console.log(newFontSize);
    document.getElementById('title').style.fontSize = newFontSize;
    document.getElementById('ch_title').style.fontSize = newFontSize;
    document.getElementById('hymn').style.fontSize = newFontSize;
    document.getElementById('verse').style.fontSize = newFontSize;
    // console.log(document.getElementById('title').style.fontSize);
    msg.font = newFontSize;
    localStorage.setItem(user, JSON.stringify(msg));
  }
}

function announcementsScale(element) {
  let user = window.location.pathname;
  user = user.substr(1);
  var scale = 0.8;
  const x = document.getElementById("main");
  const msg = JSON.parse(localStorage.getItem(user));
  if (msg != null) {
    scale = msg.scale;
  }
  $("body").css({
    "-webkit-transform": "scale(" + scale.toString()+")",
    "-moz-transform": "scale(" + scale.toString()+")",
    "transform": "scale(" +scale.toString()+")"
  });
  while (transformedIsOverflown(element) != true) {
    if (scale < 1) {
      scale = scale + 0.01;
    } else {
      break;
    }
    $("body").css({
      "-webkit-transform": "scale(" + scale.toString()+")",
      "-moz-transform": "scale(" + scale.toString()+")",
      "transform": "scale(" +scale.toString()+")"
    });
    if (msg != null){
    msg.scale = scale;
    localStorage.setItem(user, JSON.stringify(msg));
    }
  }
  while (transformedIsOverflown(element)) {
    scale = scale - 0.01;
    $("body").css({
      "-webkit-transform": "scale(" + scale.toString()+")",
      "-moz-transform": "scale(" + scale.toString()+")",
      "transform": "scale(" +scale.toString()+")"
    });
    if (msg != null){
    msg.scale = scale;
    localStorage.setItem(user, JSON.stringify(msg));
    }
  }

}

function spaceBar(e){
  let user = window.location.pathname;
  user = user.substr(1);
  const msg = JSON.parse(localStorage.getItem(user));
  // console.log(msg);
  const eng_verses = msg.overlay;
  const ch_verses = msg.ch_overlay;
  // console.log(eng_verses);
  if ($('#modal').hasClass("visible") && e.which === 32) {
    for (i = 0; i < eng_verses.length; i++) {
      if ($('#overlay').html() == eng_verses[i] && i+1 < eng_verses.length){
        $('#overlay').html(eng_verses[i+1]);
        $('#ch_overlay').html(ch_verses[i+1]);
        break;
      } else if ($('#overlay').html() == eng_verses[i] && i+1 == eng_verses.length){
        $('.ui.basic.modal').modal('toggle');
        break;
      }
    }
    // console.log("SPACEBAR Pressed");
  } else if (e.which === 32 && $('#verse').text().length > 6 && $('#grid').is(':visible') ){
    $('.ui.basic.modal').modal('toggle');
    $('#overlay').html(eng_verses[0]);
    $('#ch_overlay').html(ch_verses[0]);
  }
}

$(document).ready(function() {
  // console.log(element_count);
  const screenWidth = document.body.offsetWidth;
  //document.getElementById('announcements').style.width = screenWidth*0.95 + 'px !important';
  //document.getElementById('items').style.width = screenWidth + 'px !important';
  // console.log('the screen width is: ' +screenWidth);
  $('.ui.modal').modal();
  $('.ui.basic.modal').modal({centered: true});
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
    let msg = JSON.parse(localStorage.getItem(user));
    // console.log(msg.state);
    socket.emit('get state', {user: window.location.pathname});
  });

  let user = window.location.pathname;
  user = user.substr(1);
  // console.log(user);

  var msg = JSON.parse(localStorage.getItem(user));
  var announcements = localStorage.getItem(user+'_ann');

  if (msg == null){
    var msg = {
      "title": "English Title",
      "ch_title": "Chinese Title",
      "verse": '',
      "book": '',
      "overlay": '',
      "ch_overlay": '',
      "state": 'false',
      "font": '100px',
      "scale": 1
    };
  }

  if (announcements != null) {
    $('#announcements').html(announcements);
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
    // console.log(msg.state);
    // console.log(typeof(msg.state));
    // console.log(storage.hymn);
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
    $("body").css({
      "-webkit-transform": "scale(1)",
      "-moz-transform": "scale(1)",
      "transform": "scale(1)"
    });
    msg.scale = 1;
    // console.log(msg);
    localStorage.setItem(user, JSON.stringify(msg));
    screenAdjust(document.getElementById('grid'));
    $('#announcements').hide();
    $('#grid').show();
    $('#break1').show();
    $('#break2').show();
  });

  socket.on('scroll', function() {
    const msg = JSON.parse(localStorage.getItem(user));
    const scrollState = msg.hymn_scroll;
    const hymnList = msg.hymn_list;
    let temp = '';
    let scrollStateVal = 0;
    const check = hymnList.length -1;
    // console.log(scrollState);
    // console.log(typeof(scrollState));
    // console.log(hymnList);
    // console.log(hymnList.length);
    // console.log(typeof(hymnList));
    // console.log(parseInt(scrollState));
    // console.log(scrollState.toString());
    // console.log(check);
    if (hymnList == null || scrollState == null) {
      return;
    }
    $('#hymn').html('讚美詩 Hymn: ');
    if (scrollState == 'null') {
      // console.log('entered');
      scrollStateVal = 0;
      temp = '<u>' + hymnList[0] + '</u>';
      // console.log(temp);
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
          // console.log(temp);
          $('#hymn').append(', ' + temp);
        } else if (i == 0 && i != scrollStateVal) {
          $('#hymn').append(hymnList[0]);
        } else {
          $('#hymn').append(', ' + hymnList[i]);
        }
      }

      // console.log(scrollStateVal.toString());
      msg.hymn_scroll = scrollStateVal.toString();
      msg.hymn = $('#hymn').html();
      localStorage.setItem(user, JSON.stringify(msg));
      return;
    } else if (check == parseInt(scrollState) || check < parseInt(scrollState)) {
      scrollStateVal = 0;
      // console.log(temp);
      msg.hymn_scroll = 'null';
      $('#hymn').html('讚美詩 Hymn: ' + msg.hymn_list);
      msg.hymn = $('#hymn').html();
      localStorage.setItem(user, JSON.stringify(msg));
      return;
    }
  });

  socket.on('reset', function(msg) {
    const msgActive = JSON.parse(localStorage.getItem(user));
    $('#verse').html(msg.verse);
    msgActive.book = '';
    msgActive.verse = '';
    localStorage.setItem(user, JSON.stringify(msgActive));
  });

  function addBlock(obj) {
    // console.log(obj.text);
    $('#' + element_count.toString()).append('\
      <div class="middle aligned centered content" style="padding-left: 100px;">\
        <div class="ui centered header" style="font-size: 30px">' + obj.title + '</div>\
        <div class="description">\
          <p style="font-size: 30px;">'+ obj.text+'</p>\
        </div>\
        <div class="extra">'
          +dateString+
        '</div>\
      </div>');
  }


  socket.on('update announcements', function(msg){
    while ($('#' + element_count.toString()).length) {
      element_count++;
    }
    // console.log(element_count.toString());
    // console.log(msg.image);
    let image = msg.image;

    $('#items-wrapper').append('<div class="item" id="' + element_count.toString() + '" style="padding-left: 5vw;"></div>');
    if (image == 'GA'){
      $('#' + element_count.toString()).append('<div class="ui small circular image avatar" style="overflow: hidden;"><img src="static/GA.png"></div>');
    } else if (image == 'RA') {
      $('#' + element_count.toString()).append('<div class="ui small circular image avatar" style="overflow: hidden;"><img src="static/RA.png"></div>');
    } else if (image == 'FA') {
      $('#' + element_count.toString()).append('<div class="ui small circular image avatar" style="overflow: hidden;"><img src="static/FA.png"></div>');
    } else if (image == 'RE') {
      $('#' + element_count.toString()).append('<div class="ui small circular image avatar" style="overflow: hidden;"><img src="static/RE.png"></div>');
    }
    addBlock(msg);
    element_count++;
    announcementsScale(document.getElementById("items"));
    localStorage.setItem(user+'_ann', $('#announcements').html());
    $('#grid').hide();
    $('#break1').hide();
    $('#break2').hide();
    $('#announcements').show();
  });

  socket.on('misc updates', function(msg){
    // console.log('updating bottom header...');
    // console.log(msg);
    $('#bible_reading').html('Bible Reading: ' + msg.reading);
    $('#cleaning_group').html('Cleaning Group: ' +msg.cleaning);
    $('#dish_washing').html('Dish Washing: ' + msg.dish_washing);
    localStorage.setItem(user+'_ann', $('#announcements').html());
    if (document.getElementById("grid").style.display == 'none'){
      //announcementsScale(document.getElementById("items"));
    }
  });

  socket.on('clear announcements', function(){
    // console.log('clearing...')
    $("div").remove(".item");
    element_count = 0;
    localStorage.setItem(user+'_ann', $('#announcements').html());
    if (document.getElementById("grid").style.display == 'none'){
      announcementsScale(document.getElementById("items"));
    }
  });

  socket.on('delete announcements', function(){
    // console.log('deleting...')
    $("#items-wrapper .item").last().remove();
    localStorage.setItem(user+'_ann', $('#announcements').html());
    if (document.getElementById("grid").style.display == 'none'){
      announcementsScale(document.getElementById("items"));
    }
  });

  socket.on('show announcements', function(msg){
    $('#grid').hide();
    $('#break1').hide();
    $('#break2').hide();
    $('#announcements').show();
    announcementsScale(document.getElementById("items"));
  });
});
