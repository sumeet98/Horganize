var mailValid = false;
var pswValid = false;
var proveValid = false;
var pswPattern1 = /.{8,}/; //at least 8 characters
var pswPattern2 = /.*([A-Z]+).*/; //at least 1 upper case character
var pswPattern3 = /.*([a-z]+).*/; //at least 1 lower case character
var pswPattern4 = /.*([0-9]+).*/; //at least 1 number
var emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

$(document).ready(function () {
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
        if ($('#pswRepeatRegister').val() != $('#pswRegister').val() && !testAllPasswordPatterns($('#pswRegister').val())&& $('#pswRepeatRegister').val() !='') {
            $('#pswRegister').parent().find('.invalid').remove();
            $('#pswRepeatRegister').parent().find('.invalid').remove();
            $('#pswRepeatRegister').parent().append('<span class="invalid">Please reenter password correctly.</span>');
            $('#pswRegister').parent().append('<span class="invalid">Password has to contain at least one uppercase letter, one lowercase letter and a number.</span>');
            pswValid = false;
        } else if (!testAllPasswordPatterns($('#pswRegister').val())) {
            $('#pswRepeatRegister').parent().find('.invalid').remove();
            $('#pswRegister').parent().find('.invalid').remove();
            $('#pswRegister').parent().append('<span class="invalid">Password has to be at least 8 characters long and contain one uppercase letter, one lowercase letter and a number.</span>');
            pswValid = false;
        } else if ($('#pswRepeatRegister').val() != $('#pswRegister').val() && $('#pswRepeatRegister').val() !='') {
            $('#pswRegister').parent().find('.invalid').remove();
            $('#pswRepeatRegister').parent().find('.invalid').remove();
            $('#pswRepeatRegister').parent().append('<span class="invalid">Please reenter password correctly.</span>');
            pswValid = false;
        } else if ($('#pswRepeatRegister').val() =='') {
            $('#pswRegister').parent().find('.invalid').remove();
            $('#pswRepeatRegister').parent().find('.invalid').remove();
            pswValid = false;
        } else if($('#pswRepeatRegister').val() !='' && $('#pswRepeatRegister').val() === $('#pswRegister').val() && testAllPasswordPatterns($('#pswRegister').val())){
            $('#pswRegister').parent().find('.invalid').remove();
            $('#pswRepeatRegister').parent().find('.invalid').remove();
            pswValid = true;
        }
    });

    $('#pswRepeatRegister').focusout(function () {
        if ($('#pswRepeatRegister').val() != $('#pswRegister').val()) {
            $('#pswRepeatRegister').parent().find('.invalid').remove();
            $('#pswRepeatRegister').parent().append('<span class="invalid">Please reenter password correctly.</span>');
            pswValid = false;
        } else if($('#pswRepeatRegister').val() !='' && $('#pswRepeatRegister').val() === $('#pswRegister').val() && testAllPasswordPatterns($('#pswRegister').val())){
            $('#pswRepeatRegister').parent().find('.invalid').remove();
            pswValid = true;
        }
    });

    var nbr1 = Math.floor((Math.random() * 1000) + 1);
    var nbr2 = Math.floor((Math.random() * 10) + 1);
    $('#humanProve').html('What is ' + nbr1 + ' + ' + nbr2 + '?*');
    $('#proveRegister').focusout(function () {
        if ($('#proveRegister').val() != nbr1 + nbr2) {
            $('#proveRegister').parent().find('.invalid').remove();
            $('#proveRegister').parent().append('<span class="invalid">Please reenter verification calculation.</span>');
            proveValid = false;
        } else {
            $('#proveRegister').parent().find('.invalid').remove();
            proveValid = true;
        }
    });

});

function validateForm() {
    if (validateRequired() == false || mailValid == false || pswValid == false || proveValid == false) {
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
        if ($(element).val() === '') {
            req = false;
        }
    });
    return req;
}

function testAllPasswordPatterns(val) {
    if (pswPattern1.test(val) && pswPattern2.test(val) && pswPattern3.test(val) && pswPattern4.test(val)) {
        return true;
    } else {
        return false;
    }
}
