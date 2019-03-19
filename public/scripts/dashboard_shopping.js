$(document).ready(function () {

    reloadList();

    $('#deleteAll').click(function (e) {
        e.preventDefault();
        $.get("/deleteAllShoppingItems", function (data, textStatus, jqXHR) {
            if (data == true) {
                $('#message').html('All items successfully deleted');
                reloadList();
            } else {
                $('#message').html('Error while deleting. Try again.');
            }

        });
    });

    $('#append').click(function (e) {
        e.preventDefault();
        $('#message').empty();
        item = $('#newItem').val();
        quantity = parseInt($('#quantity').val());

        if (item != '' && quantity != '' && /^\d*$/.test(quantity)) {
            $.post("/putShoppingList", { "it": item, "qu": quantity }, function (data) {
                if (data == true) {
                    reloadList();
                }else{
                    reloadList();
                    $('#message').html('Error while updating. Try again.');
                }
            });
        }else{
            $('#message').html('Please enter an item and a quantity (whole number) first.');
        }

    });


});
function reloadList() {
    $('#shoppingList').html('');
    $.get("/getShoppingList", function (data) {
        if (data.length > 0) {
            $.each(data[0].items, function (index, value) {
                checked = '';
                doneClass = '';
                if (value.done) {
                    checked = 'checked';
                    doneClass = 'done';
                }
                $('#shoppingList').append('<tr>' +
                    '<td class="' + doneClass + '">' + value.name + '</td>' +
                    '<td class="' + doneClass + '">' + value.quantity + '</td>' +
                    '<td>' + '<input type="checkbox" id="' + index + '" value="' + value.name + '"' + checked + '> ' + '</td>' +
                    '</tr>');
                $('#tableShopping').scrollTop($('#tableShopping')[0].scrollHeight);
                $('#' + index).change(function () {
                    if (this.checked) {
                        $(this).parent().siblings().addClass('done');
                        $.post("/putShoppingListChecked", { "index": $(this).attr('id'), "checked": true }, function (data) {
                            if (data == true) {
                                reloadList();
                            }else{
                                reloadList();
                                $('#message').html('Error while updating. Try again.');
                            }
                        });
                    }
                    else {
                        $(this).parent().siblings().removeClass('done');
                        $.post("/putShoppingListChecked", { "index": $(this).attr('id'), "checked": false }, function (data) {
                            if (data == true) {
                                reloadList();
                            }else{
                                reloadList();
                                $('#message').html('Error while updating. Try again.');
                            }
                        });
                    }
                });
            });
            
        } else {
            
        }
    });
}

