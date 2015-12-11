'use strict'
var mongoose    = require('mongoose');
var Character   = require('./models/Character.js');
var Enemy       = require('./models/Enemy.js');
var Item        = require('./models/Item.js');
var Technique   = require('./models/Technique.js');
var seeder      = require('mongoose-seeder');
var data        = require('./data.json');

mongoose.connect(process.env.MONGOLAB_URI||'mongodb://localhost/rpgApp');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', callback=>console.log('mongoose connected'));

seeder.seed(data, {dropDatabase: false}).then(function(rpgApp) {
  console.log(rpgApp)
  console.log('database has been seeded');
  //mongoose.connection.close();
}).catch(function(err) {
  console.log(err + 'cannot seed database');
  mongoose.connection.close();
});

/*seeder.connect('mongodb://localhost/rpgApp'), function() {
  seeder.loadModels([
    './models/Character',
    './models/Enemy',
    './models/Item',
    './models/Technique'
  ]);
  seeder.clearModels(['Character', 'Enemy', 'Item', 'Technique'], function() {
    seeder.populateModels(data)
  })
};

var fighter = new Character({
  name              : 'Fighter',
  attack            : 15,
  defense           : 10,
  currentDefense    : 10,
  maxHp             : 1000,
  currentHp         : 1000,
  level             : 1,
  exp               : 0,
  maxTp             : 100,
  currentTp         : 100,
  itemCapacity      : 5,
  basicDamage       : 75,
  actions           : 1,
  techniques : [{
    { name          : 'Strong Slash',
      description   : 'An incredibly powerful strike. Deals 1.5 * normal damage.',
      levelObtained : 1,
      availability  : true,
      tpCost        : 10
    },
    { name          : 'Power Charge',
      description   : 'Focuses your energy to prepare one massive attack. Next attack deals 2.5 * normal damage.',
      levelObtained : 3,
      availability  : false,
      tpCost        : 15
    },
    { name          : 'Shed Armor',
      description   : 'Remove some of your armor to gain speed. Defense is halfed but you can attack twice a turn for the rest of the battle.',
      levelObtained : 5,
      availability  : false,
      tpCost        : 30
    }
  }],
  items  : [
    { name: 'Health Potion', description: 'Restores half of your maximum HP.'},
    { name: 'Health Potion', description: 'Restores half of your maximum HP.'},
    { name: 'Stamina Potion', description: 'Restores half of your maximum TP.'},
    { name: 'Stamina Potion', description: 'Restores half of your maximum TP.'},
    { name: 'Max Potion', description: 'Restores all of your HP and TP.'}
  ]
})

fighter.save(function (err) {
  if(err){
    console.log(err)
  }else{
    console.log("Fighter saved");
  }
};*/
