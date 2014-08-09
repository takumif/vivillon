module.exports = function(app, passport) {

<<<<<<< HEAD
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
=======
  app.get('/', function(req, res) {
    if (req.isAuthenticated()) {
      res.render('user');
    } else {
      console.log('not authenticated');
      res.render('index');
    }
  });
};
>>>>>>> cd79c03d55f8ef669a9ef504494ebe1438d179b0
