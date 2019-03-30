$(document).ready(function () {
    $('#wipeAll').click(function (e) { 
        e.preventDefault();
        $.get("/wipeAll", function (data) {
            if(data == true){
                $('#message').html('WHIPING COMPLETE');
                setTimeout(function () {
                    window.location.replace('/login');
                }, 1000);
            }else{
                $('#message').html('ERROR WHILE WHIPING');
            }
        });
    });
});