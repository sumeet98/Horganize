var express = require('express');
var bodyParser = require('body-parser');
var uuid = require('uuid');
var session = require('express-session');
var path = require('path');
var app = express();
app.set('port', process.env.PORT || 3000);


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
    if (checkUserPassword(request.body.emailLogin, request.body.pswLogin)) {
        if (firstLogin(request.body.emailLogin)) {
            request.session.username = request.body.emailLogin;
            response.redirect('/setup');
        } else {
            request.session.username = request.body.emailLogin;
            response.redirect('/dashboard');

        }
    } else {
        response.render('landing_start', {
            displayWarning: true,
            message: 'Username or password incorrect. Please try again. '
        })
    }
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
    console.log(
        req.body.emailRegister +
        req.body.pswRegister +
        req.body.nameFirstRegister +
        req.body.nameLastRegister +
        req.body.adressRegister +
        req.body.schoolRegister);
    if (register(req.body)) {
        res.sendStatus(200);
    } else {
        res.sendStatus(403);
    }

})

app.post('/checkRoomNameAvailable/:roomName', function (req, res) {
    if (req.session.username) {

        if (roomNameExists(req.params.roomName)) {
            console.log(req.params.roomName);
            res.send('false');
        } else {
            res.send('true');
        }
    } else {
        res.sendStatus(403);
    }
});

app.post('/registerRoom/:roomName', function (req, res) {
    console.log('register Room');
    if (req.session.username) {
        if (registerRoom(req.params.roomName, req.session.username)) {
            res.send('true');
        } else {
            res.send('false');
        }

    } else {
        res.sendStatus(403);
    }
});

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
        if (joinRoom(req.body.roomName, req.body.psw, req.session.username)) {
            res.send('true');
        } else {
            res.send('false');
        }
    } else {
        res.sendStatus(403);
    }
});

app.get('/logout', function (req, res) {
    if (req.session.username) {
        console.log('Logout user: ' + req.session.username);
        req.session.destroy(function (error) { });
        res.redirect('/login.html');
    } else {
        res.redirect('/login.html');
    }
});

app.get('/shopping', function (req, res) {
    if (req.session.username) {
        res.render('dashboard_shopping', {
            active: 1,
            username: req.session.username
        });
    } else {
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
        res.redirect('/login.html');
    }
});

app.get('/calendar', function (req, res) {
    if (req.session.username) {
        res.render('dashboard_calendar', {
            active: 3,
            username: req.session.username
        });
    } else {
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
        res.redirect('/login.html');
    }
});

app.post('/roommates', function(req, res){
    if (req.session.username) {
        res.send(getRoomMatesFromDB(req.session.username))
    } else {
        res.redirect('/login.html');
    }
});

app.listen(app.get('port'), function () {
    console.log('Server started up and is now listening on port:' + app.get('port'));
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

function checkUserPassword(email, password) {
    if (email === 'timo.buechert@uoit.net' && password === 'test') {
        return true; //implement db check here later
    } else {
        return false;
    }
}

function register(body) {
    //implement db registering here
    return true;
}

function firstLogin(email) {
    //implement db check here
    return true;
}

function roomNameExists(roomName) {
    //implement db check here
    if (roomName === ':default') {
        return false;
    } else {
        return true;
    }
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

function joinRoom(roomName, psw, username) {
    if (roomName == 'test' && psw == 'test' && username == 'timo.buechert@uoit.net') {
        return true;
    } else {
        return false;
    }
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

