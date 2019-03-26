var express = require('express');
var bodyParser = require('body-parser');
var uuid = require('uuid/v4');
var session = require('express-session');
var path = require('path');
var mongoose = require('mongoose');
var data_access = require('./backend_scripts/data_access')
var bcrypt = require('bcrypt');
var nodemailer = require('nodemailer');
var nanoid = require("nanoid");
var app = express();
app.set('port', process.env.PORT || 3000);
mongoose.connect('mongodb://localhost:27017/horganize', { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);
initDB();
var transporter = null;
initMailer();

app.use(session({
    secret: 'Z5vyQoTAeS',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
    genid: function (request) {
        return uuid();
    }
}));

app.use(bodyParser.urlencoded({ extended: false }));

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/login.html'));
})

app.post('/login', function (request, response) {
    data_access.getUser(request, response, performLogin);
});

app.get('/dashboard', function (req, res) {
    if (checkRequest(req)) {
        res.render('dashboard_overview', {
            active: 0,
            username: req.session.username,
            room: req.session.room
        });
    } else {
        res.redirect('/login.html');
    }
});

app.get('/setup', function (req, res) {
    if (req.session.username && req.session.verified) {
        res.sendFile(path.join(__dirname + '/private/setUp.html'));
    } else {
        res.redirect('/login.html');
    }
});


app.post('/register', function (req, res) {
    hashedPassword = bcrypt.hashSync(req.body.pswRegister, 8);
    req.body.registerToken = nanoid();
    data_access.register(req, res, hashedPassword, registerDone);
});

app.get('/getProfile', function (req, res) {
    if (checkRequest(req)) {
        data_access.getProfile(req, res, getProfileDone);
    } else {
        res.status(403);
        res.redirect('/login.html');
    }
});

function getProfileDone(req, res, user) {
    if (user.length > 0) {
        cleanedUser = {
            admin: user[0].admin,
            adress: user[0].adress,
            email: user[0].email,
            firstName: user[0].firstName,
            lastName: user[0].lastName,
            room: user[0].room,
            school: user[0].school
        }
        res.send(cleanedUser);
    } else {
        req.session.destroy(function (error) {
            res.status(403);
            res.redirect('/login.html');
        });
    }
}

app.post('/checkRoomExists/:roomName', function (req, res) {
    if (req.session.username && req.session.verified) {
        data_access.roomExists(req, res, callbackBoolean)
    } else {
        res.status(403);
        res.redirect('/login.html');
    }
});

app.post('/registerRoom/:roomName', function (req, res) {
    console.log('register Room');
    if (req.session.username && req.session.verified) {
        data_access.addRoom(req, res, registerRoomDone)

    } else {
        res.status(403);
        res.redirect('/login.html');
    }
});

function registerRoomDone(req, res, error) {
    if (error) {
        //error name: 'MongoError' code: 11000 --> Duplicate Keys
        //error name: 'ValidatorError' message: PERSONAL ERROR MESSAGE TO DISPLAY

        if (error.name == 'MongoError' && error.code == 11000) {

        } else {

        }
        res.status(500);
        res.send('false');

    } else {
        res.status(200);
        res.send('true');
    }
}

app.post('/getRooms/:search', function (req, res) {
    if (req.session.username && req.session.verified) {
        res.json(getRoomsFromDB(req.params.search))
    } else {
        res.sendStatus(403);
    }
});

app.post('/joinRoom', function (req, res) {
    if (req.session.username && req.session.verified) {
        data_access.joinRoom(req, res, joinRoomDone);
    } else {
        res.sendStatus(403);
    }
});

function joinRoomDone(req, res, error) {
    if (error) {
        res.send('false');
    } else {
        res.send('true');
    }
}

app.get('/logout', function (req, res) {
    if (checkRequest(req)) {
        log(req.session.username + ' going to be logged out.');
        req.session.destroy(function (error) {
            if (error) {
                log('Logout finished out with errors.');
                res.redirect('/dashboard');
            } else {
                log('Successfully logged out.');
                res.redirect('/login.html');
            }
        });

    } else {
        res.status(403);
        res.redirect('/login.html');
    }
});

app.get('/shopping', function (req, res) {
    if (checkRequest(req)) {
        res.render('dashboard_shopping', {
            active: 1,
            roomName: req.session.room,
            username: req.session.username
        });
    } else {
        res.status(403);
        res.redirect('/login.html');
    }
});

app.get('/tasks', function (req, res) {
    if (checkRequest(req)) {
        res.render('dashboard_tasks', {
            active: 2,
            username: req.session.username
        });
    } else {
        res.status(403);
        res.redirect('/login.html');
    }
});

app.get('/calendar', function (req, res) {
    if (checkRequest(req)) {
        res.sendFile(path.join(__dirname + '/private/calendar.html')); //for development purposes
    } else {
        res.status(403);
        res.redirect('/login.html');
    }
});

app.get('/wallet', function (req, res) {
    if (checkRequest(req)) {
        res.render('dashboard_wallet', {
            active: 4,
            username: req.session.username
        });
    } else {
        res.status(403);
        res.redirect('/login.html');
    }
});

app.get('/profile', function (req, res) {
    if (checkRequest(req)) {
        res.render('dashboard_profile', {
            active: 5,
            username: req.session.username
        });
    } else {
        res.status(403);
        res.redirect('/login.html');
    }
});

app.post('/roommates', function (req, res) {
    if (checkRequest(req)) {
        data_access.getRoomMates(req, res, getRoomMatesDone);
    } else {
        res.status(403);
        res.redirect('/login.html');
    }
});

function getRoomMatesDone(req, res, users) {
    mates = [];
    for (let i = 0; i < users.length; i++) {
        mates[i] = {

            "firstName": users[i].firstName,
            "lastName": users[i].lastName,
            "email": users[i].email,
            "school": users[i].school
        };
    }
    res.send(mates);
}
app.get('/getShoppingList', function (req, res) {
    if (checkRequest(req)) {
        data_access.getShoppingList(req, res, getShoppingListDone);
    } else {
        res.status(403);
        res.redirect('/login.html');
    }
});

app.get('/admin', function (req, res) {
    if (checkRequest(req) && req.session.admin) {
        res.render('dashboard_admin', {
            username: req.session.username
        });
    } else if (req.session.username) {
        res.status(404);
        res.redirect('/dashboard');

    } else {
        res.status(404);
        res.redirect('/login.html');
    }
});


function getShoppingListDone(req, res, list) {
    res.send(list);
}

app.get('/deleteAllShoppingItems', function (req, res) {
    if (checkRequest(req)) {
        data_access.deleteShopping(req, res, callbackBoolean);
    } else {
        res.status(403);
        res.redirect('/login.html');
    }
});

app.post('/putShoppingList', function (req, res) {
    if (checkRequest(req)) {
        data_access.addShopping(req, res, callbackBoolean);
    } else {
        res.status(403);
        res.redirect('/login.html');
    }
});

app.post('/putShoppingListChecked', function (req, res) {
    if (checkRequest(req)) {
        data_access.addShoppingChecked(req, res, callbackBoolean);
    } else {
        res.status(403);
        res.redirect('/login.html');
    }
});


function callbackBoolean(req, res, error) {
    if (error) {
        res.status(500);
        res.send(false);
    } else {
        res.status(200);
        res.send(true);
    }
}

app.get('/wipeAll', function (req, res) {
    if (checkRequest(req) && req.session.admin) {
        data_access.wipeAll(req, res, callbackBoolean);
    } else if (req.session.username) {
        res.status(404);
        res.redirect('/dashboard');

    } else {
        res.status(404);
        res.redirect('/login.html');
    }
});

app.get('/deleteAccount', function (req, res) {
    if (checkRequest(req)) {
        data_access.deleteUser(req, res, callbackBoolean);
    } else {
        res.status(404);
        res.redirect('/login');

    }
});

app.get('/deleteAccountEntry', function (req, res) {
    if (checkRequest(req)) {
        res.sendFile(path.join(__dirname + '/private/delete.html'));
    } else {
        res.status(404);
        res.redirect('/login');

    }
});

app.get('/leaveRoom', function (req, res) {
    if (checkRequest(req)) {
        data_access.leaveRoom(req, res, callbackBoolean);
    } else {
        res.status(404);
        res.redirect('/login');
    }
});

app.post('/updateProfile', function (req, res) {
    if (checkRequest(req)) {
        psw = req.body.psw;
        req.body.psw = bcrypt.hashSync(psw, 8);
        data_access.updateProfile(req, res, callbackBoolean);
    } else {
        res.status(404);
        res.redirect('/login');
    }
});

app.post('/appendMessage', function (req, res) {
    if (checkRequest(req)) {
        data_access.appendMessage(req, res, callbackBoolean);
    } else {
        res.status(404);
        res.redirect('/login');
    }
});

app.get('/getMessages', function (req, res) {
    if (checkRequest(req)) {
        data_access.getMessages(req, res, getMessagesDone);
    } else {
        res.status(404);
        res.redirect('/login');
    }
});


function getMessagesDone(req, res, messages) {
    res.send(messages);
}

app.post('/likeMessage', function (req, res) {
    if (checkRequest(req)) {
        data_access.changeLike(req, res, callbackBoolean);
    } else {
        res.status(403);
        res.redirect('/login');
    }
});

app.get('/passwordForgot', function (req, res) {
    res.render('landing_password');
});

app.post('/resetPassword', function (req, res) {
    if (req.body.email) {
        req.body.token = nanoid();
        req.body.resetTokExp = Date.now() + 3600000;
        data_access.createPswTok(req, res, resetPasswordSent);
    } else {
        res.render('landing_message', {
            message: 'There was no email entered.'
        });
    }
});

function resetPasswordSent(req, res, error, token) {
    if (error) {
        res.render('landing_message', {
            message: 'Error while sending password reset email.'
        });
    } else {
        transporter.sendMail({
            to: req.body.email,
            subject: 'Horganize Password Reset',
            text: 'Hi there!\n\n' +
                'please click on the following link to reset your password: \n' +
                'http://localhost:3000/resetPassword/' + token + ' \n' +
                'This link will automatically log you in and redirect you to the profile page, where you can set your new password. ' +
                'If your profile is not assigned to a room, you have to complete the setup first. \n\n' +
                'Thanks for using HORGANIZE!'
        }, function (error, info) {
            if (error) {
                res.render('landing_message', {
                    message: 'Could not send password reset email.'
                });
            } else {
                res.render('landing_message', {
                    message: 'Password reset email sent! Have a look at your inbox.'
                });
            }
        });

    }
}

//for developer use only

app.post('/getExampleUser', function (req, res) {

    appointment1 = new Appointment({
        start: new Date(2019, 03, 23, 10, 0, 0, 0),
        end: new Date(2019, 03, 23, 11, 30, 0, 0),
        title: 'Hair Appointment @Hairworx',
        allDay: false
    });

    appointment2 = new Appointment({
        start: new Date(2019, 03, 27, 16, 0, 0, 0),
        end: new Date(2019, 03, 27, 16, 30, 0, 0),
        title: 'Pay Fees',
        allDay: false
    });

    res.send(new User({
        email: 'admin@horanize.com',
        firstName: 'Admin',
        lastName: 'Admin',
        adress: '1 Admin Drive',
        school: 'UOIT',
        pswHashed: '',
        room: '',
        admin: true,
        resetTok: '',
        resetTokExp: '',
        appointments: [
            appointment1, appointment2
        ]

    }));
});

//end of developer section

app.get('/resetPassword/:token', function (req, res) {
    if (req.params.token) {
        data_access.checkToken(req, res, resetPasswordComplete);
    } else {
        res.status(403);
        res.redirect('/login.html');
    }
});

function resetPasswordComplete(req, res, error, user) {
    if (error) {
        res.render('landing_message', {
            message: 'This link is not valid.'
        });
    } else {
        if (user.room == '') {
            req.session.username = user.email;
            req.session.admin = user.admin;
            log(req.session.username + ' successfully logged in.');
            res.redirect('/setup');
        } else {
            req.session.username = user.email;
            req.session.room = user.room;
            req.session.admin = user.admin;
            log(req.session.username + ' successfully logged in.');
            res.redirect('/profile');
        }
    }
}

app.get('/activateAccount/:token', function (req, res) {
    if (req.params.token) {
        data_access.checkRegisterToken(req, res, activateAccountComplete);
    } else {
        res.status(403);
        res.redirect('/login.html');
    }
});

function activateAccountComplete(req, res, error, user) {
    if (error) {
        res.render('landing_message', {
            message: 'This link is not valid.'
        });
    } else {
        if (user.room == '') {
            req.session.username = user.email;
            req.session.admin = user.admin;
            req.session.verified = user.verified;
            log(req.session.username + ' successfully logged in.');
            res.redirect('/setup');
        } else {
            req.session.username = user.email;
            req.session.room = user.room;
            req.session.admin = user.admin;
            req.session.verified = user.verified;
            log(req.session.username + ' successfully logged in.');
            res.redirect('/profile');
        }
    }
}

app.listen(app.get('port'), function () {
    log('Server started up and is now listening on port:' + app.get('port'));
});

app.use(function (req, res, next) {
    res.status(404);
    res.render('landing_message', {
        message: 'Sorry, this page does not exist.'
    });
});

app.use(function (err, req, res, next) {
    res.status(500);
    res.render('landing_message', {
        message: 'Sorry, an internal error occured.'
    });
});

function registerRoom(roomName, userName) {
    //implement db check here
    if (roomName === ':default') {
        console.log('Room registered: ' + roomName + ' with User ' + userName);
        return true;
    } else {
        console.log('something')
        return false;
    }
}

function getRoomsFromDB(search) {
    //implement db lookup with search here
    return {
        "rooms": [{
            "name": "test",
            "adress": "simcoe"
        }, {
            "name": "test2",
            "adress": "south"
        }]
    };
}




function registerDone(req, res, error) {

    if (error) {
        //error name: 'MongoError' code: 11000 --> Duplicate Keys
        //error name: 'ValidatorError' message: PERSONAL ERROR MESSAGE TO DISPLAY

        if (error.name == 'MongoError' && error.code == 11000) {
            res.render('landing_message', {
                message: 'The provided email adress is already registered.'
            });
        } else if (error.name == 'ValidatorError') {
            res.status(400);
            res.render('landing_message', {
                message: result.message
            });
        } else {
            res.status(400);
            res.render('landing_message', {
                message: 'An error occured during registration.'
            });
        }

    } else {
        transporter.sendMail({
            to: req.body.emailRegister,
            subject: 'Horganize Email Verification',
            text: 'Hi there!\n\n' +
                'please click on the following link to verify your email adress: \n' +
                'http://localhost:3000/activateAccount/' + req.body.registerToken + ' \n' +
                'This link will automatically log you in and you can continue setting up your profile.\n \n ' +
                'Thanks for using HORGANIZE!'
        }, function (error, info) {
            if (error) {
                res.render('landing_message', {
                    message: 'An error occured during registration.'
                });
            } else {
                res.status(200);
                res.render('landing_message', {
                    message: 'Registration successful. Please look at your inbox and verify your email adress.'
                });
            }
        });

    }
}

function performLogin(req, res, user) {
    if (user) {
        if (bcrypt.compareSync(req.body.pswLogin, user.pswHashed)) {
            console.log(user);
            if (user.room == '' && user.verified) {
                req.session.username = req.body.emailLogin;
                req.session.admin = user.admin;
                req.session.verified = user.verified;
                log(req.session.username + ' successfully logged in.');
                res.redirect('/setup');
            } else if (user.verified) {
                req.session.username = req.body.emailLogin;
                req.session.room = user.room;
                req.session.admin = user.admin;
                req.session.verified = user.verified;
                log(req.session.username + ' successfully logged in.');
                res.redirect('/dashboard');
            } else {
                res.status(403);
                res.render('landing_message', {
                    message: 'Please verify your email. '
                })
            }
        } else {
            log(req.session.username + ' attempted login.');
            res.status(403);
            res.render('landing_message', {
                message: 'Username or password incorrect. Please try again. '
            })
        }
    } else {
        log(req.session.username + ' attempted login.');
        res.render('landing_message', {
            message: 'Username or password incorrect. Please try again. '
        })
    }
}


function log(message) {
    console.log(new Date().getTime() + ': ' + message);
}

function initDB() {

    //init Schmemas

    appointmentSchema = new mongoose.Schema({
        start: Date,
        end: Date,
        title: String,
        allDay: Boolean
    });

    Appointment = mongoose.model('appointment', appointmentSchema);

    userSchema = new mongoose.Schema({
        email: {
            type: String,
            validate: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please enter a valid email adress.'],
            index: true,
            unique: true,
            require: true
        },
        firstName: { type: String, require: true },
        lastName: { type: String, require: true },
        adress: String,
        school: { type: String, enum: { values: ['UOIT', 'Durham College', 'Trent University'], message: 'Please enter a valid registered school.' } },
        pswHashed: { type: String, require: true },
        room: { type: String, ref: 'room' },
        admin: Boolean,
        resetTok: String,
        resetTokExp: Date,
        registerToken: String,
        verified: Boolean,
        appointments: [appointmentSchema]
    }, { collection: 'users' });
    User = mongoose.model('user', userSchema);



    User.deleteOne({ email: 'admin@horganize.com' }, function (error) {
        if (error) {
            log('Standard Admin could not be deleted: ' + error);
        } else {
            log('Standard Admin deleted.');
        }
        new User({
            email: 'admin@horganize.com',
            firstName: 'ADMIN',
            lastName: 'ADMIN',
            adress: '',
            school: 'UOIT',
            pswHashed: bcrypt.hashSync('ADMIN', 8),
            room: 'ADMIN',
            admin: true,
            resetTok: '',
            resetTokExp: '',
            registerToken: '',
            verified: true,
            appointments: []
        }).save(function (err) {
            if (err) {
                log('Standard Admin could not be recreated: ' + err);
            } else {
                log('Standard Admin recreated');
            }
        });

    });


    shoppingItemSchema = new mongoose.Schema({
        name: String,
        quantity: Number,
        done: Boolean

    });
    ShoppingItem = mongoose.model('shoppingItem', shoppingItemSchema);

    messagesSchema = new mongoose.Schema({
        user: String,
        datetime: Date,
        message: String,
        email: String,
        liked: [String]
    });
    Message = mongoose.model('message', messagesSchema);

    roomSchema = new mongoose.Schema({
        name: {
            type: String,
            index: true,
            unique: true,
            require: true
        },
        messages: [messagesSchema],
        items: [shoppingItemSchema],
        secret: { require: true, type: String }
    }, { collection: 'rooms' });
    Room = mongoose.model('room', roomSchema);

}

function initMailer() {
    transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: "mailhorganize@gmail.com",
            pass: "horganizem19"
        }
    },
        {
            from: "mailhorganize@gmail.com"
        });

    transporter.verify(function (error) {
        if (error) {
            log('Connection to email server ended up with error: ' + error);
        } else {
            log('Connection to email server verified.')
        }
    })
}

function checkRequest(req) { //seperate Function for all required checks to make changes easy
    if (req.session.username && req.session.room && req.session.verified) {
        return true;
    } else {
        return false;
    }
}

