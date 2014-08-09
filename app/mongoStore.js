var database = require('./database');

module.exports = function(session, secret) {
  var MongoStore = require('connect-mongo')(session);
  var db = {
    db : 'vivillon',
    auto_reconnect : true,
    url : database.url
  };
  return new MongoStore(db);
}