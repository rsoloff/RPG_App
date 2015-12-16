$(document).ready(function() {
  //Page starts with character selection
  $.get('/characters/', renderCharacter, 'json');
});

// ======================================================================
// BEGIN GAME AND RENDER FUNCTIONS ======================================
// ======================================================================

var renderCharacter = function(data) {
  //When run, sets default background image and hides battle screen divs
  $('body').css('backgroundImage', "url(http://3.bp.blogspot.com/-QTB_xjfnAzo/UQBy1pG9wKI/AAAAAAAAASI/__hGyjbozgU/s1600/scroll+w+grid.bmp)");
  $('.Character-Select').show();
  $('.container').hide()
  $attack.hide();
  $techniques.hide();
  $items.hide();
  //Shows name and image of all characters that can be used
  var characterList = data.characters;
  for (var i = 0; i < characterList.length; i++) {
    var $h2 = $('<h2 id="name">');
    $h2.css("font-family", "Orbitron");
    $h2.html(characterList[i].name);
    var $characterImg = $('<img id="character">')
    $characterImg.attr('src', characterList[i].image);
    var $character = $('<div>')
    $character.append($h2);
    $character.append($characterImg);
    $characters.append($character);
    var selected = characterList[i];
    //When a character is clicked, they become the currentCharacter.
    //Name HP and TP are displayed.
    //Game goes to beginning text.
    $character.on('click', function() {
      $('.container').show();
      currentCharacter = selected;
      var $h2 = $('<h2>');
      $h2.html(currentCharacter.name);
      $('.chosen-name').empty();
      $('.hp').empty();
      $('.tp').empty();
      $('.chosen-name').append($h2);
      var $h2 = $('<h2>').attr('id', 'hp');
      currentCharacter.currentHp = currentCharacter.maxHp
      $h2.html('HP: ' + currentCharacter.currentHp + '/' + currentCharacter.maxHp);
      $('.hp').append($h2);
      currentCharacter.currentTp = currentCharacter.maxTp
      var $h2 = $('<h2>').attr('id', 'tp')
      $h2.html('TP: ' + currentCharacter.currentTp + '/' + currentCharacter.maxTp);
      $('.tp').append($h2);
      $('.Character-Select').hide();
      $characters.empty();
      //Text is cleared then filled throughout game.
      //It has a blinking down arrow to prompt click event, which either loads more text or next function.
      var $h3 = $('<h3>').html('You have chosen to be a ' + currentCharacter.name + ' on your quest.');
      $text.append($h3);
      $text.append($glyphicon);
      $text.on('click', function() {
        $text.empty();
        $text.unbind('click');
        openingText();
      });
    });
  };
};

//More text to start game. Afterwards uses get route for techniques to get all techniques.
var openingText = function() {
  var $h3 = $('<h3>').html('You set out on your great quest!');
  $text.append($h3);
  $text.append($glyphicon);
  $text.on('click', function() {
    $text.empty();
    $text.unbind('click');
    var $h3 = $('<h3>').html("What is your quest you ask?");
    $text.append($h3);
    $text.append($glyphicon);
    $text.on('click', function() {
      $text.empty();
      $text.unbind('click');
      var $h3 = $('<h3>').html("I don't know. Go kill some monsters or something.");
      $text.append($h3);
      $text.append($glyphicon);
      $text.on('click', function() {
        $text.empty();
        $text.unbind('click');
        $.get('/techniques/', setTechniques, 'json');
      });
    });
  });
};

//Gets all techniques then runs item get route.
var setTechniques = function(data) {
  allTechniques = data.techniques;
  $.get('/items', setItems, 'json');
};

//Gets all items then runs enemy get route to select enemy.
var setItems = function(data) {
  allItems = data.items;
  $.get('/enemies', renderEnemy, 'json');
};

//Gets all of the enemies from the database and determines which one to display
var renderEnemy = function(data) {
  //First clear previous enemy and hide battle commands, used for later enemies.
  $enemy.empty();
  $attack.hide();
  $techniques.hide();
  $items.hide();
  enemyList = data.enemies;
  if (enemyNumber === enemyList.length) {
    //Checks how many enemies have been defeated. Based on enemyNumber increasing with each encounter.
    winGame();
  } else {
    //EnemyNumber starts at 0, the index number of the enemyList that matches this number determines which enemy is fought.
    currentEnemy = enemyList[enemyNumber];
    //Change backgroundImage based on the currentEnemy and changes text accordingly.
    var $h3 = $('<h3>').html('You arrive at ' + currentEnemy.location + '.');
    $text.append($h3);
    $text.append($glyphicon);
    $('body').css('backgroundImage', "url(" + currentEnemy.background+ ")");
    $text.on('click', function() {
      $text.empty();
      var $h3 = $('<h3>').html('Suddenly, you are attacked by the ' + currentEnemy.name + '!');
      $text.append($h3);
      $text.append($glyphicon);
      $text.on('click', function() {
        //Display enemy image. Increase enemyNumber by 1, so that next enemy is selected when renderEnemy is run again.
        //Goes to player's turn.
        $text.empty();
        $img = $('<img id="enemy">')
        $img.attr('src', currentEnemy.image);
        $enemy.append($img);
        enemyNumber += 1;
        $text.unbind('click');
        playerTurn();
      });
    });
  };
};

// ======================================================================
// PLAYER TURN OPTION FUNCTIONS =========================================
// ======================================================================

//Display all divs with battle commands and activates click events.
//$techniqueList and $itemList are emptied so the route can be hit again for updates.
var playerTurn = function() {
  $text.empty();
  var $h3 = $('<h3>').html('It is your turn.');
  $text.append($h3);
  $attack.show();
  $techniques.show();
  $items.show();
  $techniqueList.empty();
  $itemList.empty();
  $attack.on('click', playerAttack);
  $techniques.on('click', chooseTechnique);
  $items.on('click', chooseItem);
};

//When command is selected, uses get command to allow the player to choose a technique.
var techniqueMenu = function() {
  $.get('/techniques', chooseTechnique, 'json');
};

//When command is selected, uses get command to allow the player to choose an item.
var itemMenu = function() {
  $.get('/items', chooseItem, 'json');
};

var chooseTechnique = function() {
  $techniqueList.empty();
  //Checks all techniques in database for availability boolean.
  //If it is true, the technique is added to $techniqueList and shown on the screen.
  //Each technique is then given a click event that can pass on their index number to the useTechnique function.
  allTechniques.forEach(function (dummy, i) {
    var possibleTechnique = allTechniques[i];
    if (possibleTechnique.availability === true) {
      var $h4 = $('<h4>')
      $h4.html(allTechniques[i].name + ': ' + allTechniques[i].tpCost + ' TP');
      $h4.attr('listing', i);
      $techniqueList.append($h4);
      $h4.on('click', function() {
        var choice = $h4.attr('listing');
        useTechnique(choice);
      });
    };
  });
  //All other commands are disabled in this menu.
  $attack.unbind('click');
  $techniques.unbind('click');
  $items.unbind('click');
  //Adds a back button that returns to the normal command menu.
  $techniqueList.append($back);
  $back.on('click', playerTurn);
};

var chooseItem = function() {
  $itemList.empty();
  //Checks all items in database for used boolean.
  //If it is false, the item is added to $itemList and shown on the screen.
  //Each item is then given a click event that can pass on their index number to the useItem function.
  allItems.forEach(function (dummy, i) {
    var possibleItem = allItems[i];
    if (possibleItem.used === false) {
      var $h4 = $('<h4>')
      $h4.html(allItems[i].name);
      $h4.attr('listing', i);
      $itemList.append($h4);
      $h4.on('click', function() {
        var choice = $h4.attr('listing');
        useItem(choice);
      });
    };
  });
  //All other commands are disabled in this menu.
  $attack.unbind('click');
  $techniques.unbind('click');
  $items.unbind('click');
  //Adds a back button that returns to the normal command menu.
  $itemList.append($back);
  $back.on('click', playerTurn);
};

// ======================================================================
// ATTACK AND DAMAGE FUNCTIONS ==========================================
// ======================================================================

var playerAttack = function() {
  $text.empty();
  //Turns off other commands to limit player to one action.
  $attack.unbind('click');
  $techniques.unbind('click');
  $items.unbind('click');
  var $h3 = $('<h3>').html('You slash the ' + currentEnemy.name + ' with your sword.');
  $text.append($h3);
  $text.append($glyphicon);
  $text.on('click', function() {
    //$img is given class damaged, which has a blinking keyframe.
    //$img will then keep blinking until damageAnimation ends it on a timeout.
    $img.addClass('damaged');
    damageAnimation();
    $text.empty();
    $text.unbind('click');
    //Checks charged value to see if Power Charge has been used.
    //If the value is true, chargeModifier will multiply the damage calculation by 2.5 and charged is reset to false.
    if (charged === true) {
      chargeModifier = 2.5
      charged = false
    };
    //Stats for calculation are taken from currentCharacter and currentEnemy.
    var attack = currentCharacter.attack;
    var defense = currentEnemy.defense;
    var basicDamage = currentCharacter.basicDamage;
    //A random multiplier between 0.8 and 1.2 is added to the damage to prevent static numbers for an element of luck.
    var damageModifier = 0.8 + (Math.random() * (1.2 - 0.8));
    //Damage is an integer gotten by dividing the attack power by the opponent's defense then multiplying it by the attackers damage value times 2.
    //If Power Charge was used, chargeModifier will multiply damage by 2.5, otherwise it has a value of 1 with no effect.
    var damage = Math.floor(attack/defense * basicDamage * 2 * damageModifier * chargeModifier);
    //The calculated damage is subtracted from the opponent's currentHp.
    currentEnemy.currentHp -= damage;
    //chargeModifier is set to 1 to end Power Charge effect.
    chargeModifier = 1;
    var $h3 = $('<h3>').html(currentEnemy.name + ' took ' + damage + ' damage!');
    $text.append($h3);
    $text.append($glyphicon);
    $text.on('click', function() {
      $text.empty();
      $text.unbind('click');
      //Checks if the opponent's HP has reached zero after every turn.
      checkWin();
    })
  });
};

//Determines how long damage animation lasts, stops after 3 flickers.
var damageAnimation = function() {
  var damageDuration = window.setTimeout(endAnimation, 750);
};

//Removes damaged class from the image to stop the keyframe animation.
var endAnimation = function() {
  $img.removeClass('damaged');
};

// ======================================================================
// TECHNIQUE AND ITEM SELECTOR FUNCTIONS ================================
// ======================================================================

var useTechnique = function(i) {
  //Return command menu to normal and hide list of techniques.
  $attack.show();
  $techniques.show();
  $items.show();
  $techniqueList.empty();
  $itemList.empty();
  //Number inherited from the click event determines which technique to use.
  if (i == 0) {
    strongSlash(i);
  } else if (i == 1) {
    powerCharge(i);
  } else if (i == 2) {
    shedArmor(i);
  };
};

var useItem = function(i) {
  //Return command menu to normal and hide list of items.
  $attack.show();
  $techniques.show();
  $items.show();
  $techniqueList.empty();
  $itemList.empty();
  //Number inherited from the click event determines which item to use.
  if (i == 0) {
    maxPotion(i);
  } else if (i == 1) {
    maxPotion(i);
  };
};

// ======================================================================
// TECHNIQUE FUNCTIONS ==================================================
// ======================================================================

var strongSlash = function(i) {
  $text.empty();
  //Turns off other commands to limit player to one action.
  $attack.unbind('click');
  $techniques.unbind('click');
  $items.unbind('click');
  var currentTechnique = allTechniques[i];
  //Compares the tpCost value of the currentTechnique with the currentTp of the currentCharacter.
  //If the cost is too high the player is prompted so and returns to the command menu.
  if (currentCharacter.currentTp < currentTechnique.tpCost) {
    var $h3 = $('<h3>').html('You do not have enough TP to use this move.');
    $text.append($h3);
    $text.append($glyphicon);
    $text.on('click', function() {
      $text.empty();
      $text.unbind('click');
      playerTurn();
    });
  } else {
    //Checks charged value to see if Power Charge has been used.
    //If the value is true, chargeModifier will multiply the damage calculation by 2.5 and charged is reset to false.
    if (charged === true) {
      chargeModifier = 2.5
      charged = false
    }
    //Subtracts the tpCost from the character's currentTp and updates display.
    currentCharacter.currentTp -= currentTechnique.tpCost;
    $('#tp').html('TP: ' + currentCharacter.currentTp + '/' + currentCharacter.maxTp);
    //Stats for calculation are taken from currentCharacter and currentEnemy.
    var attack = currentCharacter.attack;
    var defense = currentEnemy.defense;
    var basicDamage = currentCharacter.basicDamage;
    //A random multiplier between 0.8 and 1.2 is added to the damage to prevent static numbers for an element of luck.
    var damageModifier = 0.8 + (Math.random() * (1.2 - 0.8));
    //Damage is an integer gotten by dividing the attack power by the opponent's defense then multiplying it by the attackers damage value times 2.
    //An additional multiplier of 1.5 is used for this technique.
    //If Power Charge was used, chargeModifier will multiply damage by 2.5, otherwise it has a value of 1 with no effect.
    var damage = Math.floor(attack/defense * basicDamage * 2 *  damageModifier * 1.5 * chargeModifier);
    var $h3 = $('<h3>').html('You unleash a powerful strike on the ' + currentEnemy.name + '!');
    $text.append($h3);
    $text.append($glyphicon);
    $text.on('click', function() {
      $text.empty();
      $text.unbind('click');
      //$img is given class damaged, which has a blinking keyframe.
      //$img will then keep blinking until damageAnimation ends it on a timeout.
      $img.addClass('damaged');
      damageAnimation();
      var $h3 = $('<h3>').html(currentEnemy.name + ' took ' + damage + ' damage!');
      $text.append($h3);
      $text.append($glyphicon);
      $text.on('click', function() {
        $text.empty();
        $text.unbind('click');
        //The calculated damage is subtracted from the opponent's currentHp.
        //chargeModifier is set to 1 to end Power Charge effect.
        currentEnemy.currentHp -= damage;
        chargeModifier = 1;
        //Checks if the opponent's HP has reached zero after every turn.
        checkWin();
      });
    });
  };
};

var powerCharge = function(i) {
  $text.empty();
  //Turns off other commands to limit player to one action.
  $attack.unbind('click');
  $techniques.unbind('click');
  $items.unbind('click');
  var currentTechnique = allTechniques[i];
  //Compares the tpCost value of the currentTechnique with the currentTp of the currentCharacter.
  //If the cost is too high the player is prompted so and returns to the command menu.
  if (currentCharacter.currentTp < currentTechnique.tpCost) {
    var $h3 = $('<h3>').html('You do not have enough TP to use this move.');
    $text.append($h3);
    $text.append($glyphicon);
    $text.on('click', function() {
      $text.empty();
      $text.unbind('click');
      playerTurn();
    });
  } else {
    //Checks the charged value. If it is true, Power Charge has already been used and player returns to command menu.
    if (charged === true) {
      var $h3 = $('<h3>').html('You have already charged.');
      $text.append($h3);
      $text.append($glyphicon);
      $text.on('click', function() {
        $text.empty();
        $text.unbind('click');
        playerTurn();
      });
    } else if (charged === false) {
      charged = true;
      //Subtracts the tpCost from the character's currentTp and updates display.
      currentCharacter.currentTp -= currentTechnique.tpCost;
      $('#tp').html('TP: ' + currentCharacter.currentTp + '/' + currentCharacter.maxTp);
      var $h3 = $('<h3>').html('You are charging up for a powerful attack!');
      $text.append($h3);
      $text.append($glyphicon);
      $text.on('click', function() {
        $text.empty();
        $text.unbind('click');
        //Runs checkArmor to see if player can act again.
        checkArmor();
      });
    };
  };
};

var shedArmor = function(i) {
  $text.empty();
  //Turns off other commands to limit player to one action.
  $attack.unbind('click');
  $techniques.unbind('click');
  $items.unbind('click');
  var currentTechnique = allTechniques[i];
  //Compares the tpCost value of the currentTechnique with the currentTp of the currentCharacter.
  //If the cost is too high the player is prompted so and returns to the command menu.
  if (currentCharacter.currentTp < currentTechnique.tpCost) {
    var $h3 = $('<h3>').html('You do not have enough TP to use this move.');
    $text.append($h3);
    $text.append($glyphicon);
    $text.on('click', function() {
      $text.empty();
      $text.unbind('click');
      playerTurn();
    });
  } else {
    //Checks the armored value. If it is false, Shed Armor has already been used and player returns to command menu.
    if (armored === false) {
      var $h3 = $('<h3>').html('You have already discarded your armor.');
      $text.append($h3);
      $text.append($glyphicon);
      $text.on('click', function() {
        $text.empty();
        $text.unbind('click');
        playerTurn();
      });
    } else if (armored === true) {
      //Subtracts the tpCost from the character's currentTp and updates display.
      currentCharacter.currentTp -= currentTechnique.tpCost;
      $('#tp').html('TP: ' + currentCharacter.currentTp + '/' + currentCharacter.maxTp);
      armored = false;
      var $h3 = $('<h3>').html('You have discarded your armor to increase your speed.');
      $text.append($h3);
      $text.append($glyphicon);
      $text.on('click', function() {
        $text.empty();
        $text.unbind('click');
        //currentDefense is cut in half and it immediately becomes the enemy's turn.
        currentCharacter.currentDefense /= 2;
        enemyAttack();
      });
    };
  };
};

var checkArmor = function() {
  if (armored === false) {
    //If Shed Armor has changed armored value, number of actions is increased by 1 every time this is run.
    currentCharacter.actions += 1;
    //Checks if the number is even. Since actions starts at 1, this means the player takes two turns then the number is odd, which ends the turn.
    if (currentCharacter.actions % 2 === 0) {
      var $h3 = $('<h3>').html('Attack again!');
      $text.append($h3);
      $text.append($glyphicon);
      $text.on('click', function() {
        $text.empty();
        $text.unbind('click');
        playerTurn();
      });
    } else {
      enemyAttack();
    };
  } else {
    //If armored is true, it becomes the opponent's turn.
    enemyAttack();
  };
};

// ======================================================================
// ITEM FUNCTIONS =======================================================
// ======================================================================

var healthPotion = function() {
  $text.empty();
  //Turns off other commands to limit player to one action.
  $attack.unbind('click');
  $techniques.unbind('click');
  $items.unbind('click');
  var currentItem = allItems[i];
  //Used is set to true so that it is removed from $itemList and only used once.
  currentItem.used = true;
  //Increases currentHp by half of the maxHp.
  currentCharacter.currentHp += currentCharacter.maxHp / 2;
  //If the result is greater then the maxHp, currentHp is instead lowered to maxHp.
  if (currentCharacter.currentHp > currentCharacter.maxHp) {
    currentCharacter.currentHp = currentCharacter.maxHp;
  };
  var $h3 = $('<h3>').html('Regained ' + currentCharacter.maxHp / 2 + ' HP');
  $text.append($h3);
  $text.append($glyphicon);
  //Updates the character's currentHp display.
  $text.on('click', function() {
    $text.empty();
    $text.unbind('click');
    $('#hp').html('HP: ' + currentCharacter.currentHp + '/' + currentCharacter.maxHp);
    //Runs checkArmor to see if player can act again.
    checkArmor();
  });
};

var staminaPotion = function() {
  $text.empty();
  //Turns off other commands to limit player to one action.
  $attack.unbind('click');
  $techniques.unbind('click');
  $items.unbind('click');
  var currentItem = allItems[i];
  //used is set to true so that it is removed from $itemList and only used once.
  currentItem.used = true;
  //Increases currentTp by half of the maxTp.
  currentCharacter.currentTp += currentCharacter.maxTp / 2;
  //If the result is greater then the maxTp, currentTp is instead lowered to maxTp.
  if (currentCharacter.currentTp > currentCharacter.maxTp) {
    currentCharacter.currentTp = currentCharacter.maxTp;
  };
  var $h3 = $('<h3>').html('Regained ' + currentCharacter.maxTp / 2 + ' TP');
  $text.append($h3);
  $text.append($glyphicon);
  //Updates the character's currentTp display.
  $text.on('click', function() {
    $text.empty();
    $text.unbind('click');
    $('#tp').html('TP: ' + currentCharacter.currentTp + '/' + currentCharacter.maxTp);
    //Runs checkArmor to see if player can act again.
    checkArmor();
  });
};

var maxPotion = function(i) {
  $text.empty();
  //Turns off other commands to limit player to one action.
  $attack.unbind('click');
  $techniques.unbind('click');
  $items.unbind('click');
  var currentItem = allItems[i];
  //used is set to true so that it is removed from $itemList and only used once.
  currentItem.used = true;
  //Sets currentHp and currentTp equal to maxHp and maxTp respectively.
  currentCharacter.currentHp = currentCharacter.maxHp;
  currentCharacter.currentTp = currentCharacter.maxTp;
  var $h3 = $('<h3>').html('HP and TP fully restored');
  $text.append($h3);
  $text.append($glyphicon);
  //Updates the character's currentHp display.
  //Updates the character's currentTp display.
  $text.on('click', function() {
    $text.empty();
    $text.unbind('click');
    $('#hp').html('HP: ' + currentCharacter.currentHp + '/' + currentCharacter.maxHp);
    $('#tp').html('TP: ' + currentCharacter.currentTp + '/' + currentCharacter.maxTp);
    //Runs checkArmor to see if player can act again.
    checkArmor();
  });
};

// ======================================================================
// PLAYER WIN AND LEVEL UP FUNCTIONS ====================================
// ======================================================================

var checkWin = function() {
  //Checks if enemy hp is 0 or lower.
  //If so image fades out.
  if (currentEnemy.currentHp <= 0) {
    $img.fadeOut('slow');
    var $h3 = $('<h3>').html('You defeated the ' + currentEnemy.name + "!");
    $text.append($h3);
    $text.append($glyphicon);
    $text.on('click', function() {
      $text.empty();
      $text.unbind('click');
      //Checks enemyNumber to see how many enemies have been defeated.
      //If they are equal, all enemies have been beaten and winGame is run, otherwise player goes to gainExperience.
      if (enemyNumber === enemyList.length) {
        winGame();
      } else {
        gainExperience();
      };
    });
  } else {
    //If enemy hp is greater than 0, runs checkArmor to see if player can act again.
    checkArmor();
  };
};

var gainExperience = function() {
  //Resets armored value and actions to end Shed Armor effects.
  armored = true;
  currentCharacter.actions = 1;
  var $h3 = $('<h3>').html(currentCharacter.name + ' gained ' + currentEnemy.expYield + ' exp.');
  $text.append($h3);
  $text.append($glyphicon);
  $text.on('click', function() {
    $text.empty();
    $text.unbind('click');
    //currentCharacter's exp value is increased by enemy expYield.
    //If exp is above a certain threshold, runs the appropriate level up function.
    currentCharacter.exp += currentEnemy.expYield;
    if (currentCharacter.exp >= 400) {
      levelFive();
    } else if (currentCharacter.exp >= 200) {
      levelFour();
    } else if (currentCharacter.exp >= 100) {
      levelThree();
    } else if (currentCharacter.exp >= 50) {
      levelTwo();
    } else {
      //If no level up, currentDefense is set to defense to undo Shed Armor and get route is run on next enemy.
      currentCharacter.currentDefense = currentCharacter.defense;
      $.get('/enemies/', renderEnemy, 'json');
    };
  });
};

var levelTwo = function() {
  var $h3 = $('<h3>').html(currentCharacter.name + ' has reached Level 2!');
  $text.append($h3);
  $text.append($glyphicon);
  $text.on('click', function() {
    $text.empty();
    $text.unbind('click');
    //On even levels, attack and defense stats are increased.
    //CurrentDefense is set to defense to undo Shed Armor.
    currentCharacter.attack = 225;
    var $h3 = $('<h3>').html(currentCharacter.name + "'s attack has increased to " + currentCharacter.attack + ".");
    $text.append($h3);
    $text.append($glyphicon);
    $text.on('click', function() {
      $text.empty();
      $text.unbind('click');
      currentCharacter.defense = 175;
      currentCharacter.currentDefense = currentCharacter.defense;
      var $h3 = $('<h3>').html(currentCharacter.name + "'s defense has increased to " + currentCharacter.defense + ".");
      $text.append($h3);
      $text.append($glyphicon);
      $text.on('click', function() {
        $text.empty();
        $text.unbind('click');
        //Get route is run on next enemy to start a new battle.
        $.get('/enemies/', renderEnemy, 'json');
      });
    });
  });
};

var levelThree = function() {
  var $h3 = $('<h3>').html(currentCharacter.name + ' has reached Level 3!');
  $text.append($h3);
  $text.append($glyphicon);
  $text.on('click', function() {
    $text.empty();
    $text.unbind('click');
    //CurrentDefense is set to defense to undo Shed Armor.
    currentCharacter.currentDefense = currentCharacter.defense;
    //On odd levels, the next technique has it's availability changed to true.
    allTechniques[1].availability = true;
    var $h3 = $('<h3>').html(currentCharacter.name + ' has learned ' + allTechniques[1].name + '!');
    $text.append($h3);
    $text.append($glyphicon);
    $text.on('click', function() {
      $text.empty();
      $text.unbind('click');
      //Get route is run on next enemy to start a new battle.
      $.get('/enemies/', renderEnemy, 'json');
    });
  });
};

var levelFour = function() {
  var $h3 = $('<h3>').html(currentCharacter.name + ' has reached Level 4!');
  $text.append($h3);
  $text.append($glyphicon);
  $text.on('click', function() {
    $text.empty();
    $text.unbind('click');
    //On even levels, attack and defense stats are increased.
    //CurrentDefense is set to defense to undo Shed Armor.
    currentCharacter.attack = 275;
    var $h3 = $('<h3>').html(currentCharacter.name + "'s attack has increased to " + currentCharacter.attack + ".");
    $text.append($h3);
    $text.append($glyphicon);
    $text.on('click', function() {
      $text.empty();
      $text.unbind('click');
      currentCharacter.defense = 225;
      currentCharacter.currentDefense = currentCharacter.defense;
      var $h3 = $('<h3>').html(currentCharacter.name + "'s defense has increased to " + currentCharacter.defense + ".");
      $text.append($h3);
      $text.append($glyphicon);
      $text.on('click', function() {
        $text.empty();
        $text.unbind('click');
        //Get route is run on next enemy to start a new battle.
        $.get('/enemies/', renderEnemy, 'json');
      });
    });
  });
};

var levelFive = function() {
  var $h3 = $('<h3>').html(currentCharacter.name + ' has reached Level 5!');
  $text.append($h3);
  $text.append($glyphicon);
  $text.on('click', function() {
    $text.empty();
    $text.unbind('click');
    //CurrentDefense is set to defense to undo Shed Armor.
    currentCharacter.currentDefense = currentCharacter.defense;
    //On odd levels, the next technique has it's availability changed to true.
    allTechniques[2].availability = true;
    var $h3 = $('<h3>').html(currentCharacter.name + ' has learned ' + allTechniques[2].name + '!');
    $text.append($h3);
    $text.append($glyphicon);
    $text.on('click', function() {
      $text.empty();
      $text.unbind('click');
      //Get route is run on next enemy to start a new battle.
      $.get('/enemies/', renderEnemy, 'json');
    });
  });
};

var winGame = function() {
  //When game is won, ending text is displayed.
  var $h3 = $('<h3>').html('Congratulations! You have successfully completed your quest!');
  $text.append($h3);
  $text.append($glyphicon);
  $text.on('click', function() {
    $text.empty();
    $text.unbind('click');
    var $h3 = $('<h3>').html('I have no idea why you were suddenly fighting the Devil but good job!');
    $text.append($h3);
    $text.append($glyphicon);
    $text.on('click', function() {
      $text.empty();
      $text.unbind('click');
      var $h3 = $('<h3>').html("Peace has been restored to the land, I guess. Sure let's go with that.");
      $text.append($h3);
      $text.append($glyphicon);
      //$restart click event appears to let the player start the game again.
      $text.on('click', function() {
        $text.empty();
        $text.unbind('click');
        var $restart = $('<h2>').attr('id', 'restart');
        $restart.html('Click here to play again.');
        $text.append($restart);
        $restart.on('click', restartGame);
      });
    });
  });
};

// ======================================================================
// ENEMY FUNCTIONS ======================================================
// ======================================================================

var enemyAttack = function() {
  //Stats for calculation are taken from currentCharacter and currentEnemy.
  var attack = currentEnemy.attack;
  var defense = currentCharacter.defense;
  var basicDamage = currentEnemy.basicDamage;
  //A random multiplier between 0.8 and 1.2 is added to the damage to prevent static numbers for an element of luck.
  var damageModifier = 0.8 + (Math.random() * (1.2 - 0.8));
  //Damage is an integer gotten by dividing the attack power by the opponent's defense then multiplying it by the attackers damage value times 2.
  var damage = Math.floor(attack/defense * basicDamage * 2 * damageModifier);
  var $h3 = $('<h3>').html(currentEnemy.name + ' attacks! You took ' + damage + ' damage!');
  $text.append($h3);
  $text.append($glyphicon);
  $text.on('click', function() {
    $text.empty();
    $text.unbind('click');
    //The calculated damage is subtracted from the opponent's currentHp.
    currentCharacter.currentHp -= damage;
    $('#hp').html('HP: ' + currentCharacter.currentHp + '/' + currentCharacter.maxHp);
    //Checks if the opponent's HP has reached zero after every turn.
    checkLoss();
  });
};

var checkLoss = function() {
  //Checks if player hp is 0 or lower.
  //If so, currentHp is set to 0 for display.
  if (currentCharacter.currentHp <= 0) {
    if (currentCharacter.currentHp < 0) {
      currentCharacter.currentHp = 0;
      $('#hp').html('HP: ' + currentCharacter.currentHp + '/' + currentCharacter.maxHp);
    };
    //Player is told they lost and $restart click event appears to let the player start the game again.
    var $h3 = $('<h3>').html('You are dead!');
    $text.append($h3);
    $text.append($glyphicon);
    $text.on('click', function() {
      $text.empty();
      $text.unbind('click');
      var $restart = $('<h2>').attr('id', 'restart');
      $restart.html('Click here to play again.');
      $text.append($restart);
      $restart.on('click', restartGame);
    })
  } else {
    //If currentCharacter's hp is above 0, it becomes the player's turn.
    playerTurn();
  };
};

// ======================================================================
// RESET GAME FUNCTION ==================================================
// ======================================================================

var restartGame = function() {
  //All divs and values are set to default and renderCharacter is run again.
  $text.empty();
  enemyNumber = 0;
  $attack.hide();
  $techniques.hide();
  $items.hide();
  $('.Character-Select').show();
  $enemy.empty();
  $.get('/characters/', renderCharacter, 'json');
}

// ======================================================================
// GLOBAL VARIABLES =====================================================
// ======================================================================

//Main character and enemy variables.
var enemyNumber = 0;
var currentCharacter;
var currentEnemy;

//Main technique and item variables.
var allTechniques;
var selectedTechnique;
var allItems;

//Jquery variables.
var $characters = $('.characters');
var $enemy = $('.enemy');
var $damaged = $('.damaged');
var $text = $('.text');
var $attack = $('.attack');
var $techniques = $('.techniques');
var $items = $('.items');
var $techniqueList = $('.techniques-list');
var $itemList = $('.items-list');
var $back = $('<div>').append($('<h4>').html('Back'));
var $glyphicon = $('<span>').addClass('glyphicon glyphicon-chevron-down');
var $img;

//Technique effected variables.
var charged = false;
var chargeModifier = 1;
var armored = true;
