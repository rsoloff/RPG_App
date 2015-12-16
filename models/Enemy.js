var mongoose = require('mongoose');

//Schema with all the attributes for the enemy model
var EnemySchema = new mongoose.Schema({
  name          : String,
  attack        : Number,
  defense       : Number,
  maxHp         : Number,
  currentHp     : Number,
  expYield      : Number,
  basicDamage   : Number,
  image         : String,
  location      : String,
  background    : String
});

var Enemy = mongoose.model('Enemy', EnemySchema);

module.exports = Enemy;
