var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var messageSchema = new Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {type: String, required: true},
  sent_at: {type: Date, required: true},
});

messageSchema.pre('save', function(next) {

  var currentDate = new Date();
  
  if (!this.created_at)
    this.sent_at = currentDate;

  next();
});

var Message = mongoose.model('Message', messageSchema);

module.exports = Message;