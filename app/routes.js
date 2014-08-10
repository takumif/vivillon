var User = require('./models/user'),
    names = require('./vivillons');

module.exports = function(app, passport) {

  app.get('/', function(req, res) {
    if (req.isAuthenticated()) {
      User.find({ offering : { $in : req.user.lookingFor } }).find({ lookingFor : { $in : req.user.offering } }, function(err, users) {
        res.render('user', {
          users : users,
          me : req.user
        });
      });
    } else {
      console.log('not authenticated');
      
      User.find(function(err, users) {
        res.render('index', {
          users : users,
          names : names
        });
      });
    }
  });


  app.get('/update', function(req, res) {
    res.render('update', {
      user : req.user,
      names : names
     });
  });

  app.post('/update', function(req, res) {
    console.log(req.body.offering)
    req.user.offering = req.body.offering;
    req.user.lookingFor = req.body.lookingFor;
    req.user.save();
    res.redirect('/');
  })

  app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/', // redirect to the secure profile section
    failureRedirect : '/', // redirect back to the signup page if there is an error
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