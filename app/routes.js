var User = require('./models/user'),
    names = require('./vivillons');

module.exports = function(app, passport) {

  app.get('/', function(req, res) {
    if (req.isAuthenticated()) {
      res.render('user');
    } else {
      console.log('not authenticated');
      var users = [{fc: 1, ign: 'asdf', offering: ['Monsoon'], lookingFor: ['Monsoon']}, 
      {fc: 2, ign: 'asdf', offering: ['Monsoon'], lookingFor: ['Monsoon']}];
      User.find(function(err, PLACEHOLDERSHIT) {
        res.render('index', {
          users : users,
          names : names
        });
      });
    }
  });
};