var names = require('./vivillons');
// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var User          = require('../app/models/user');

// expose this function to our app using module.exports
module.exports = function(passport) {

  // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

  // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'fc',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, fc, password, done) {
        if (!validFC(fc)) {
            return done(null, false, req.flash('signupMessage', 'Invalid Friend Code.'));
        }
        
        if (req.body.ign == '' ||
            password == '' ||
            req.body.nativePattern == 'Native pattern' ||
            req.body.offering == null ||
            !validVivillon(req.body.nativePattern) ||
            !(validVivillonList(req.body.offering) || validVivillon(req.body.offering)) ||
            (req.body.somethingElse != 'somethingElse' && !(validVivillonList(req.body.lookingFor) || validVivillon(req.body.lookingFor)))) {
            return done(null, false, req.flash('signupMessage', 'Fields cannot be empty.'));
        }

    // find a user whose email is the same as the forms email
    // we are checking to see if the user trying to login already exists
        User.findOne({ 'fc' :  fc }, function(err, user) {
            // if there are any errors, return the error
            if (err)
                return done(err);

            // check to see if theres already a user with that email
            if (user) {
                return done(null, false, req.flash('signupMessage', 'That Friend Code is already registered.'));
            } else {

        // if there is no user with that email
                // create the user
                var newUser = new User();

                // set the user's local credentials
                newUser.fc = fc;
                newUser.ign    = req.body.ign;
                newUser.password = newUser.generateHash(password); // use the generateHash function in our user model
                newUser.offering = req.body.offering;
                newUser.lookingFor = req.body.lookingFor;
                newUser.nativePattern = req.body.nativePattern;
                newUser.somethingElse = (req.body.somethingElse == 'somethingElse');
        // save the user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }
        });

    }));

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'fc',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, fc, password, done) { // callback with email and password from our form
        if (!validFC(fc)) {
            return done(null, false, req.flash('loginMessage', 'Invalid Friend Code.'));
        }

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'fc' :  fc }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user || !user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Invalid Friend Code or password.')); // req.flash is the way to set flashdata using connect-flash

            // all is well, return successful user
            return done(null, user);
        });

    }));

};

function validFC(fc) {
    return /^([0-9]{12})$/.test(fc.replace(/-/g, ''));
}

function validVivillonList(list) {
  if (list == null) return false;
  for (var i = 0; i < list.length; i++) {
    if (!validVivillon(list[i])) return false;
  }
  return true;
}

function validVivillon(name) {
  return (names.indexOf(name) != -1);
}