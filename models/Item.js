const mongoose = require('mongoose');

var ItemSchema = new mongoose.Schema({
  name          : String,
  description   : String
});

var Item = mongoose.model('Item', ItemSchema);

module.exports = Item;
