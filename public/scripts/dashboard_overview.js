$(document).ready(function () {

    $.post("/roommates", function (data) {
        for (let i = 0; i < data.length; i++) {
            $('#roomMates').append('<li>' + data[i].firstName + ' ' +
                data[i].lastName + ' @ ' +
                data[i].school + ' (' +
                data[i].email + ')' + '</li>');
        }

    }
    );

    $.get("/getMessages",
        function (messages) {
            $('#messages').empty();
            messages.forEach(element => {
                date = new Date(element.datetime);
                if (!date.getMonth() < (new Date(Date.now()).getMonth() - 1)) {
                    $('#messages').append(
                        (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear() + ' (' +
                        element.user + '): ' +
                        element.message + '<br>'
                    );
                }
            });
            $('#messages').scrollTop($('#messages')[0].scrollHeight);
            $('#messageInput').val('');
        }
    );

    $('#messageInput').keyup(function (e) {
        if (e.which == '13') {
            $.post("/appendMessage", {
                message: $('#messageInput').val()
            },
                function (data) {
                    if (data == true) {
                        $.get("/getMessages",
                            function (messages) {
                                $('#messages').empty();
                                messages.forEach(element => {
                                    date = new Date(element.datetime);
                                    if (!date.getMonth() < (new Date(Date.now()).getMonth() - 1)) {
                                        $('#messages').append(
                                            (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear() + ' (' +
                                            element.user + '): ' +
                                            element.message + '<br>'
                                        );
                                    }
                                });
                                $('#messages').scrollTop($('#messages')[0].scrollHeight);
                            }
                        );
                    } else {

                    }
                }
            );
            $('#messageInput').val('');
        }
    });
});

