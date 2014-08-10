var User = require('./models/user'),
    names = require('./vivillons');

module.exports = function(app, passport) {

  app.get('/', function(req, res) {
    if (req.isAuthenticated()) {
      User.find({ offering : { $in : req.user.lookingFor } }).find({ lookingFor : { $in : req.user.offering } }, function(err, users) {
        res.render('user', {
          users : users
        });
      });
    } else {
      console.log('not authenticated');

      // dummy users
      // var users = [{fc: 1, ign: 'asdf', offering: ['Monsoon'], lookingFor: ['Monsoon']}, 
      // {fc: 2, ign: 'asdf', offering: ['Monsoon'], lookingFor: ['Monsoon']}];
      
      User.find(function(err, users) {
        res.render('index', {
          users : users,
          names : names
        });
      });
    }
  });

  app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

  app.post('/register', passport.authenticate('local-signup', {
    successRedirect : '/', // redirect to the secure profile section
    failureRedirect : '/', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

  app.get('/logout', function(req, res) {
    req.session.destroy(function (err) {
      res.redirect('/');
    });
  });

};