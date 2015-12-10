var Enemy = require('../models/Enemy');

function getEnemy(req, res) {
  var id = req.params.id;

  Enemy.findById({_id: id}, function(err, enemy) {
    if (err) res.json({message: err + '. Could not get enemy'});
    res.json({enemy: enemy});
  });
}

function updateEnemy(req, res) {
  var id = req.params.id;

  Enemy.findById({_id: id}, function(err, enemy) {
    if (err) res.json({message: err + '. Could not get enemy'});

    if (req.body.currentHp) enemy.currentHp = req.body.currentHp;

    enemy.save(function(err) {
      if (err) res.json({message: err + '. Could not update enemy'});
      res.json({message: 'Enemy updated', enemy: enemy});
    })
  });
}

module.exports = {
  getEnemy      : getEnemy,
  updateEnemy   : updateEnemy
};
