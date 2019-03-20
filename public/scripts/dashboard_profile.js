$(document).ready(function () {
    $.get("/getProfile", 
        function (profile) {
            console.log(profile);
            if (profile) {
                $('#actual').html(  '<label class="entry">Admin</label>' + 
                                    '<input class="entry" value="'+ profile.admin +'" readonly  disabled>' + 
                                    '<label class="entry">Email</label>' + 
                                    '<input class="entry" value="'+ profile.email +'" readonly  disabled>' + 
                                    '<label class="entry">First Name</label>' + 
                                    '<input class="entry" value="'+ profile.firstName +'" readonly  disabled>' + 
                                    '<label class="entry">Last Name</label>' + 
                                    '<input class="entry" value="'+ profile.lastName +'" readonly  disabled>' + 
                                    '<label class="entry">Room</label>' + 
                                    '<input class="entry" value="'+ profile.room +'" readonly  disabled>' + 
                                    '<label class="entry">School</label>' + 
                                    '<input class="entry" value="'+ profile.school +'" readonly  disabled>'
                );
            }else{
                $('#message').html('Error getting Profile. Please try logging in again.');
            }
        }
    );

    $('#pswNew').focusout(function () {
        if (!$('#pswNewRepeat').val() == '' && $('#pswNewRepeat').val() != $('#pswNew').val()) {
            $('#pswRepMessage').html('Passwords different.');
            pswValid = false;
        } else {
            $('#pswRepMessage').empty();
            pswValid = true;
        }
    });

    $('#pswNewRepeat').focusout(function () {
        if (!$('#pswNew').val() == '' && $('#pswNew').val() != $('#pswNewRepeat').val()) {
            $('#pswRepMessage').html('Passwords different.');
            pswValid = false;
        } else {
            $('#pswRepMessage').empty();
            pswValid = true;
        }
    });

    


});