var mongoose = require('mongoose');

// define the schema for our user model
var messageSchema = mongoose.Schema({
  fromFc         : String,
  fromIgn        : String,
  toFc           : String,
  toIgn          : String,
  date           : Date,
  content        : String
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Message', messageSchema);
