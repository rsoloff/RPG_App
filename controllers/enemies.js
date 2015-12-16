var Enemy = require('../models/Enemy');

//Route to get all the enemies. Used to decide which enemy is fought
function getAllEnemies(req, res) {
  Enemy.find(function(err, enemies) {
    if (err) res.json({message: err + '. Could not get enemies'});
    res.json({enemies: enemies});
  });
}

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

//All are exported for use by routes.js
module.exports = {
  getAllEnemies : getAllEnemies,
  getEnemy      : getEnemy,
  updateEnemy   : updateEnemy
};
