var express = require('express');
var bodyParser = require('body-parser');
var uuid = require('uuid');
var session = require('express-session');
var path = require('path');
var mongoose = require('mongoose');
var data_access = require('./backend_scripts/data_access')
var bcrypt = require('bcrypt');
var app = express();
app.set('port', process.env.PORT || 3000);
mongoose.connect('mongodb://localhost:27017/horganize', { useNewUrlParser: true });
initDB();

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
    if (req.session.username && roomAlreadyRegistered(req.session.username)) { //check if room registered!!
        res.render('dashboard_overview', {
            active: 0,
            username: req.session.username
        });
    } else {
        res.redirect('/login.html');
    }
});

app.get('/setup', function (req, res) {
    if (req.session.username) {
        res.sendFile(path.join(__dirname + '/private/setUp.html'));
    } else {
        res.redirect('/login.html');
    }
});


app.post('/register', function (req, res) {
    hashedPassword = bcrypt.hashSync(req.body.pswRegister, 8);
    data_access.register(req, res, hashedPassword, registerDone);
});

app.get('/getProfile', function (req, res) {
    data_access.getProfile(req, res, getProfileDone);
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
    if (req.session.username) {
        data_access.roomExists(req, res, callbackBoolean)
    } else {
        res.status(403);
        res.redirect('/login.html');
    }
});

app.post('/registerRoom/:roomName', function (req, res) {
    console.log('register Room');
    if (req.session.username) {
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
    if (req.session.username) {
        res.json(getRoomsFromDB(req.params.search))
    } else {
        res.sendStatus(403);
    }
});

app.post('/joinRoom', function (req, res) {
    console.log(req.params.roomName);
    console.log(req.body.psw);
    console.log(req.session.username);
    if (req.session.username) {
        // if (joinRoom(req.body.roomName, req.body.psw, req.session.username)) {
        //     res.send('true');
        // } else {
        //     res.send('false');
        // }
        data_access.joinRoom(req, res, joinRoomDone)
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
    if (req.session.username) {
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
    if (req.session.username) {
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
    if (req.session.username) {
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
    if (req.session.username) {
        // res.render('dashboard_calendar', {
        //     active: 3,
        //     username: req.session.username
        // });
        res.sendFile(path.join(__dirname + '/private/calendar.html')); //for development purposes
    } else {
        res.status(403);
        res.redirect('/login.html');
    }
});

app.get('/wallet', function (req, res) {
    if (req.session.username) {
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
    if (req.session.username) {
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
    if (req.session.username) {
        res.send(getRoomMatesFromDB(req.session.username))
    } else {
        res.status(403);
        res.redirect('/login.html');
    }
});

app.get('/getShoppingList', function (req, res) {
    let tempShoppingList = {
        "items": [{
            "name": "Milk 1l",
            "quantity": "2",
            "done": false
        }, {
            "name": "Bin Bags BigPack",
            "quantity": "1",
            "done": false
        }, {
            "name": "Apples",
            "quantity": "8",
            "done": true
        }]
    };

    if (req.session.username) {
        data_access.getShoppingList(req, res, getShoppingListDone);
    } else {
        res.status(403);
        res.redirect('/login.html');
    }
});

app.get('/admin', function (req, res) {
    if (req.session.username && req.session.admin) {
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
    data_access.deleteShopping(req, res, callbackBoolean);
});

app.post('/putShoppingList', function (req, res) {
    data_access.addShopping(req, res, callbackBoolean);
});

app.post('/putShoppingListChecked', function (req, res) {
    data_access.addShoppingChecked(req, res, callbackBoolean);
});


function callbackBoolean(req, res, error) {
    if (error) {
        res.send(false);
    } else {
        res.send(true);
    }
}

app.get('/wipeAll', function (req, res) {
    if (req.session.username && req.session.admin) {
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
    if (req.session.username) {
        data_access.deleteUser(req, res, callbackBoolean);
    } else {
        res.status(404);
        res.redirect('/login');

    } 
});

app.get('/deleteAccountEntry', function (req, res) {
    if (req.session.username) {
        res.sendFile(path.join(__dirname + '/private/delete.html'));
    } else {
        res.status(404);
        res.redirect('/login');

    } 
});

app.get('/leaveRoom', function (req, res) {
    if (req.session.username) {
        data_access.leaveRoom(req, res, callbackBoolean);
    } else {
        res.status(404);
        res.redirect('/login');
    } 
});

app.post('/updateProfile', function (req, res) {
    if (req.session.username) {
        psw = req.body.psw;
        req.body.psw = bcrypt.hashSync(psw, 8);
        data_access.updateProfile(req, res, callbackBoolean);
    } else {
        res.status(404);
        res.redirect('/login');
    } 
});

//for developer use only

app.get('/getExampleUser', function (req, res) {
    res.send(new User({
        email: 'admin@horanize.com',
        firstName: 'Admin',
        lastName: 'Admin',
        adress: '1 Admin Drive',
        school: 'UOIT',
        pswHashed: '',
        room: '',
        admin: true,
        appointments: [
            {
                date: new Date(2019, 03, 20, 15, 00, 00, 00),
                name: 'Haircut @ Hairworx'
            },
            {
                date: new Date(2019, 03, 25, 10, 30, 00, 00),
                name: 'Parents visiting'
            }
        ]

    }));
});

//end of developer section



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

function roomAlreadyRegistered(email) {
    return true; //implement db check here later
}



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


function getRoomMatesFromDB(email) {
    //implement DB check here
    return {
        "mates": [{
            "firstName": "Timo",
            "lastName": "Buechert",
            "email": "timo.buechert@uoit.net",
            "school": "UOIT"
        }, {
            "firstName": "Max",
            "lastName": "Miller",
            "email": "max.miller@durhamcollege.net",
            "school": "Durham College"
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
        res.status(200);
        res.render('landing_message', {
            message: 'Registration successful. You can now login.'
        });
    }
}

function performLogin(req, res, user) {
    if (user) {
        if (bcrypt.compareSync(req.body.pswLogin, user.pswHashed)) {
            if (user.room == '') {
                req.session.username = req.body.emailLogin;
                req.session.admin = user.admin;
                log(req.session.username + ' successfully logged in.');
                res.redirect('/setup');
            } else {
                req.session.username = req.body.emailLogin;
                req.session.room = user.room;
                req.session.admin = user.admin;
                log(req.session.username + ' successfully logged in.');
                res.redirect('/dashboard');
            }
        } else {
            log(req.session.username + ' attempted login.');
            res.render('landing_start', {
                displayWarning: true,
                message: 'Username or password incorrect. Please try again. '
            })
        }
    } else {
        log(req.session.username + ' attempted login.');
        res.render('landing_start', {
            displayWarning: true,
            message: 'Username or password incorrect. Please try again. '
        })
    }
}


function log(message) {
    console.log(new Date().getTime() + ': ' + message);
}

function initDB() {

    //init Schmemas

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
        room: String,
        admin: Boolean,
        appointments: [{
            date: Date,
            name: String
        }]
    }, { collection: 'users' });
    User = mongoose.model('users', userSchema);

    shoppingSchema = new mongoose.Schema({
        room: {
            type: String,
            index: true,
            unique: true,
            require: true
        },
        items: [{
            name: String,
            quantity: Number,
            done: Boolean
        }]
    }, { collection: 'shoppingLists' });
    List = mongoose.model('shoppingLists', shoppingSchema);

    roomSchema = new mongoose.Schema({
        name: {
            type: String,
            index: true,
            unique: true,
            require: true
        },
        secret: { require: true, type: String }
    }, { collection: 'roomList' });
    Room = mongoose.model('roomList', roomSchema);

}

