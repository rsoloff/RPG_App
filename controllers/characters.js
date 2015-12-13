var Character = require('../models/Character');

function getAllCharacters(req, res) {
  Character.find(function(err, characters) {
    if (err) res.json({message: err + '. Could not get characters'});
    res.json({characters: characters});
  });
}

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
    if (req.body.currentDefense) character.currentDefense = req.body.currentDefense;
    if (req.body.currentHp) character.currentHp = req.body.currentHp;
    if (req.body.level) character.level = req.body.level;
    if (req.body.exp) character.exp = req.body.exp;
    if (req.body.currentTp) character.currentTp = req.body.currentTp;
    if (req.body.actions) character.actions = req.body.actions;

    character.save(function(err) {
      if (err) res.json({message: err + '. Could not update character'});
      res.json({message: 'Character updated', character: character});
    })
  });
}

module.exports = {
  getAllCharacters  : getAllCharacters,
  getCharacter      : getCharacter,
  updateCharacter   : updateCharacter
};
