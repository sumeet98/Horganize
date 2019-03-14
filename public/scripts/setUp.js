$(document).ready(function () {
    $('#createNew').hide();
    $('#joinExisting').hide();
    $('#lastStep').hide();
    $('#joinRoomButton').hide();

    $('#newRoom').click(function (e) {
        $('#stepOne').hide({
            duration: 'fast',
            easing: 'swing'
        });
        $('#createNew').show({
            duration: 'fast',
            easing: 'swing'
        });
        $('#secondPoint').addClass('active');
        $('#firstPoint').removeClass('active');

    });

    $('#joinRoom').click(function (e) {
        $('#stepOne').hide({
            duration: 'fast',
            easing: 'swing'
        });
        $('#joinExisting').show({
            duration: 'fast',
            easing: 'swing'
        });

        $('#secondPoint').addClass('active');
        $('#firstPoint').removeClass('active');
    });

    $('#createRoom').click(function (e) {
        $.post("/registerRoom/" + $('#roomName').val(),{ psw: $('#roomPassword').val()}, function (data) {
            if (data === 'true') {
                $('#createNew').hide({
                    duration: 'fast',
                    easing: 'swing'
                });
                $('#lastStep').show({
                    duration: 'fast',
                    easing: 'swing'
                });
                $('#finalMessage').html('You`re all set!');
                $('#thirdPoint').addClass('active');
                $('#secondPoint').removeClass('active');
                setTimeout(function () {
                    window.location.replace('/dashboard');
                }, 1000)
            } else {
            }
        });

    });



    $('#roomName').keyup(function (e) {
        $.ajax({
            type: "post",
            url: "/checkRoomExists/" + $('#roomName').val(),
            data: "data",
            dataType: "text",
            success: function (response) {
                if (response == 'false') {
                    $('#roomNameInfo').html('<br>');
                } else {
                    $('#roomNameInfo').html('Roomname not available.');
                }
            }
        });

    });



    $('#roomNameJoin').keyup(function (e) {
        $.ajax({
            type: "post",
            url: "/getRooms/:" + $('#roomNameJoin').val(),
            data: "data",
            dataType: "json",
            success: function (response) {
                var found = false;
                for (let i = 0; i < response.rooms.length; i++) {
                    if (response.rooms[i].name == $('#roomNameJoin').val()) {
                        found = true;
                    }
                }
                if (found) {
                    $('#joinRoomInfo').html('Room found.');
                    $('#joinRoomButton').show();
                }else{
                    $('#joinRoomInfo').html('');
                    $('#joinRoomButton').hide();
                }
            }
        });
    });

    $('#joinRoomButton').click(function () {

        $.post("/joinRoom",{ psw: $('#roomPasswordJoin').val(), roomName: $('#roomNameJoin').val() }, function (data) {
            if (data === 'true') {
                $('#joinExisting').hide({
                    duration: 'fast',
                    easing: 'swing'
                });
                $('#lastStep').show({
                    duration: 'fast',
                    easing: 'swing'
                });
                $('#finalMessage').html('You`re all set!');
                $('#thirdPoint').addClass('active');
                $('#secondPoint').removeClass('active');
                setTimeout(function () {
                    window.location.replace('/dashboard');
                }, 1000);
            } else {
                $('#roomPasswordJoinInfo').html('Incorrect password.');
            }
        });

    });
});