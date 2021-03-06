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

function passageScale() {
  document.getElementById('overlay').style.fontSize = '50px';
  document.getElementById('ch_overlay').style.fontSize = '55px';
  let enFontSize = document.getElementById('overlay').style.fontSize;
  let enFontSizeInt=stringProcessToInt(enFontSize);
  let chFontSize = document.getElementById('ch_overlay').style.fontSize;
  let chFontSizeInt = stringProcessToInt(chFontSize);
  console.log($('#overlay').height());
  console.log($('.vertical.scrolling.content').height());
  /*
  while ($('#overlay').height() < $('.vertical.scrolling.content').height()) {
    enFontSizeInt++;
    chFontSizeInt++;
    enFontSize = enFontSizeInt.toString() + 'px';
    chFontSize = chFontSizeInt.toString() + 'px';
    document.getElementById('overlay').style.fontSize = enFontSize;
    document.getElementById('ch_overlay').style.fontSize = chFontSize;
    break;
  }*/
  while ($('#overlay').height() > $('.vertical.scrolling.content').height()+6) {
    enFontSizeInt--;
    chFontSizeInt--;
    enFontSize = enFontSizeInt.toString() + 'px';
    chFontSize = chFontSizeInt.toString() + 'px';
    document.getElementById('overlay').style.fontSize = enFontSize;
    document.getElementById('ch_overlay').style.fontSize = chFontSize;
  }
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

function announcementsScale() {
  const headerHeight = $('div.header').css('height').replace('px', '');
  const footerHeight = $('footer').css('height').replace('px', '');
  const announcementsHeight = $('#announcements').css('height').replace('px','');
  const viewHeight = window.innerHeight;
  const announcementsWidth = $('#announcements').css('width').replace('px','');
  const viewWidth = window.innerWidth;
  const heightScale = (viewHeight - headerHeight - footerHeight)/announcementsHeight;
  const widthScale = viewWidth/announcementsWidth;
  let scale = Math.min(1, heightScale, widthScale);
  $('#items-wrapper').css({
    'transform-origin': '50% 0%',
    'transform': 'scale(' + scale + ')',
    'position': 'relative',
    'width': (100/scale) * 0.8 + 'vw',
    'left': (100 - 100/scale * 0.8)/2 + 'vw',
  });
}

function spaceBar(e){
  let user = window.location.pathname;
  user = user.substr(1);
  const msg = JSON.parse(localStorage.getItem(user));
  const eng_verses = msg.overlay;
  const ch_verses = msg.ch_overlay;
  if (msg.state == "true" && msg.state != null && msg.overlay.length != 0){
    if ($('#modal').hasClass("visible") && e.which === 32) {
      //console.log("SPACEBAR when shown");
      for (i = 0; i < eng_verses.length; i++) {
        if ($('#overlay').html() == eng_verses[i] && i+1 < eng_verses.length){
          $('#overlay').html(eng_verses[i+1]);
          //console.log($('#overlay').html());
          $('#ch_overlay').html(ch_verses[i+1]);
          passageScale();
          return;
        } else if ($('#overlay').html() == eng_verses[i] && i+1 == eng_verses.length){
          $('#modal').modal('hide');
          return;
        }
      }
    } else if (e.which === 32 && $('#verse').text().length > 6 && $('#grid').is(':visible') ){
      //console.log('SPACEBAR when not shown');
      $('#modal').modal('show');
      $('#overlay').html(eng_verses[0]);
      //console.log($('#overlay').html());
      $('#ch_overlay').html(ch_verses[0]);
      passageScale();
      return;
    }
  }
}

function scrollHymn() {
  let user = window.location.pathname;
  user = user.substr(1);
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
      "title": "",
      "ch_title": "",
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
  $(window).on('keypress', spaceBar);
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
      storage.state = 'true';
      localStorage.setItem(user, JSON.stringify(storage));
    } else {
      storage.state = 'false';
      localStorage.setItem(user, JSON.stringify(storage));
    }
  });

  socket.on('refresh', function(msg) {
    let prev_state = JSON.parse(localStorage.getItem(user))
    let process = true;
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
    if (prev_state.hymn_list){
      if (prev_state.hymn_list.length != msg.hymn_list.length){
        process = false;
      } else {
        for (i=0; i < prev_state.length; i++){
          prev_state.hymn_list[i] = prev_state.hymn_list[i].trim();
          msg.hymn_list[i] = msg.hymn_list[i].trim()
          if (prev_state.hymn_list[i] != msg.hymn_list[i]){
            process = false;
          }
        }
      }
    }
    if (process){
      if (prev_state.hymn_scroll){
        let scroll_num = parseInt(prev_state.hymn_scroll)
        if (scroll_num > 0 ){
          scroll_num -= 1;
          msg.hymn_scroll = scroll_num.toString();
        } else {
          msg.hymn_scroll = "null";
        }
      }
    }
    msg.scale = 1;
    // console.log(msg);
    localStorage.setItem(user, JSON.stringify(msg));
    screenAdjust(document.getElementById('grid'));
    $('#announcements').hide();
    $('#grid').show();
    $('#break1').show();
    $('#break2').show();
    if (process && msg.hymn_scroll != "null"){
      scrollHymn();
    } else if (process && prev_state.hymn_scroll == "0"){
	  scrollHymn();
	}
  });

  socket.on('scroll', scrollHymn);

  socket.on('reset', function(msg) {
    const msgActive = JSON.parse(localStorage.getItem(user));
    $('#verse').html(msg.verse);
    msgActive.book = '';
    msgActive.verse = '';
    localStorage.setItem(user, JSON.stringify(msgActive));
  });

  socket.on('no passage', function() {
    const msgActive = JSON.parse(localStorage.getItem(user));
    msgActive.overlay = [];
    msgActive.ch_overlay = [];
    localStorage.setItem(user, JSON.stringify(msgActive));
  });

  function addBlock(obj) {
    // console.log(obj.text);
    if (obj.english_text && obj.chinese_text) {
      $('#' + element_count.toString()).append('\
        <div class="aligned centered content">\
          <div class="description-wrapper">\
            <div class="description" style="font-size: 30px;">\
              <p contenteditable="false" style="display: inline-block;">'+ obj.english_text.replace(/\n/g, '<br/>') +'</p>\
            </div>\
            <div class="description" style="font-size: 30px; border-left: 3px solid lightgrey; padding-left: 10px;">\
              <p contenteditable="false" style="display: inline-block;">'+ obj.chinese_text.replace(/\n/g, '<br/>') +'</p>\
            </div>\
          </div>\
          <div class="extra" style="clear: left;">'
            +dateString+
          '</div>\
        </div>');
    } else if (obj.english_text || obj.chinese_text) {
      const text = obj.english_text || obj.chinese_text;
      $('#' + element_count.toString()).append('\
        <div class="aligned centered content">\
          <div class="description-wrapper-single">\
            <div class="description" style="font-size: 30px;">\
              <p contenteditable="false" style="display: inline-block;">'+ text.replace(/\n/g, '<br/>') +'</p>\
            </div>\
          </div>\
          <div class="extra" style="clear: left;">'
            +dateString+
          '</div>\
        </div>');
    }
  }


  socket.on('add announcements', function(msg){
    while ($('#' + element_count.toString()).length) {
      element_count++;
    }
    // console.log(element_count.toString());
    // console.log(msg.image);
    let image = msg.image;

    $('#items-wrapper').append('<div class="item" id="' + element_count.toString() + '"></div>');
    $('#' + element_count.toString()).append('<div class="ui small circular image avatar" style="overflow: hidden;"><img src="static/' + image + '.png"></div>');
    addBlock(msg);
    element_count++;
    announcementsScale();
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
      //announcementsScale();
    }
  });

  socket.on('clear announcements', function(){
    // console.log('clearing...')
    $("div").remove(".item");
    element_count = 0;
    localStorage.setItem(user+'_ann', $('#announcements').html());
    if (document.getElementById("grid").style.display == 'none'){
      announcementsScale();
    }
  });

  socket.on('delete announcements', function(){
    // console.log('deleting...')
    $("#items-wrapper .item").last().remove();
    localStorage.setItem(user+'_ann', $('#announcements').html());
    if (document.getElementById("grid").style.display == 'none'){
      announcementsScale();
    }
  });

  socket.on('show announcements', function(msg){
    $('#grid').hide();
    $('#break1').hide();
    $('#break2').hide();
    $('#announcements').show();
    announcementsScale();
  });

  socket.on('update ann', function(){
    let announcements = localStorage.getItem(user+ '_ann');
    $('#announcements').html(announcements);
    announcementsScale();
  });
});
