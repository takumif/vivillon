var User = require('./models/user');
var Socket = require('./models/socket');

module.exports = function(io) {

  io.sockets.on('connection', function(socket) {

    socket.on('message', function(msg) {
      console.log(msg);
    });

    if (socket.request.user.logged_in) {

      var newSocket = new Socket();
      newSocket.id = socket.id;
      newSocket.userFc = socket.request.user.fc;
      newSocket.created = new Date();
      newSocket.save();

      User.findOne({ fc : socket.request.user.fc }, function(err, user) {

        if (!user.online) {

          user.online = true;
          user.save();

          io.sockets.emit('userOnline', { fc : user.fc });
          console.log('userOnline');
        }
      })

      socket.on('disconnect', function() {

        Socket.find({ userFc : socket.request.user.fc }, function(err, sockets) {

          if (sockets.length == 1) {
            User.findOne({ fc : socket.request.user.fc }, function(err, user) {

              user.online = false;
              user.save();

              io.sockets.emit('userOffline', { fc : user.fc });
              console.log('userOffline');
            });
          }

          Socket.findOne({ id : socket.id }, function(err, s) {
            if (s) s.remove();
          });
          console.log('removing: ' + socket.id);
        });
      });

    }
  });

  updateOnlineInfo();
}

function updateOnlineInfo() {

  User.find({}, function(err, users) {

    for (var i = 0; i < users.length; i++) {

      var user = users[i];

      user.online = false;
      user.save();

      Socket.find({ userFc : user.fc }, function(err, sockets) {

        for (var j = 0; j < sockets.length; j++) {
          if ((new Date()) - sockets[j].created > 3 * 60 * 60 * 1000) {
            Socket.remove({ id : sockets[j].id });
          }
        }

        if (sockets.length != 0) {
          User.findOne({ fc : sockets[0].userFc }, function(err, user) {
            user.online = true;
            user.save();
          })
        }
      });
    } 
  });

  setTimeout(function() {
    console.log('updateOnlineInfo');
    updateOnlineInfo();
  }, 5 * 60 * 1000);
}