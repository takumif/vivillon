module.exports = function(app, passport) {

  app.get('/', function(req, res) {
    if (req.isAuthenticated()) {
      res.render('user');
    } else {
      console.log('not authenticated');
      res.render('index');
    }
  });
};