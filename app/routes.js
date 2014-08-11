var User = require('./models/user'),
    Message = require('./models/message'),
    names = require('./vivillons');

module.exports = function(app, passport) {

  app.get('/', function(req, res) {
    if (req.isAuthenticated()) {
      User.find({ offering : { $in : req.user.lookingFor } }).find({ lookingFor : { $in : req.user.offering } }, function(err, users) {
        Message.find( { toFc : req.user.fc }).sort('-date').exec(function(err, messages) {
          res.render('user', {
            users : users,
            me : req.user,
            messages : messages
          });
        })
      });
    } else {
      console.log('not authenticated');
      
      User.find().limit(5).find(function(err, users) {
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

  app.get('/redirect', function(req, res) {
    setTimeout(function() {
      res.redirect('/');
    }, 500);
  });

  app.get('/user/:fc', function(req, res) {
    console.log(req.params.fc);
    User.findOne({ fc : req.params.fc }, function(err, user) {
      if (user) {
        if (req.isAuthenticated()) {
          Message.findOne({ toFc : user.fc, fromFc : req.user.fc, content : 'addme' }, function(err, addme) {
            res.render('userInfo', {
              user : user,
              asked : Boolean(addme),
              logged_in : true
            });
          });
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