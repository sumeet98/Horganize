exports.register = function (req, res, hashedPassword, callback) {

    new User({
        email: req.body.emailRegister,
        firstName: req.body.nameFirstRegister,
        lastName: req.body.nameLastRegister,
        adress: req.body.adressRegister,
        school: req.body.schoolRegister,
        pswHashed: hashedPassword,
        room: ''
    }).save(function (error) {
        if (error) {
            callback(req, res, error);
        } else {
            callback(req, res, error);
        }
    });
}


exports.getUser = function (req, res, callback) {
    User.find({ email: req.body.emailLogin }).then(function (user) {
        if (user.length > 0) {
            callback(req, res, user[0]);
        } else {
            callback(req, res, null);
        }
    });
}

exports.deleteShopping = function (req, res, callback) {
    User.find({ email: req.session.username }).then(function (user) {
        if (user.length > 0) {
            List.find({ room: user[0].room }).remove(function (error, numAffected) {
                console.log(error);
                List.find({room: user[0].room}).then(function (list) {console.log(list)  });
                callback(res, res, error);
            });
        }
    });
}

exports.addShopping = function (req, res, callback) {
    User.update({ email: req.session.username }, { room: 'South-5041' }, function (error, numAffected) {
        if (error) {
            console.log('not updated');
        } else {
            console.log('updated');
        }
    });
    newItem = { name: req.body.it, quantity: req.body.qu, done: false };
    User.find({ email: req.session.username }).then(function (user) {
        if (user.length > 0) {
            List.find({ room: user[0].room }).then(function (list) {
                if (list.length > 0) {
                    list[0].items.push(newItem);
                    list[0].save(function (error) {
                        callback(res, res, error);
                    });
                } else {
                    new List({
                        room: user[0].room,
                        list: [newItem]
                    }).save(function (error) {
                        List.find({ room: user[0].room }).then(function (list) {
                            if (list.length > 0) {
                                list[0].items.push(newItem);
                                list[0].save(function (error) {
                                    callback(res, res, error);
                                });
                            }                             
                        });
                    });
                }
                
            });
        }
    });
}

exports.getShoppingList = function (req, res, callback) {
    User.find({ email: req.session.username }).then(function (user) {
        if (user.length > 0) {
            List.find({ room: user[0].room }).then(function (list) {
                if (list.length > 0) {
                    console.log(list);
                    callback(req, res, list);
                } else {
                    callback(req, res, null);
                }
            });
        }
    });
}

exports.addShoppingChecked = function (req, res, callback) {
    User.find({ email: req.session.username }).then(function (user) {
        if (user.length > 0) {
            List.find({ room: user[0].room }).then(function (list) {
                if (list.length > 0) {
                    console.log(list);
                    console.log(list[0].items[req.body.index]);
                    list[0].items[req.body.index].done = req.body.checked;
                    list[0].save(function (error) {
                        callback(res, res, error);
                    });                
                } else {
                    callback(req, res, null);
                }
            });
        }
    });
}
