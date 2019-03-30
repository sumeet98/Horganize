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

    getMessages();

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
                                    if (element.liked.length > 0) {
                                        if (!date.getMonth() < (new Date(Date.now()).getMonth() - 1)) {
                                            $('#messages').append('<div class="message filled" id="' + element.datetime + ',' + element.email + '">' +
                                                (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear() + ' (' +
                                                element.user + '): ' +
                                                element.message + '<div class="anIcon">' + '<div class="heart-solid icon"><i></i></div>' + '</div>' +
                                                '</div>' + '<br>'
                                            );
                                        }
                                    } else {
                                        if (!date.getMonth() < (new Date(Date.now()).getMonth() - 1)) {
                                            $('#messages').append('<div class="message" id="' + element.datetime + ',' + element.email + '">' +
                                                (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear() + ' (' +
                                                element.user + '): ' +
                                                element.message + '<div class="anIcon">' + '<div class="minus icon"><i></i></div>' + '</div>' +
                                                '</div>' + '<br>'
                                            );
                                        }
                                    }
                                });
                                $('#messages').scrollTop($('#messages')[0].scrollHeight);
                                addLike();
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


function getMessages() {
    $.get("/getMessages", function (messages) {
        $('#messages').empty();
        messages.forEach(element => {
            date = new Date(element.datetime);
            if (element.liked.length > 0) {
                if (!date.getMonth() < (new Date(Date.now()).getMonth() - 1)) {
                    $('#messages').append('<div class="message filled" id="' + element.datetime + ',' + element.email + '">' +
                        (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear() + ' (' +
                        element.user + '): ' +
                        element.message + '<div class="anIcon">' + '<div class="heart-solid icon"><i></i></div>' + '</div>' +
                        '</div>' + '<br>');
                }
            }
            else {
                if (!date.getMonth() < (new Date(Date.now()).getMonth() - 1)) {
                    $('#messages').append('<div class="message" id="' + element.datetime + ',' + element.email + '">' +
                        (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear() + ' (' +
                        element.user + '): ' +
                        element.message + '<div class="anIcon">' + '<div class="minus icon"><i></i></div>' + '</div>' +
                        '</div>' + '<br>');
                }
            }
        });
        $('#messages').scrollTop($('#messages')[0].scrollHeight);
        $('#messageInput').val('');
        addLike();
    });
}

function addLike() {
    $('.anIcon').click(function () {

        if ($(this).find('.icon').hasClass('minus')) {
            $(this).find('.icon').removeClass('minus');
            $(this).find('.icon').addClass('heart-solid');
            $(this).parent().addClass('filled');
            like = true;
        }else{
            $(this).find('.icon').removeClass('heart-solid');
            $(this).find('.icon').addClass('minus');
            $(this).parent().removeClass('filled');
            like = false;
        }
        $.post("/likeMessage", {
            username: $(this).parent().attr('id').split(',')[1],
            time: $(this).parent().attr('id').split(',')[0],
            like: like
        },
            function (data) {
                if (data != true) {
                    getMessages();
                } 
            }
        );
    });
}

