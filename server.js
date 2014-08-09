<<<<<<< HEAD
var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');

=======
// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
>>>>>>> cd79c03d55f8ef669a9ef504494ebe1438d179b0
var ip       = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port     = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./app/database');
var sessionSecret = require('./app/secret').sessionSecret;
var mongoStore = require('./app/mongoStore')(session, sessionSecret);

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./app/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms
app.use(express.static(__dirname + '/public'));

<<<<<<< HEAD
// routes
require('./app/routes')(app, passport);

=======
app.set('view engine', 'jade'); // set up ejs for templating
>>>>>>> cd79c03d55f8ef669a9ef504494ebe1438d179b0

// required for passport
app.use(session({ store: mongoStore, secret: sessionSecret })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// routes ======================================================================
require('./app/routes')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port, ip);


console.log('The server is running on port ' + port);
