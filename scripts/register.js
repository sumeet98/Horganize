var mailValid = false;
var pswValid = false;

$(document).ready(function () {
    var emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    $('#emailRegister').focusout(function () {
        if (emailPattern.test($('#emailRegister').val()) && $('#emailRegister').val() != "") {
            $('#emailRegister').parent().find('.invalid').remove();
            mailValid = true;
        } else {
            $('#emailRegister').parent().find('.invalid').remove();
            $('#emailRegister').parent().append('<span class="invalid">Please enter a valid Email Adress.</span>');
            mailValid = false;
        }
    });


    $('#pswRegister').focusout(function () {
        if (!$('#pswRepeatRegister').val() == '' && $('#pswRepeatRegister').val() != $('#pswRegister').val()) {
            $('#pswRepeatRegister').parent().find('.invalid').remove();
            $('#pswRepeatRegister').parent().append('<span class="invalid">Please reenter your Password correctly.</span>');
            pswValid = false;
        } else {
            $('#pswRepeatRegister').parent().find('.invalid').remove();
            pswValid = true;
        }
    });

    $('#pswRepeatRegister').focusout(function () {
        if (!$('#pswRepeatRegister').val() == '' && $('#pswRepeatRegister').val() != $('#pswRegister').val()) {
            $('#pswRepeatRegister').parent().find('.invalid').remove();
            $('#pswRepeatRegister').parent().append('<span class="invalid">Please reenter your Password correctly.</span>');
            pswValid = false;
        } else {
            $('#pswRepeatRegister').parent().find('.invalid').remove();
            pswValid = true;
        }
    });

});

function validateForm() {
    if (validateRequired() == false || mailValid == false || pswValid == false) {
        $('#registerSubmit').parent().find('.invalid').remove();
        $('#registerSubmit').parent().append('<span class="invalid">Please provide all required information (*) correctly.</span>');
        return false;
    } else {
        return true;
    }
}
function validateRequired() {
    var req = true;
    $('.required').each(function (index, element) {
        if ($(element).val()==='') {
            req = false;
        }
    });
    return req;
}
