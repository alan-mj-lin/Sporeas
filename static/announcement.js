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

    $('.lock.icon:not(.open)').hide();
    $('.lock.open.icon').show();

    $('#update').click(function() {
        $("p").attr('contenteditable', 'false');
        localStorage.setItem(user+'_ann', $('#announcements').html());
        console.log(user);
        socket.emit('update announcement', {room: user});
        $('.lock.icon:not(.open)').show();
        $('.lock.open.icon').hide();
        sessionStorage.setItem('contenteditable', false);
    });

    $('#edit').click(function() {
        const get_announcement = localStorage.getItem(user+ '_ann');
        const contenteditable = sessionStorage.getItem('contenteditable');
        if (get_announcement != null) {
            $('#announcements').html(get_announcement);
            if (contenteditable && contenteditable === 'false') {
                $("p").attr('contenteditable', 'true');
                sessionStorage.setItem('contenteditable', true);
            } else {
                $("p").attr('contenteditable', 'false');
                sessionStorage.setItem('contenteditable', false);
            }
        }
        $('.lock.icon:not(.open)').toggle();
        $('.lock.open.icon').toggle();
    });
});