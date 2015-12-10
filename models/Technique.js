const mongoose = require('mongoose');

var TechniqueSchema = new mongoose.Schema({
  name            : String,
  description     : String,
  levelObtained   : Number,
  availability    : Boolean,
  tpCost          : Number
});

var Technique = mongoose.model('Technique', TechniqueSchema);

module.exports = Technique;
