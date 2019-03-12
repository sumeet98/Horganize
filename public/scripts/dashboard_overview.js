$(document).ready(function () {

    $.post("/roommates", function (data) {
        for (let i = 0; i < data.mates.length; i++) {
            $('#roomMates').append( '<li>'+data.mates[i].firstName +' ' + 
                                    data.mates[i].lastName + ' @ ' + 
                                    data.mates[i].school + ' (' + 
                                    data.mates[i].email + ')' + '</li>' );
        }
            
        }
    );
});