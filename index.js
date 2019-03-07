var express = require('express');
var bodyParser = require('body-parser');
var uuid = require('uuid');
var session = require('express-session');
var path = require('path');
var app = express();
app.set('port', process.env.PORT || 3000);

app.use(express.static('public'));

app.use(session({
    secret: 'Z5vyQoTAeS',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
    genid: function (request) { return uuid(); }
}));

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/login', function (request, response) {
    if (checkUserPassword(request.body.emailLogin, request.body.pswLogin)) {
        request.session.username = request.body.emailLogin;
        console.log('succesfull');
        response.sendFile(path.join(__dirname + '/private/dashboard.html'));
    } else {
        console.log('not succesfull');
    }
});


app.post('/register', function (req, res) {
    console.log( 
    req.body.emailRegister + 
    req.body.pswRegister + 
    req.body.nameFirstRegister + 
    req.body.nameLastRegister + 
    req.body.adressRegister +
    req.body.schoolRegister );
    if (register(req.body)) {
        res.sendStatus(200);
    } else {
        res.sendStatus(403);
    }
    
})

app.get('/calendar', function (req, res) {
    if (req.session.username) {
        res.send('Yahoo!');
        console.log('Authorized request');
    }else{
        console.log('Unauthorized request');
    }
});

app.listen(app.get('port'), function () {
    console.log('Server started up and is now listening on port:' + app.get('port'));
});

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
