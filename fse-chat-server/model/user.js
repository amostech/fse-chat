var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
  username: {type: String, required: true, unique: true},
  status: {type: String, required: true},
  created_at: {type: Date, required: false},
  updated_at: {type: Date, required: false}
});

userSchema.pre('save', function(next) {

  var currentDate = new Date();
  
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at)
    this.created_at = currentDate;

  next();
});

var User = mongoose.model('User', userSchema);

module.exports = User;