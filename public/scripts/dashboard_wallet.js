$(document).ready(function () {
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
                    $('#who').val($('#who').val() + this.id + ';');
                }
              });
        });
    });

    
});