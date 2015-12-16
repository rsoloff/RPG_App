var mongoose = require('mongoose');

//Schema with all the attributes for the item model
var ItemSchema = new mongoose.Schema({
  name          : String,
  description   : String,
  used          : Boolean
});

var Item = mongoose.model('Item', ItemSchema);

module.exports = Item;
