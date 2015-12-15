'use strict'
var mongoose    = require('mongoose');
var Character   = require('./models/Character.js');
var Enemy       = require('./models/Enemy.js');
var Item        = require('./models/Item.js');
var Technique   = require('./models/Technique.js');
var seeder      = require('mongoose-seeder');
var data        = require('./data.json');

mongoose.connect('mongodb://127.0.0.1:27017/rpgApp');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', (callback)=>console.log('mongoose connected'));

seeder.seed(data, {dropDatabase: false}).then(function(rpgApp) {
  console.log('database has been seeded');
  mongoose.connection.close();
}).catch(function(err) {
  console.log(err + 'cannot seed database');
  mongoose.connection.close();
});

var fighter = new Character({
  name              : 'Fighter',
  attack            : 175,
  defense           : 125,
  currentDefense    : 125,
  maxHp             : 1000,
  currentHp         : 1000,
  level             : 1,
  exp               : 0,
  maxTp             : 100,
  currentTp         : 100,
  itemCapacity      : 5,
  basicDamage       : 75,
  actions           : 1,
  image             : "http://vignette2.wikia.nocookie.net/dissidiadreamcharacters/images/6/6d/Warrior_of_Light_(Alt_2_EX_Mode).png/revision/latest/scale-to-width-down/378?cb=20130702003901"
});

fighter.save(function (err) {
  if(err){
    console.log(err)
  }else{
    console.log("Fighter saved");
    var strongSlash = new Technique({
      name: 'Strong Slash',
      description: 'An incredibly powerful strike. Deals 1.5 * normal damage.',
      levelObtained : 1,
      availability  : true,
      tpCost        : 10
    });
    strongSlash.save(function(err) {
      if(err){
        console.log(err)
      }else{
        console.log("Strong Slash saved");
        fighter.techniques.push(strongSlash._id);
        var powerCharge = new Technique({
          name: 'Power Charge',
          description   : 'Focuses your energy to prepare one massive attack. Next attack deals 2.5 * normal damage.',
          levelObtained : 3,
          availability  : false,
          tpCost        : 15
        });
        powerCharge.save(function(err) {
          if(err){
            console.log(err)
          }else{
            console.log("Power Charge saved");
            fighter.techniques.push(powerCharge._id);
            var shedArmor = new Technique({
                name          : 'Shed Armor',
                description   : 'Remove some of your armor to gain speed. Defense is halfed but you can attack twice a turn for the rest of the battle.',
                levelObtained : 5,
                availability  : false,
                tpCost        : 30
            });
            shedArmor.save(function(err) {
              if(err){
                console.log(err)
              }else{
                console.log("Shed Armor saved");
                fighter.techniques.push(shedArmor._id);
                var maxPotion1 = new Item({
                  name: 'Max Potion',
                  description: 'Restores all of your HP and TP.',
                  used: false
                });
                maxPotion1.save(function(err) {
                  if(err){
                    console.log(err)
                  }else{
                    console.log("Max Potion saved");
                    fighter.items.push(maxPotion1._id);
                    var maxPotion2 = new Item({
                      name: 'Max Potion',
                      description: 'Restores all of your HP and TP.',
                      used: false
                    });
                    maxPotion2.save(function(err) {
                      if(err){
                        console.log(err)
                      }else{
                        console.log("Max Potion saved");
                        fighter.items.push(healthPotion2._id);
                        var staminaPotion1 = new Item({
                          name: 'Stamina Potion',
                          description: 'Restores half of your maximum TP.',
                          used: false
                        });
                        staminaPotion1.save(function(err) {
                          if(err){
                            console.log(err)
                          }else{
                            console.log("Stamina Potion saved");
                            fighter.items.push(staminaPotion1._id);
                            var staminaPotion2 = new Item({
                              name: 'Stamina Potion',
                              description: 'Restores half of your maximum TP.',
                              used: false
                            });
                            staminaPotion2.save(function(err) {
                              if(err){
                                console.log(err)
                              }else{
                                console.log("Stamina Potion saved");
                                fighter.items.push(staminaPotion2._id);
                                var maxPotion = new Item({
                                  name: 'Max Potion',
                                  description: 'Restores all of your HP and TP.',
                                  used: false
                                });
                                maxPotion.save(function(err) {
                                  if(err){
                                    console.log(err)
                                  }else{
                                    console.log("Max Potion saved");
                                    fighter.items.push(maxPotion._id);
                                    fighter.save();
                                  }
                                })
                              }
                            })
                          }
                        })
                      }
                    })
                  }
                })
              }
            })
          }
        })
      }
    })
  }
});
