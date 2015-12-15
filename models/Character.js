var mongoose = require('mongoose');

var CharacterSchema = new mongoose.Schema({
  name              : String,
  attack            : Number,
  defense           : Number,
  currentDefense    : Number,
  maxHp             : Number,
  currentHp         : Number,
  level             : Number,
  exp               : Number,
  maxTp             : Number,
  currentTp         : Number,
  itemCapacity      : Number,
  basicDamage       : Number,
  actions           : Number,
  image             : String,
  items  : [{
      ref  : 'Item',
      type : mongoose.Schema.Types.ObjectId
  }],
  techniques : [{
      ref  : 'Technique',
      type : mongoose.Schema.Types.ObjectId
  }]
});

//CharacterSchema.methods.

var Character = mongoose.model('Character', CharacterSchema);

module.exports = Character;
