$(document).ready(function () {

    reloadDebts();
    $.post("/roommates", function (data) {
        for (let i = 0; i < data.length; i++) {
            $('#users').append('<li class="space">' + data[i].firstName + ' ' +
                '<input class="checkbox" type="checkbox" id="' + data[i].email + '">' +
                '</li>');
        }
        $('.checkbox').change(function (e) { 
            e.preventDefault();
            $('#who').val('');
            $('.checkbox').each(function( index ) {
                if (this.checked ==true) {
                    if ($('#who').val()!= '') {
                        $('#who').val($('#who').val() + ';');
                    }
                    $('#who').val($('#who').val() + this.id);
                }
            });
        });

        $('#append').click(function (e) { 
            e.preventDefault();
            array = $('#who').val().split(';');

            if ($('#what').val() != '' && array.length>0  && /^\d*\.\d{0,2}$/.test($('#price').val())) {
                $.post("/addDebt", {
                    what: $('#what').val(), //cast before
                    who: array,
                    val: $('#price').val()
                },
                    function (data) {
                        if (data==true) {
                            reloadDebts();
                        } else {
                            $('#message').html('There was an error adding the debt.');
                        }
                    }
                );
            }else{
                $('#message').html('Please enter a valid price (e.g. 3.99) and a description first and select people.');
            }



            
            
        });
    });

});

function addClicks() {
    $('.anIcon').click(function () {

        if ($(this).find('.icon').hasClass('remove')) {
            $(this).find('.icon').removeClass('remove');
            $(this).find('.icon').addClass('check');
            $(this).parent().addClass('filled');
            from = $(this).parent().attr('id');

            setTimeout(function (){
                $.post("/debtDone", {from: from},
                    function (data) {
                        if (data==true) {
                            reloadDebts();
                        }else{
                            $('#message').html('There was an error deleting the debt.');
                        }
                    }
                );
              }, 1000);
        }


    });
}

function reloadDebts() {
    $('#message').html('');
    $.post("/getDebts", 
        function (response) {
            if (response.length === 2) { //getting exp and debts back
                $('#expenditures').empty();
                $('#debts').empty();
                
                for (let i = 0; i < response[0].length; i++) {
                    amountDollar = (response[0][i].amountCents / 100);
                    $('#expenditures').append('<div class="message">'+ response[0][i].name + ': '+amountDollar +'$</div>');
                }
                for (let i = 0; i < response[1].length; i++) {
                    amountDollar = (response[1][i].amountCents / 100);
                    $('#debts').append('<div class="message" id="'+response[1][i].from+'">'+ response[1][i].fromFirst + ' owes you: '+amountDollar +'$'+
                    '<div class="anIcon"><div class="remove icon"></div></div>' + 
                    '</div>');
                }
                addClicks();
            }
        }
    );
}