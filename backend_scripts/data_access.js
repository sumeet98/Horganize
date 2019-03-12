exports.register = function(req, res, hashedPassword, callback) {
    
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
    User.find({email: req.body.emailLogin}).then(function (user) {
        if (user.length > 0) {
            callback(req, res, user[0]);
        } else {
            callback(req, res, null);
        }
    });
}

 