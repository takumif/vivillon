var User = require('./models/user'),
    Message = require('./models/message'),
    names = require('./vivillons');

module.exports = function(app, passport) {

  app.get('/', function(req, res) {
    if (req.isAuthenticated()) {
      res.redirect('/user/' + req.user.fc);
    } else {
      console.log('not authenticated');
      
      User.find().sort('-_id').limit(5).exec(function(err, users) {
        res.render('index', {
          users : users,
          names : names,
          flash : req.flash('loginMessage')
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
    failureRedirect : '/', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }), function(req, res) {
    res.redirect('/success/' + req.body.fc + '/' + req.body.password);
  });

  app.post('/register', passport.authenticate('local-signup', {
    failureRedirect : '/', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }), function(req, res) {
    res.redirect('/success/' + req.body.fc + '/' + req.body.password);
  });

  app.get('/success/:fc/:password', function(req, res) {
    if (req.isAuthenticated()) {
      res.redirect('/user/' + req.user.fc);
    } else {
      console.log('REDIRECT LOOPING');
      passport.authenticate('local-login', {
        successRedirect : '/user/' + req.params.fc,
        failureRedirect : '/success/' + req.params.fc + '/' + req.params.password
      })
    }
  });

  app.get('/logout', function(req, res) {
    req.session.destroy(function (err) {
      res.redirect('/');
    });
  });

  app.get('/redirect', function(req, res) {
    setTimeout(function() {
      res.redirect('/');
    }, 100);
  });

/*
  app.get('/login', function(req, res) {
    setTimeout(function() {
      if (req.isAuthenticated()) {
        res.redirect('/');
      } else {
        res.redirect('/login');
      }
    }, 100);
  });
*/

  app.get('/user/:fc', function(req, res) {
    User.findOne({ fc : req.params.fc }, function(err, user) {
      if (user) {
        if (req.isAuthenticated()) {
          if (user.fc == req.user.fc) {
            User.find({ offering : { $in : req.user.lookingFor } }).find({ lookingFor : { $in : req.user.offering } }, function(err, users) {
              Message.find( { toFc : req.user.fc }).sort('-date').exec(function(err, messages) {
                res.render('user', {
                  users : users,
                  me : req.user,
                  messages : messages,
                  offeringList : peopleLookup(users, true),
                  lookingForList : peopleLookup(users, false)
                });
              })
            });
          } else {
            Message.findOne({ toFc : user.fc, fromFc : req.user.fc, content : 'addme' }, function(err, addme) {
              res.render('userInfo', {
                user : user,
                asked : Boolean(addme),
                logged_in : true,
              });
            });
          }
        } else {
          res.render('userInfo', { user : user, logged_in : false });
        }
      }
      else {
        console.log('not found');
        req.next();
      }
    });
  });

  app.post('/sendMessage', function(req, res) {
    console.log(req.body);
    User.findOne( {fc : req.body.recipient }, function(err, user) {
      if (user) {
        var message = new Message();
        message.fromFc = req.user.fc;
        message.fromIgn = req.user.ign;
        message.toFc = user.fc;
        message.toIgn = user.ign;
        message.date = new Date();
        message.content = req.body.content;
        message.save();
      }
    });
    if (req.body.content == 'addme') {
      res.redirect('/user/' + req.body.recipient);
    } else {
      res.redirect('/');
    }
  })

};

function peopleLookup(users, offering) {
  var map = {};
  for (var v = 0; v < names.length; v++) {
    map[names[v]] = [];
  }
  if (offering) {
    for (var i = 0; i < users.length; i++) {
      for (var j = 0; j < users[i].offering.length; j++) {
        map[users[i].offering[j]].push(users[i].fc);
      }
    }
  } else {
    for (var i = 0; i < users.length; i++) {
      for (var j = 0; j < users[i].lookingFor.length; j++) {
        map[users[i].lookingFor[j]].push(users[i].fc);
      }
    }
  }
  return map;
}