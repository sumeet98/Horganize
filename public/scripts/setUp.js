$(document).ready(function () {
    $('#createNew').hide();
    $('#joinExisting').hide();
    $('#lastStep').hide();
    
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
        $.post("/registerRoom/:"+ $('#roomName').val(), function (data) {
                if (data==='true') {
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
            url: "/checkRoomNameAvailable/:" + $('#roomName').val(),
            data: "data",
            dataType: "text",
            success: function (response) {
                if (response==='true') {
                    $('#roomNameInfo').html('<br>');
                } else {
                    $('#roomNameInfo').html('Roomname not available.');
                }
            }
        });
        
    });
});