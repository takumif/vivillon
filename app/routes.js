var User = require('./models/user'),
    names = require('./vivillons');

module.exports = function(app, passport) {

  app.get('/', function(req, res) {
    if (req.isAuthenticated()) {
      res.render('user');
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
};