$(document).ready(function () {

    $.post("/getDebts", 
        function (response) {
            if (response.length === 2) { //getting exp and debts back
                for (let i = 0; i < response[0].length; i++) {
                    console.log(response[0][i].name);
                    console.log(response[0][i].amountCents);
                }
                for (let i = 0; i < response[1].length; i++) {
                    console.log(response[1][i].from);
                    console.log(response[1][i].to);
                    console.log(response[1][i].amountCents);
                }
            }
        }
    );

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

            $.post("/addDebt", {
                what: $('#what').val(), //cast before
                who: array,
                val: $('#price').val()
            },
                function (data) {
                    if (data==true) {
                        reloadDebts();
                    } else {
                        
                    }
                }
            );
            
        });
    });

});
function reloadDebts() {
    
}