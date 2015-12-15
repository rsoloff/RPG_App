const mongoose = require('mongoose');

var EnemySchema = new mongoose.Schema({
  name          : String,
  attack        : Number,
  defense       : Number,
  maxHp         : Number,
  currentHp     : Number,
  expYield      : Number,
  basicDamage   : Number,
  image         : String
});

var Enemy = mongoose.model('Enemy', EnemySchema);

module.exports = Enemy;
