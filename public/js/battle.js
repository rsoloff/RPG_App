$(document).ready(function() {
  $.get('/characters/', renderCharacter, 'json');
});

var renderCharacter = function(data) {
  $('body').css('backgroundImage', "url(http://3.bp.blogspot.com/-QTB_xjfnAzo/UQBy1pG9wKI/AAAAAAAAASI/__hGyjbozgU/s1600/scroll+w+grid.bmp)");
  $('.Character-Select').show();
  $('.container').hide()
  $attack.hide();
  $techniques.hide();
  $items.hide();
  var characterList = data.characters;
  for (var i = 0; i < characterList.length; i++) {
    var $h2 = $('<h2 id="name">');
    $h2.css("font-family", "Orbitron");
    $h2.html(characterList[i].name);
    var $img = $('<img id="character">')
    $img.attr('src', characterList[i].image);
    var $character = $('<div>')
    $character.append($h2);
    $character.append($img);
    $characters.append($character);
    var selected = characterList[i];
    $character.on('click', function() {
      $('.container').show();
      currentCharacter = selected;
      var $h2 = $('<h2>');
      $h2.html(currentCharacter.name);
      $('.chosen-name').append($h2);
      var $h2 = $('<h2>').attr('id', 'hp');
      $h2.html('HP: ' + currentCharacter.currentHp + '/' + currentCharacter.maxHp);
      $('.hp').append($h2);
      var $h2 = $('<h2>').attr('id', 'tp')
      $h2.html('TP: ' + currentCharacter.currentTp + '/' + currentCharacter.maxTp);
      $('.tp').append($h2);
      $('.Character-Select').hide();
      $characters.empty();
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

var renderEnemy = function(data) {
  $enemy.empty();
  $attack.hide();
  $techniques.hide();
  $items.hide();
  enemyList = data.enemies;
  if (enemyNumber === enemyList.length) {
    winGame();
  } else {
    currentEnemy = enemyList[enemyNumber];
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

var setTechniques = function(data) {
  allTechniques = data.techniques;
  $.get('/items', setItems, 'json');
};

var setItems = function(data) {
  allItems = data.items;
  $.get('/enemies', renderEnemy, 'json');
};

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

var techniqueMenu = function() {
  $.get('/techniques', chooseTechnique, 'json');
};

var itemMenu = function() {
  $.get('/items', chooseItem, 'json');
};

var chooseTechnique = function() {
  $techniqueList.empty();
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
  $attack.unbind('click');
  $techniques.unbind('click');
  $items.unbind('click');
  $techniqueList.append($back);
  $back.on('click', playerTurn);
};

var chooseItem = function() {
  $itemList.empty();
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
  $attack.unbind('click');
  $techniques.unbind('click');
  $items.unbind('click');
  $itemList.append($back);
  $back.on('click', playerTurn);
};

var damageAnimation = function() {
  var damageDuration = window.setTimeout(endAnimation, 750);
}

var endAnimation = function() {
  $img.removeClass('damaged');
}

var playerAttack = function() {
  $text.empty();
  $attack.unbind('click');
  $techniques.unbind('click');
  $items.unbind('click');
  var $h3 = $('<h3>').html('You slash the ' + currentEnemy.name + ' with your sword.');
  $text.append($h3);
  $text.append($glyphicon);
  $text.on('click', function() {
    $img.addClass('damaged');
    damageAnimation();
    $text.empty();
    $text.unbind('click');
    if (charged === true) {
      chargeModifier = 2.5
      charged = false
    };
    var attack = currentCharacter.attack;
    var defense = currentEnemy.defense;
    var basicDamage = currentCharacter.basicDamage;
    var damageModifier = 0.8 + (Math.random() * (1.2 - 0.8));
    var damage = Math.floor(attack/defense * basicDamage * 2 * damageModifier * chargeModifier);
    currentEnemy.currentHp -= damage;
    chargeModifier = 1;
    var $h3 = $('<h3>').html(currentEnemy.name + ' took ' + damage + ' damage!');
    $text.append($h3);
    $text.append($glyphicon);
    $text.on('click', function() {
      $text.empty();
      $text.unbind('click');
      checkWin();
    })
  });
}

var useTechnique = function(i) {
  $attack.show();
  $techniques.show();
  $items.show();
  $techniqueList.empty();
  $itemList.empty();
  if (i == 0) {
    strongSlash(i);
  } else if (i == 1) {
    powerCharge(i);
  } else if (i == 2) {
    shedArmor(i);
  };
};

var useItem = function(i) {
  $attack.show();
  $techniques.show();
  $items.show();
  $techniqueList.empty();
  $itemList.empty();
  if (i == 0) {
    maxPotion(i);
  } else if (i == 1) {
    maxPotion(i);
  };
};

var strongSlash = function(i) {
  $attack.unbind('click');
  $techniques.unbind('click');
  $items.unbind('click');
  var currentTechnique = allTechniques[i];
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
    if (charged === true) {
      chargeModifier = 2.5
      charged = false
    }
    currentCharacter.currentTp -= currentTechnique.tpCost;
    $('#tp').html('TP: ' + currentCharacter.currentTp + '/' + currentCharacter.maxTp);
    var attack = currentCharacter.attack;
    var defense = currentEnemy.defense;
    var basicDamage = currentCharacter.basicDamage;
    var damageModifier = 0.8 + (Math.random() * (1.2 - 0.8));
    var damage = Math.floor(attack/defense * basicDamage * 2 *  damageModifier * 1.5 * chargeModifier);
    var $h3 = $('<h3>').html('You unleash a powerful strike on the ' + currentEnemy.name + '!');
    $text.append($h3);
    $text.append($glyphicon);
    $text.on('click', function() {
      $text.empty();
      $text.unbind('click');
      $img.addClass('damaged');
      damageAnimation();
      var $h3 = $('<h3>').html(currentEnemy.name + ' took ' + damage + ' damage!');
      $text.append($h3);
      $text.append($glyphicon);
      $text.on('click', function() {
        $text.empty();
        $text.unbind('click');
        currentEnemy.currentHp -= damage;
        chargeModifier = 1;
        checkWin();
      });
    });
  };
};

var powerCharge = function(i) {
  $attack.unbind('click');
  $techniques.unbind('click');
  $items.unbind('click');
  var currentTechnique = allTechniques[i];
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
      currentCharacter.currentTp -= currentTechnique.tpCost;
      $('#tp').html('TP: ' + currentCharacter.currentTp + '/' + currentCharacter.maxTp);
      var $h3 = $('<h3>').html('You are charging up for a powerful attack!');
      $text.append($h3);
      $text.append($glyphicon);
      $text.on('click', function() {
        $text.empty();
        $text.unbind('click');
        checkArmor();
      });
    };
  };
};

var shedArmor = function(i) {
  $attack.unbind('click');
  $techniques.unbind('click');
  $items.unbind('click');
  var currentTechnique = allTechniques[i];
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
      currentCharacter.currentTp -= currentTechnique.tpCost;
      $('#tp').html('TP: ' + currentCharacter.currentTp + '/' + currentCharacter.maxTp);
      armored = false;
      var $h3 = $('<h3>').html('You have discarded your armor to increase your speed.');
      $text.append($h3);
      $text.append($glyphicon);
      $text.on('click', function() {
        $text.empty();
        $text.unbind('click');
        currentCharacter.currentDefense /= 2;
        enemyAttack();
      });
    };
  };
};

var checkArmor = function() {
  if (armored === false) {
    currentCharacter.actions += 1;
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
    enemyAttack();
  };
};

var healthPotion = function() {
  $attack.unbind('click');
  $techniques.unbind('click');
  $items.unbind('click');
  var currentItem = allItems[i];
  currentItem.used = true;
  currentCharacter.currentHp += currentCharacter.maxHp / 2;
  if (currentCharacter.currentHp > currentCharacter.maxHp) {
    currentCharacter.currentHp = currentCharacter.maxHp;
  };
  var $h3 = $('<h3>').html('Regained ' + currentCharacter.maxHp / 2 + ' HP');
  $text.append($h3);
  $text.append($glyphicon);
  $text.on('click', function() {
    $text.empty();
    $text.unbind('click');
    $('#hp').html('HP: ' + currentCharacter.currentHp + '/' + currentCharacter.maxHp);
    checkArmor();
  });
};

var staminaPotion = function() {
  $attack.unbind('click');
  $techniques.unbind('click');
  $items.unbind('click');
  var currentItem = allItems[i];
  currentItem.used = true;
  currentCharacter.currentTp += currentCharacter.maxTp / 2;
  if (currentCharacter.currentTp > currentCharacter.maxTp) {
    currentCharacter.currentTp = currentCharacter.maxTp;
  };
  var $h3 = $('<h3>').html('Regained ' + currentCharacter.maxTp / 2 + ' TP');
  $text.append($h3);
  $text.append($glyphicon);
  $text.on('click', function() {
    $text.empty();
    $text.unbind('click');
    $('#tp').html('TP: ' + currentCharacter.currentTp + '/' + currentCharacter.maxTp);
    checkArmor();
  });
};

var maxPotion = function(i) {
  $attack.unbind('click');
  $techniques.unbind('click');
  $items.unbind('click');
  var currentItem = allItems[i];
  currentItem.used = true;
  currentCharacter.currentHp = currentCharacter.maxHp;
  currentCharacter.currentTp = currentCharacter.maxTp;
  var $h3 = $('<h3>').html('HP and TP fully restored');
  $text.append($h3);
  $text.append($glyphicon);
  $text.on('click', function() {
    $text.empty();
    $text.unbind('click');
    $('#hp').html('HP: ' + currentCharacter.currentHp + '/' + currentCharacter.maxHp);
    $('#tp').html('TP: ' + currentCharacter.currentTp + '/' + currentCharacter.maxTp);
    checkArmor();
  });
};

var checkWin = function() {
  if (currentEnemy.currentHp <= 0) {
    $img.fadeOut('slow');
    var $h3 = $('<h3>').html('You defeated the ' + currentEnemy.name + "!");
    $text.append($h3);
    $text.append($glyphicon);
    $text.on('click', function() {
      $text.empty();
      $text.unbind('click');
      if (enemyNumber === enemyList.length) {
        winGame();
      } else {
        gainExperience();
      };
    });
  } else {
    checkArmor();
  };
};

var gainExperience = function() {
  armored = true;
  currentCharacter.actions = 1;
  var $h3 = $('<h3>').html(currentCharacter.name + ' gained ' + currentEnemy.expYield + ' exp.');
  $text.append($h3);
  $text.append($glyphicon);
  $text.on('click', function() {
    $text.empty();
    $text.unbind('click');
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
    currentCharacter.currentDefense = currentCharacter.defense;
    allTechniques[1].availability = true;
    var $h3 = $('<h3>').html(currentCharacter.name + ' has learned ' + allTechniques[1].name + '!');
    $text.append($h3);
    $text.append($glyphicon);
    $text.on('click', function() {
      $text.empty();
      $text.unbind('click');
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
    currentCharacter.currentDefense = currentCharacter.defense;
    allTechniques[2].availability = true;
    var $h3 = $('<h3>').html(currentCharacter.name + ' has learned ' + allTechniques[2].name + '!');
    $text.append($h3);
    $text.append($glyphicon);
    $text.on('click', function() {
      $text.empty();
      $text.unbind('click');
      $.get('/enemies/', renderEnemy, 'json');
    });
  });
};

var winGame = function() {
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

var enemyAttack = function() {
  var attack = currentEnemy.attack;
  var defense = currentCharacter.defense;
  var basicDamage = currentEnemy.basicDamage;
  var damageModifier = 0.8 + (Math.random() * (1.2 - 0.8));
  var damage = Math.floor(attack/defense * basicDamage * 2 * damageModifier);
  var $h3 = $('<h3>').html(currentEnemy.name + ' attacks! You took ' + damage + ' damage!');
  $text.append($h3);
  $text.append($glyphicon);
  $text.on('click', function() {
    $text.empty();
    $text.unbind('click');
    currentCharacter.currentHp -= damage;
    $('#hp').html('HP: ' + currentCharacter.currentHp + '/' + currentCharacter.maxHp);
    checkLoss();
  });
};

var checkLoss = function() {
  if (currentCharacter.currentHp <= 0) {
    if (currentCharacter.currentHp < 0) {
      currentCharacter.currentHp = 0;
      $('#hp').html('HP: ' + currentCharacter.currentHp + '/' + currentCharacter.maxHp);
    };
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
    playerTurn();
  };
};

var restartGame = function() {
  $text.empty();
  enemyNumber = 0;
  $attack.hide();
  $techniques.hide();
  $items.hide();
  $('.Character-Select').show();
  $enemy.empty();
  $.get('/characters/', renderCharacter, 'json');
}

var enemyNumber = 0;
var currentCharacter;
var currentEnemy;
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
var allTechniques;
var selectedTechnique;
var allItems;
var charged = false;
var chargeModifier = 1;
var armored = true;
