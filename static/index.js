function isOverflown(element) {
  console.log(element.scrollHeight);
  console.log($(window.top).height());
  return element.scrollHeight > $(window.top).height();
}

function stringProcessToInt(string){
  string = string.replace(/\D/g, '');
  return parseInt(string);
}

function screenAdjust(element) {
  var fontSize = document.getElementById('title').style.fontSize;
  fontSizeInt = stringProcessToInt(fontSize);
  var newFontSize = '';
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
    localStorage.setItem("font", newFontSize);
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
    localStorage.setItem("font", newFontSize);
  }
}

$(document).ready(function(){
    $('.ui.modal').modal();
    $(".ui.basic.modal").modal({ centered: false });
    var protocol = window.location.protocol;
    var socket = io.connect(protocol + '//' + document.domain + ':' + location.port);
    socket.on('connect', function() {
        socket.emit('get sid', {user: window.location.pathname});
    });

    var user = window.location.pathname;
    user = user.substr(1);

    if (localStorage.length !=0 ) {
        var msg = JSON.parse(localStorage.getItem(user));
        console.log(msg);
        if (msg != null) {
            $('#title').html(msg.title);
            $('#ch_title').html(msg.ch_title);
            if (localStorage.getItem("hymn_state") == null){
                $('#hymn').html(msg.hymn);
            } else {
                $('#hymn').html(localStorage.getItem("hymn_state"));
            }
            $('#verse').html(msg.book + msg.verse);
            $('#innerTitle').html(msg.title);
            $('#innerChTitle').html(msg.ch_title);
            $('#overlay').html(msg.overlay);
            $('#ch_overlay').html(msg.ch_overlay);
        }
    }
    if (localStorage.getItem("state") != null && localStorage.getItem("state") != "True"){
      $(document).off("click");
    }
    if (localStorage.getItem("hymn_scroll") == null) {
      localStorage.setItem("hymn_scroll", "null");
    }
    if (localStorage.getItem("font") != null) {
      document.getElementById('title').style.fontSize = localStorage.getItem("font");
      document.getElementById('ch_title').style.fontSize = localStorage.getItem("font");
      document.getElementById('hymn').style.fontSize = localStorage.getItem("font");
      document.getElementById('verse').style.fontSize = localStorage.getItem("font");
    }

    socket.on('state check', function(msg) {
        var storage = JSON.parse(localStorage.getItem(user));
        console.log(msg.state);
        console.log(typeof(msg.state));
        console.log(storage.hymn);
        if (msg.state == "true") {
            socket.emit('my broadcast event', {user: user, title: storage.title, ch_title: storage.ch_title, hymn: storage.hymn, book: storage.book, verse: storage.verse, state: msg.state});
            $(document).click(function() {
                console.log($('#verse').text().length);
                if ($('#verse').text().length > 6){
                    $(".ui.basic.modal").modal("toggle");
                }
            });
            localStorage.setItem("state", "True");
        } else {
            $(document).off("click");
            localStorage.setItem("state", "False");
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
        $('#overlay').html(msg.overlay);
        $('#ch_overlay').html(msg.ch_overlay);
        console.log(msg);
        localStorage.setItem(user, JSON.stringify(msg));
        localStorage.setItem("hymn_list", msg.hymn_list);
        localStorage.setItem("hymn_scroll", "null");
        localStorage.setItem("hymn_state", msg.hymn);
        screenAdjust(document.getElementById('grid'));
    });

    //WIP
    socket.on('scroll', function(){
        var scrollState = localStorage.getItem("hymn_scroll");
        var hymnList = localStorage.getItem("hymn_list").split(',');
        var temp = '';
        var scrollStateVal = 0;
        var check = hymnList.length -1;
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
        if (scrollState == "null") {
            console.log('entered');
            scrollStateVal = 0;
            temp = "<u>" + hymnList[0] + "</u>";
            console.log(temp);
            localStorage.setItem("hymn_scroll", "0");
            for (i=0; i < hymnList.length; i++) {
                if (i == 0){
                    $('#hymn').append(temp);
                } else {
                    $('#hymn').append(", " + hymnList[i]);
                }
            }
            localStorage.setItem("hymn_state", $('#hymn').html());
            return;
        } else if (parseInt(scrollState) >= 0 && parseInt(scrollState) < check) {
            scrollStateVal = parseInt(scrollState);
            scrollStateVal ++;
            for (i=0; i < hymnList.length; i++) {
                if (i == scrollStateVal){
                    temp = "<u>" + hymnList[i] + "</u>";
                    console.log(temp);
                    $('#hymn').append(", " + temp);
                } else if (i == 0 && i != scrollStateVal){
                    $('#hymn').append(hymnList[0]);
                } else {
                    $('#hymn').append(", " + hymnList[i]);
                }
            }
            localStorage.setItem("hymn_scroll", scrollStateVal.toString());
            console.log(scrollStateVal.toString());
            localStorage.setItem("hymn_state", $('#hymn').html());
            return;
        } else if (check == parseInt(scrollState)) {
            scrollStateVal = 0;
            console.log(temp);
            localStorage.setItem("hymn_scroll", "null");
            $('#hymn').html('讚美詩 Hymn: ' + localStorage.getItem("hymn_list"));
            localStorage.setItem("hymn_state", $('#hymn').html());
            return;
        }
    });

    socket.on('reset', function(msg) {
        msg.title = $('#title').html();
        msg.hymn = $('#hymn').html();
        msg.ch_title = $('#ch_title').html();
        msg.overlay = $('#overlay').html();
        msg.ch_overlay = $('#ch_overlay').html();
        $('#verse').html(msg.verse);
        console.log(msg);
        localStorage.setItem(user, JSON.stringify(msg));
    });
});
$(document).click(function() {
    console.log($('#verse').text().length);
    if ($('#verse').text().length > 6){
        $(".ui.basic.modal").modal("toggle");
    }
});
