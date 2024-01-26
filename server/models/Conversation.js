const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  _id: {
    type:String,
    require: true
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  message: {
    type: String,
  },
  phone: {
    type: String,
  },
  createdAt: {
    type: String,
  },
  updatedAt: {
    type: String,
  },
});

module.exports = mongoose.model('Conversation', conversationSchema);
