$(document).ready(function () {
    $('#wipeAll').click(function (e) { 
        e.preventDefault();
        $.get("/wipeAll", function (data) {
            if(data == true){
                $('#message').html('WHIPING COMPLETE');
            }else{
                $('#message').html('ERROR WHILE WHIPING');
            }
        });
    });
});