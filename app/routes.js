module.exports = function(app, passport) {

  // =====================================
  // HOME PAGE (with login links) ========
  // =====================================
  app.get('/', function(req, res) {
    if (req.isAuthenticated()) {
      user = req.user; // wonder if this works
      res.render('chat.ejs', {
        user : req.user
      });
    } else {
      res.render('index.ejs'); // load the index.ejs file
    }
  });
}