$(document).ready(function(){
            $('.ui.dropdown').dropdown({ fullTextSearch: true });
            $('#update').hide();
            $('#service_mode').hide();
            $("#project").attr("disabled", true);

            var socket = io.connect('http://' + document.domain + ':' + location.port);

            $('#title').prop('disabled', false);
            $('#ch_title').prop('disabled', false);
            $('.ui.dropdown').removeClass("disabled");
            $('#verse').prop('disabled', false);

            if (sessionStorage){
              if (sessionStorage.getItem("connected") == "True") {
                $('#update').show();
                $('#service_mode').show();
                $('#connect').hide();
              }
              if (sessionStorage.getItem("api")== "false") {
                $('#toggle_label').removeClass("ui basic green label");
                $('#toggle').removeClass("ui green button");
                $('#toggle_label').addClass("ui basic red label");
                $('#toggle').addClass("ui red button");
                $('#toggle').html("Off");
              }
            }

            $('form#connect').submit(function() {
              if(/^[a-zA-Z0-9- ]*$/.test($("#user").val()) == false) {
                $('#connect_error').html("Input can only have alphabets and numbers");
                $("#connect").addClass("ui form error");
                return false;
              } else if ($.trim($('#user').val()) != ''){
                var user = $('#user').val();
                socket.emit('user active', {user: $('#user').val()});
                sessionStorage.setItem("user", user);
                return false;
              }
            });

            socket.on('auth event', function(msg) {
              if (msg.auth != 'True') {
                sessionStorage.setItem("connected", "True");
                $("#project").attr("disabled", false);
                $("#connect").removeClass("ui form error");
                $("#connect").addClass("ui form success");
                $("#con_msg").html('Connected to room: /'+ $('#user').val());
              } else {
                $("#connect").addClass("ui form error");
              }
            });

            $('#project').click(function(event) {
              $('#update').show();
              $('#service_mode').show();
              $('#connect').hide();
              event.preventDefault();
            });

            $('#reset').click(function() {
              active = sessionStorage.getItem("user");
              socket.emit('reset', {user: active, title: '', ch_title: '', hymn: '', book: '', verse: ''});
              return false;
            });

            $('#hymn_singing').click(function() {
              active = sessionStorage.getItem("user");
              if (/^[a-zA-Z0-9-,: ]*$/.test($("#hymn_input").val()) == false) {
                alert("Input can have only alphabets and numbers.");
              } else {
                socket.emit('custom message', {user: active, type: 'hymn', hymn: $('#hymn_input').val()});
                return false;
              }
            });

            $('#morning_prayer').click(function() {
              active = sessionStorage.getItem("user");
              if (/^[a-zA-Z0-9-,: ]*$/.test($("#m_hymn_input").val()) == false) {
                alert("Input can have only alphabets and numbers.");
              } else {
                socket.emit('custom message', {user: active, type: 'morning', hymn: $('#m_hymn_input').val()});
                return false;
              }
            });

            $('#toggle').click(function() {
              active = sessionStorage.getItem("user");
              if ($('#toggle').hasClass("ui green button")) {
                $('#toggle_label').removeClass("ui basic green label");
                $('#toggle').removeClass("ui green button");
                $('#toggle_label').addClass("ui basic red label");
                $('#toggle').addClass("ui red button");
                $('#toggle').html("Off");
                sessionStorage.setItem("api", "false");
                socket.emit('toggle api', {user: active, state: 'false'});
                return false;
              } else {
                $('#toggle_label').removeClass("ui basic red label");
                $('#toggle').removeClass("ui red button");
                $('#toggle_label').addClass("ui basic green label");
                $('#toggle').addClass("ui green button");
                $('#toggle').html("On");
                sessionStorage.setItem("api", "true");
                socket.emit('toggle api', {user: active, state: 'true'});
                return false;
              }
            });

            $('#scroll').click(function(){
              active = sessionStorage.getItem("user");
              socket.emit('hymn scroll', {user: active});
            });

            $('#verse_update').click(function() {
              active = sessionStorage.getItem("user");
              api_state = sessionStorage.getItem("api");
              var msg = JSON.parse(localStorage.getItem(active));
              if (/^[a-zA-Z0-9-,: ]*$/.test($("#verse").val()) == false) {
                $('#update').addClass("ui form error");
                return false;
              } else {
                $('#update').removeClass("ui form error");
                $('#update').addClass("ui form");
                var hymnStorage = msg.hymn;
                console.log(typeof(hymnStorage));
                hymnStorage = hymnStorage.split(":")[1].trim();
                socket.emit('my broadcast event', {user: active, title: msg.title, ch_title: msg.ch_title, hymn: hymnStorage, book: $('#ddbible option:selected').text(), verse: $('#verse').val(), state: api_state});
                return false;
              }
            });

            $('#new_tab').click(function() {
              window.open('http://127.0.0.1:9000/' + sessionStorage.getItem("user"), '_blank');
            });

            $('form#update').submit(function() {
              api_state = sessionStorage.getItem("api");
              if(/^[a-zA-Z0-9-,:' ]*$/.test($("#title").val()) == false || /^[a-zA-Z0-9-,:' \u4E00-\u9FFF\u3400-\u4DFF\uF900-\uFAFF]*$/.test($("#ch_title").val()) == false || /^[a-zA-Z0-9-,:' ]*$/.test($("#hymn").val()) == false || /^[a-zA-Z0-9-,: ]*$/.test($("#verse").val()) == false) {
                $('#update').addClass("ui form error");
                return false;
              } else {
                $('#update').removeClass("ui form error");
                $('#update').addClass("ui form");
                active = sessionStorage.getItem("user");
                socket.emit('my broadcast event', {user: active, title: $('#title').val(), ch_title: $('#ch_title').val(), hymn: $('#hymn').val(), book: $('#ddbible option:selected').text(), verse: $('#verse').val(), state: api_state});
                return false;
              }
            });
        });
