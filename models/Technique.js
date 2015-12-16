var mongoose = require('mongoose');

//Schema with all the attributes for the technique model
var TechniqueSchema = new mongoose.Schema({
  name            : String,
  description     : String,
  levelObtained   : Number,
  availability    : Boolean,
  tpCost          : Number
});

var Technique = mongoose.model('Technique', TechniqueSchema);

module.exports = Technique;
