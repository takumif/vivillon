var User = require('./models/user');

module.exports = function(io) {

  io.sockets.on('connection', function(socket) {

    socket.on('message', function(msg) {
      console.log(msg);
    });

    if (socket.request.user.logged_in) {

      User.findOne({ fc : socket.request.user.fc }, function(err, user) {
        if (user) {
          user.sockets.push(socket.id);
          user.save();

          console.log('emitting userOnline');
          io.sockets.emit('userOnline', { fc : user.fc });
        }
      });

      socket.on('disconnect', function() {

        User.findOne({ fc : socket.request.user.fc }, function(err, user) {
          if (user && user.sockets.indexOf(socket.id) != -1) {
            user.sockets.splice(user.sockets.indexOf(socket.id), 1);
            user.save();

            if (user.sockets.length == 0) {
              io.sockets.emit('userOffline', { fc : user.fc });
            }
          }
        });
      });

    };

  });
}