const mongoose = require('mongoose');

var CharacterSchema = new mongoose.Schema({
  name              : String,
  attack            : Number,
  defense           : Number,
  maxHp             : Number,
  currentHp         : Number,
  level             : Number,
  exp               : Number,
  maxTp             : Number,
  currentTp         : Number,
  itemCapacity      : Number,
  basicDamage       : Number,
  techniques : [{
      type : mongoose.Schema.Types.ObjectId,
      ref  : 'Technique'
  }],
  items  : [{
      type : mongoose.Schema.Types.ObjectId,
      ref  : 'Item'
  }]
});

//CharacterSchema.methods.

var Character = mongoose.model('Character', CharacterSchema);

module.exports = Character;
