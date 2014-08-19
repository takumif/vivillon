var mongoose = require('mongoose');

// define the schema for our user model
var schema = mongoose.Schema({
  id             : String,
  userFc         : String,
  created        : Date
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Socket', schema);
