var Character = require('../models/Character');

function getCharacter(req, res) {
  var id = req.params.id;

  Character.findById({_id: id}, function(err, character) {
    if (err) res.json({message: err + '. Could not get character'});
    res.json({character: character});
  });
}

function updateCharacter(req, res) {
  var id = req.params.id;

  Character.findById({_id: id}, function(err, character) {
    if (err) res.json({message: err + '. Could not get character'});

    if (req.body.attack) character.attack = req.body.attack;
    if (req.body.defense) character.defense = req.body.defense;
    if (req.body.maxHp) character.maxHp = req.body.maxHp;
    if (req.body.currentHp) character.currentHp = req.body.currentHp;
    if (req.body.level) character.level = req.body.level;
    if (req.body.exp) character.exp = req.body.exp;
    if (req.body.currentTp) character.currentTp = req.body.currentTp;

    character.save(function(err) {
      if (err) res.json({message: err + '. Could not update character'});
      res.json({message: 'Character updated', character: character});
    })
  });
}

module.exports = {
  getCharacter      : getCharacter,
  updateCharacter   : updateCharacter
};
