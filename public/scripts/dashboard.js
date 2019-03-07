$(function () {
    $.get("/calendar", function (data) {
        $('body').append(data);
    }
    );
});