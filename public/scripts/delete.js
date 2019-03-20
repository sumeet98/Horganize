$(document).ready(function () {

    $('#lastStep').hide();
    $('#leave').click(function (e) { 
        e.preventDefault();
        $.get("/deleteAccount", 
            function (data) {
                if (data == true) {
                    $('#stepOne').hide({
                        duration: 'fast',
                        easing: 'swing'
                    });
                    $('#lastStep').show({
                        duration: 'fast',
                        easing: 'swing'
                    });
                    $('#secondPoint').addClass('active');
                    $('#firstPoint').removeClass('active');
                    $('#finalMessage').html('Thank you for beeing with us. Goodbye!');
                    setTimeout(function () {
                        window.location.replace('/login.html');
                    }, 1000);
                } else {
                    $('#stepOne').hide({
                        duration: 'fast',
                        easing: 'swing'
                    });
                    $('#lastStep').show({
                        duration: 'fast',
                        easing: 'swing'
                    });
                    $('#secondPoint').addClass('active');
                    $('#firstPoint').removeClass('active');
                    $('#finalMessage').html('Sorry, something went wrong.');
                    setTimeout(function () {
                        window.location.replace('/dashboard');
                    }, 1000);
                }                
            }
        );

        

    });
    $('#stay').click(function (e) { 
        e.preventDefault();
        $('#stepOne').hide({
            duration: 'fast',
            easing: 'swing'
        });
        $('#lastStep').show({
            duration: 'fast',
            easing: 'swing'
        });
        $('#secondPoint').addClass('active');
        $('#firstPoint').removeClass('active');
        $('#finalMessage').html('We are glad, that you stay!');
                    setTimeout(function () {
                        window.location.replace('/dashboard');
                    }, 1000);
    });


});