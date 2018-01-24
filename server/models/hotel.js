const mongoose = require('mongoose');

const room = mongoose.Schema({
  name: { type: String },
  price: { type: Number },
  quantity: { type: Number },
  square: {type: String},
  beds: {type: String},
  description: {type: String},
  image: {type: String},
  type: { type: String },
  booked: { type : Boolean }
});

module.exports = mongoose.model('room', room);
