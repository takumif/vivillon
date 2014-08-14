var mongoose = require('mongoose');

// define the schema for our user model
var schema = mongoose.Schema({
  fromFc         : String,
  fromIgn        : String,
  content        : String
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Feedback', schema);
