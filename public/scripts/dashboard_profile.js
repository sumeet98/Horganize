var pswPattern1 = /.{8,}/; //at least 8 characters
var pswPattern2 = /.*([A-Z]+).*/; //at least 1 upper case character
var pswPattern3 = /.*([a-z]+).*/; //at least 1 lower case character
var pswPattern4 = /.*([0-9]+).*/; //at least 1 number
$(document).ready(function () {
    $.get("/getProfile",
        function (profile) {
            if (profile) {
                $('#actual').html('<label class="entry">Admin</label>' +
                    '<input class="entry" value="' + profile.admin + '" readonly  disabled>' +
                    '<label class="entry">Email</label>' +
                    '<input class="entry" value="' + profile.email + '" readonly  disabled>' +
                    '<label class="entry">First Name</label>' +
                    '<input class="entry" value="' + profile.firstName + '" readonly  disabled>' +
                    '<label class="entry">Last Name</label>' +
                    '<input class="entry" value="' + profile.lastName + '" readonly  disabled>' +
                    '<label class="entry">Address</label>' +
                    '<input class="entry" value="' + profile.adress + '" readonly  disabled>' +
                    '<label class="entry">Room</label>' +
                    '<input class="entry" value="' + profile.room + '" readonly  disabled>' +
                    '<label class="entry">School</label>' +
                    '<input class="entry" value="' + profile.school + '" readonly  disabled>'
                );
            } else {
                $('#message').html('Error getting Profile. Please try logging in again.');
            }
        }
    );

    $('#pswNew').focusout(function () {
        if ($('#pswNewRepeat').val() != $('#pswNew').val() && testAllPasswordPatterns($('#pswNew').val())) { //Different but meet req
            $('#pswRepMessage').html('Invalid.');
            pswValid = false;
        } else if(!testAllPasswordPatterns($('#pswNew').val()) && $('#pswNewRepeat').val() === $('#pswNew').val()){ //Not diff but no req
            $('#pswRepMessage').html('Invalid.');
            pswValid = false;
        } else if(!testAllPasswordPatterns($('#pswNew').val()) && $('#pswNewRepeat').val() != $('#pswNew').val()){ // Diff AND REQ Fail
            $('#pswRepMessage').html('Invalid.');
            pswValid = false;
        }else {
            $('#pswRepMessage').empty();
            pswValid = true;
        }
    });

    $('#pswNewRepeat').focusout(function () {
        if (!$('#pswNew').val() == '' && $('#pswNew').val() != $('#pswNewRepeat').val()) {
            $('#pswRepMessage').html('Invalid.');
            pswValid = false;
        } else if($('#pswNew').val() === $('#pswNewRepeat').val() && testAllPasswordPatterns($('#pswNewRepeat').val())){
            $('#pswRepMessage').empty();
            pswValid = true;
        }
    });

    $('#leaveRoom').click(function (e) {
        e.preventDefault();
        $.get("/leaveRoom",
            function (data) {
                if (data == true) {
                    $('#message').html('Room left. You will now be logged out.');
                    setTimeout(function () {
                        window.location.replace('/login.html');
                    }, 1000);
                } else {
                    $('#message').html('An error occured while leaving room. Please try again.');
                }
            }
        );
    });

    $('#submit').click(function (e) {
        e.preventDefault();
        if (pswValid && $('#pswNew').val() === $('#pswNewRepeat').val() && $('#pswNewRepeat').val() != '' && $('#pswNew').val() != '' && testAllPasswordPatterns($('#pswNewRepeat').val())) {
            $.post("/updateProfile", {
                psw: $('#pswNewRepeat').val(),
                adress: $('#adressNew').val()
            },
                function (data) {
                    if (data == true) {
                        $('#message').html('Successfully updated your profile.');
                        $.get("/getProfile",
                            function (profile) {
                                if (profile) {
                                    $('#actual').html('<label class="entry">Admin</label>' +
                                        '<input class="entry" value="' + profile.admin + '" readonly  disabled>' +
                                        '<label class="entry">Email</label>' +
                                        '<input class="entry" value="' + profile.email + '" readonly  disabled>' +
                                        '<label class="entry">First Name</label>' +
                                        '<input class="entry" value="' + profile.firstName + '" readonly  disabled>' +
                                        '<label class="entry">Last Name</label>' +
                                        '<input class="entry" value="' + profile.lastName + '" readonly  disabled>' +
                                        '<label class="entry">Address</label>' +
                                        '<input class="entry" value="' + profile.adress + '" readonly  disabled>' +
                                        '<label class="entry">Room</label>' +
                                        '<input class="entry" value="' + profile.room + '" readonly  disabled>' +
                                        '<label class="entry">School</label>' +
                                        '<input class="entry" value="' + profile.school + '" readonly  disabled>'
                                    );
                                } else {
                                    $('#message').html('Error getting Profile. Please try logging in again.');
                                }
                            }
                        );
                    } else {
                        $('#message').html('There was an error updating your profile.');
                    }
                }
            );
        } else {
            $('#message').html('Cannot submit invalid data. Password is either not identical or invalid (see requirements below).');
        }
    });




});

function testAllPasswordPatterns(val) {
    if (pswPattern1.test(val) && pswPattern2.test(val) && pswPattern3.test(val) && pswPattern4.test(val)) {
        return true;
    } else {
        return false;
    }
}