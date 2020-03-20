$(document).ready(function() {
    const protocol = window.location.protocol;
    const socket = io.connect(
      protocol + '//' + document.domain + ':' + location.port
    );
    let user = window.location.pathname;
    user = user.substr(1);
    user = user.split('_')[0]
    let announcement = localStorage.getItem(user+ '_ann');
    if (announcement != null) {
        $('#announcements').html(announcement);
        $("p").attr('contenteditable','true');
    }
    $('.ui.dimmer').dimmer({opacity: 0.3}).dimmer('show');
    $('.sidebar').sidebar('setting', 'transition', 'overlay');
    /*
    $('.lock.icon:not(.open)').hide();
    $('.lock.open.icon').show();
    */
    
    document.body.onkeyup = function(e){
        if(e.key === "Escape"){
            $('.ui.sidebar').sidebar('toggle');
        }
    }
    $('#update').click(function() {
        $("p").attr('contenteditable', 'false');
        sessionStorage.setItem('contenteditable', false);
        localStorage.setItem(user+'_ann', $('#announcements').html());
        console.log(user);
        socket.emit('update announcement', {room: user});
        /*
        $('.lock.icon:not(.open)').show();
        $('.lock.open.icon').hide();
        */
    });

    $('#edit').click(function() {
        const get_announcement = localStorage.getItem(user+ '_ann');
        const contentIsLocked = sessionStorage.getItem('contenteditable') !== 'true';
        if (get_announcement != null && contentIsLocked) {
            $('#announcements').html(get_announcement);
            $("p").attr('contenteditable', 'true');
            sessionStorage.setItem('contenteditable', true);
        }
        /*
        $('.lock.icon:not(.open)').hide();
        $('.lock.open.icon').show();
        */
    });

    $('.message .close')
    .on('click', function() {
        $(this)
        .closest('.message')
        .transition('fade')
        ;
        $('.ui.dimmer').dimmer({opacity: 0}).dimmer('hide');
    })
    ;
});
