var User = require('./models/user'),
    Message = require('./models/message'),
    Feedback = require('./models/feedback'),
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
    if (validVivillonList(req.body.offering) &&
        (req.body.somethingElse == 'somethingElse' || (req.body.lookingFor && validVivillonList(req.body.lookingFor))) &&
        validVivillon(req.body.nativePattern)) {
      req.user.offering = req.body.offering;
      req.user.lookingFor = req.body.lookingFor;
      req.user.nativePattern = req.body.nativePattern;
      req.user.status = req.body.status;
      req.user.somethingElse = (req.body.somethingElse == 'somethingElse');
      req.user.save();
    } else {
      console.log('invalid update');
    }
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
            // the user is on their own page
            User.find({ offering : { $in : req.user.lookingFor } })
              .or([{ lookingFor : { $in : req.user.offering } }, { somethingElse : true }])
              .sort('-_id')
              .exec(function(err, users) {

              Message.find().or([ { toFc : req.user.fc }, { fromFc : req.user.fc } ])
                .sort('-date')
                .exec(function(err, messages) {
                  byUserMessages = {};
                  for (var i = 0; i < messages.length; i++) {
                    if (messages[i].fromFc == req.user.fc) {
                      if (byUserMessages.hasOwnProperty(messages[i].toFc)){
                        byUserMessages[messages[i].toFc].push(messages[i]);
                      } else {
                        byUserMessages[messages[i].toFc] = [messages[i]];
                      }
                    } else {
                      if (byUserMessages.hasOwnProperty(messages[i].fromFc)){
                        byUserMessages[messages[i].fromFc].push(messages[i]);
                      } else {
                        byUserMessages[messages[i].fromFc] = [messages[i]];
                      }
                    }
                  }
                  res.render('user', {
                    users : users,
                    me : req.user,
                    messages : messages,
                    byUserM : byUserMessages,
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
  });

  app.get('/about', function(req, res) {
    User.count(function(err, userCount) {
      Message.count(function(err, messageCount) {
        res.render('about', {
          userCount : userCount,
          messageCount : messageCount,
          logged_in : req.isAuthenticated()
        });
      });
    });
  });

  app.post('/about', function(req, res) {
    if (req.body.feedback != '' && req.isAuthenticated()) {
      var fb = new Feedback();
      fb.fromFc = req.user.fc;
      fb.fromIgn = req.user.ign;
      fb.content = req.body.feedback;
      fb.save();
    }
    res.redirect('/');
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

function validVivillonList(list) {
  if (validVivillon(list)) return true;
  for (var i = 0; i < list.length; i++) {
    if (!validVivillon(list[i])) return false;
  }
  return true;
}

function validVivillon(name) {
  return (names.indexOf(name) != -1);
}