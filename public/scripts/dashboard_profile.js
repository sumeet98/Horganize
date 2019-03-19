$(document).ready(function () {
    $.get("/getProfile", 
        function (profile) {
            console.log(profile);
            if (profile) {
                $('#actual').html(  '<label>Admin</label>' + 
                                    '<input value="'+ profile.admin +'" readonly  disabled>' + 
                                    '<label>Email</label>' + 
                                    '<input value="'+ profile.email +'" readonly  disabled>' + 
                                    '<label>First Name</label>' + 
                                    '<input value="'+ profile.firstName +'" readonly  disabled>' + 
                                    '<label>Last Name</label>' + 
                                    '<input value="'+ profile.lastName +'" readonly  disabled>' + 
                                    '<label>Room</label>' + 
                                    '<input value="'+ profile.room +'" readonly  disabled>' + 
                                    '<label>School</label>' + 
                                    '<input value="'+ profile.school +'" readonly  disabled>'
                );
            }else{
                $('#message').html('Error getting Profile. Please try logging in again.');
            }
        }
    );
});