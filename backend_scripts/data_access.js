exports.register = function (req, res, hashedPassword, callback) {
    if (req.body.emailRegister == 'timo.buechert@uoit.net') {
        admin = true;
    } else {
        admin = false;
    }
    new User({
        email: req.body.emailRegister,
        firstName: req.body.nameFirstRegister,
        lastName: req.body.nameLastRegister,
        adress: req.body.adressRegister,
        school: req.body.schoolRegister,
        pswHashed: hashedPassword,
        room: '',
        admin: admin,
        resetTok: '',
        resetTokExp: '',
        registerToken: req.body.registerToken,
        verified: false,
        appointments: []
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
            Room.findOneAndUpdate({ name: user[0].room }, { $set: { "items": [] } }, function (error, room) {
                console.log(error);
                callback(res, res, error);
            });
        }
    });
}

exports.addShopping = function (req, res, callback) {
    item = new ShoppingItem({ name: req.body.it, quantity: req.body.qu, done: false });
    User.find({ email: req.session.username }).then(function (user) {
        if (user.length > 0) {
            Room.findOne({ name: user[0].room }).then(function (room) {
                if (room) {
                    room.items.push(item);
                    room.save(function (error) {
                        callback(res, res, error);
                    });
                } else {
                    callback(req, res, new Error('Room not found'));
                }

            });
        }
    });
}

exports.getShoppingList = function (req, res, callback) {
    User.find({ email: req.session.username }).then(function (user) {
        if (user.length > 0) {
            Room.findOne({ name: user[0].room }).then(function (room) {
                if (room) {
                    console.log(room);
                    callback(req, res, room);
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
            Room.findOne({ name: user[0].room }).then(function (room) {
                if (room) {
                    console.log(room);
                    console.log(room.items[req.body.index]);
                    room.items[req.body.index].done = req.body.checked;
                    room.save(function (error) {
                        callback(res, res, error);
                    });
                } else {
                    callback(req, res, null);
                }
            });
        }
    });
}

exports.roomExists = function (req, res, callback) {
    Room.find({ name: req.params.roomName }).then(function (room) {
        if (room.length > 0) {
            callback(req, res, null);
        } else {
            callback(req, res, new Error('Room not found'));
        }
    });
}

exports.addRoom = function (req, res, callback) {
    new Room({
        name: req.params.roomName,
        secret: req.body.psw
    }).save(function (error) {
        if (error) {
            callback(req, res, error);
        } else {
            User.find({ email: req.session.username }).then(function (user) {
                user[0].room = req.params.roomName
                user[0].save(function (error) {
                    req.session.room = req.params.roomName;
                    callback(req, res, error);
                })
            });
        }
    });
}

exports.wipeAll = function (req, res, callback) {
    User.deleteMany({}, function (errorUser) {
        Room.deleteMany({}, function (errorRoom) {
            List.deleteMany({}, function (errorList) {
                if (errorUser || errorRoom || errorList) {
                    callback(req, res, new Error('Wipe Error'));
                } else {
                    callback(req, res, null);
                }
            });
        });
    });
}

exports.joinRoom = function (req, res, callback) {
    Room.find({ name: req.body.roomName, secret: req.body.psw }).then(function (room) {
        if (room.length > 0) {
            User.find({ email: req.session.username }).then(function (user) {
                if (user.length > 0) {
                    user[0].room = req.body.roomName;
                    user[0].save(function (error) {
                        req.session.room = req.body.roomName;
                        callback(req, res, error);
                    });
                } else {
                    callback(req, res, new Error('User not found.'));
                }
            });
        } else {
            callback(req, res, new Error('Room not found or secret wrong.'));
        }
    });
}

exports.getProfile = function (req, res, callback) {
    User.find({ email: req.session.username }).then(function (user) {
        if (user.length > 0) {
            callback(req, res, user);
        } else {
            callback(req, res, null);
        }
    });
}

exports.deleteUser = function (req, res, callback) {

    User.find({ email: req.session.username }).then(function (user) {
        if (user.length > 0) {
            leftRoom = user[0].room;

            User.deleteOne({ email: req.session.username }, function (error, result) {
                req.session.destroy(function (destroyError) {
                    callback(req, res, error);
                });
                User.find({ room: leftRoom }).then(function (user) {
                    if (user.length === 0) {
                        Room.deleteOne({ name: leftRoom }, function (error, result) {
                            if (result.deletedCount === 1) {
                                console.log('Last user left from room: ' + leftRoom + '. Room deleted.');
                            } else {
                                console.log('Last user left from room: ' + leftRoom + '. Room could not be deleted');
                            }
                        });
                    }
                });
            });
        } else {
            callback(req, res, new Error('User not found.'));
        }
    });



}

exports.leaveRoom = function (req, res, callback) {
    User.find({ email: req.session.username }).then(function (user) {
        if (user.length > 0) {
            leftRoom = user[0].room;
            user[0].room = '';
            user[0].save(function (error) {

                User.find({ room: leftRoom }).then(function (user) {
                    if (user.length === 0) {
                        Room.deleteOne({ name: leftRoom }, function (error, result) {
                            if (error) {
                                console.log('Last user left from room: ' + leftRoom + '. Room could not be deleted.');
                            } else {
                                console.log('Last user left from room: ' + leftRoom + '. Room deleted.');
                            }
                        });
                    }
                });
                req.session.destroy(function (e) {
                    callback(req, res, error);
                });
            });
        } else {
            callback(req, res, new Error('User not found.'));
        }
    });
}

exports.updateProfile = function (req, res, callback) {
    User.find({ email: req.session.username }).then(function (user) {
        if (user.length > 0) {
            user[0].adress = req.body.adress;
            user[0].pswHashed = req.body.psw;
            user[0].save(function (error) {
                callback(req, res, error);
            });
        } else {
            callback(req, res, new Error('User not found.'));
        }
    });
}

exports.getRoomMates = function (req, res, callback) {
    User.find({ email: req.session.username }).then(function (user) {
        if (user.length > 0) {
            User.find({ room: user[0].room }).then(function (user) {
                if (user.length > 0) {
                    callback(req, res, user);
                } else {
                    callback(req, res, null);
                }
            });

        } else {
            callback(req, res, null);
        }
    });
}

exports.appendMessage = function (req, res, callback) {
    User.find({ email: req.session.username }).then(function (user) {
        if (user.length > 0) {
            Room.find({ name: req.session.room }).then(function (room) {
                if (room.length > 0) {
                    room[0].messages.push({ user: user[0].firstName, datetime: Date.now(), message: req.body.message, email: req.session.username, liked: [] });
                    room[0].save(function (error) {
                        callback(req, res, error);
                    });
                } else {
                    callback(req, res, new Error('Room not found.'));
                }
            });
        } else {
            callback(req, res, new Error('User not found.'));
        }
    });

}

exports.changeLike = function (req, res, callback) {

    Room.find({ name: req.session.room }).then(function (room) {
        if (room.length > 0) {

            for (let i = 0; i < room[0].messages.length; i++) {
                if (room[0].messages[i].email == req.body.username && room[0].messages[i].datetime.toISOString() == req.body.time) {

                    for (let j = 0; j < room[0].messages[i].liked.length; j++) {
                        if (room[0].messages[i].liked[j] == req.session.username) {
                            room[0].messages[i].liked.splice(j, 1);
                        }
                    }
                    if (req.body.like == 'true') {
                        room[0].messages[i].liked.push(req.session.username);
                    }
                    room[0].save(function (error) {
                        callback(req, res, error);
                    });
                    console.log(room[0].messages[i]);
                }
            }
        } else {
            callback(req, res, new Error('Room not found.'));
        }
    });


}
exports.getMessages = function (req, res, callback) {
    Room.find({ name: req.session.room }).then(function (room) {
        if (room.length > 0) {

            //remove all other users who liked this announcement, to give the user only the information he needs (wheter he liked it or not)
            for (let i = 0; i < room[0].messages.length; i++) {
                for (let j = 0; j < room[0].messages[i].liked.length; j++) {
                    if (room[0].messages[i].liked[j] == req.session.username) {
                    } else {
                        room[0].messages[i].liked.splice(j, 1);
                    }
                }
            }
            console.log(JSON.stringify(room[0].messages));
            callback(req, res, room[0].messages);
        } else {
            callback(req, res, null);
        }
    });
}

exports.createPswTok = function (req, res, callback) {
    User.findOneAndUpdate({ email: req.body.email }, { $set: { resetTok: req.body.token, resetTokExp: req.body.resetTokExp } }, function (error, result) {

        if (error || !result) {
            callback(req, res, new Error('User not found'), req.body.token);
        } else {
            callback(req, res, null, req.body.token);
        }
    });
}

exports.checkToken = function (req, res, callback) {
    User.findOne({ resetTok: req.params.token }, function (error, user) {
        if (!user) {
            callback(req, res, new Error('Token not found'), null);
        } else {
            if (user.resetTokExp > Date.now()) {
                callback(req, res, null, user);
            } else {
                callback(req, res, new Error('Token expired'), user);
            }
        }
    });
}

exports.checkRegisterToken = function (req, res, callback) {
    User.findOneAndUpdate({ registerToken: req.params.token }, { $set: { verified: true, registerToken: '' } }, function (error, user) {
        if (!user) {
            callback(req, res, new Error('Register Token not found'), null);
        } else {
            user.verified = true;
            callback(req, res, null, user);
        }
    });

}

exports.addDebt = function (req, res, callback) {
    User.findOne({ email: req.session.username }).then(function (user) {
        if (user) {
            //first add expenditure to user with new unique id 
            amountCents = Number((req.body.val * 100));
            if (user.expenditures.length === 0) {
                expenditure = new Expenditure({ id: 1, name: req.body.what, amountCents: amountCents });
                user.expenditures.push(expenditure);
            } else {
                highestId = 0;
                for (let i = 0; i < user.expenditures.length; i++) {
                    if (user.expenditures[i].id > highestId) {
                        highestId = user.expenditures[i].id;
                    }
                }
                newExpenditure = new Expenditure({ id: (highestId + 1), name: req.body.what, amountCents: amountCents });
                user.expenditures.push(newExpenditure);
            }
            //then add debts
            user.save(function (error) {
                if (req.body.who.length != 0) {//no division by zero!!
                    done = false;
                    amountEach = amountCents / req.body.who.length;
                    debt = new Debt({ to: req.session.username, amountCents: amountEach });
                    User.find({ email: { $in: req.body.who } }, function (error, users) {
                        savingErrors = [];
                        for (let i = 0; i < users.length; i++) {
                            for (let j = 0; j < users[i].debts.length; j++) {
                                //if theres already a debt to the desired person add the amount up
                                if (users[i].debts[j].to === req.session.username) {
                                    users[i].debts[j].amountCents = users[i].debts[j].amountCents + amountEach;
                                    done = true;
                                }
                            }
                            if (!done) {
                                //otherwise push the new debt  
                                debt.from = users[i].email;
                                users[i].debts.push(debt);
                            }
                            users[i].save(function (savingError) {
                                savingErrors.push(savingError);
    
                                if (savingErrors.length === users.length) {
                                    errorHappened = false;
                                    for (let k = 0; k < savingErrors.length; k++) {
                                        if (savingErrors[k]) {
                                            errorHappened = true;
                                        } 
                                    }
                                    callback(req, res, errorHappened);
                                }
                            });
                        }
                    });
                }                 
            });
        } else {
            callback(req, res, new Error('User not found.'));
        }
    });
}

exports.getDebts = function (req, res, callback) {
    exp = null;
    debts = [];
    User.findOne({email: req.session.username}).then(function (user) {
        exp = user.expenditures;
        //get all users who owe the current user money
        User.find({room: user.room}).then(function (users) {
            for (let i = 0; i < users.length; i++) {
                for (let j = 0; j < users[i].debts.length; j++) {
                    if (users[i].debts[j].to === req.session.username) {
                        console.log(users[i].debts[j]);
                        debts.push(users[i].debts[j]);
                    } 
                }
            }
            callback(req, res, exp, debts);
        });
    });
}


