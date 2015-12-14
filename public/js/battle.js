$(document).ready(function() {
  $.get('/characters/', renderCharacter, 'json');
  $attack.hide();
  $techniques.hide();
  $items.hide();
  $attack.on('click', playerAttack);
  $techniques.on('click', chooseTechnique);
  $items.on('click', chooseItem);
})

var renderCharacter = function(data) {
  var characterList = data.characters;
  for (var i = 0; i < characterList.length; i++) {
    var $h2 = $('<h2>');
    $h2.html(characterList[i].name);
    $characters.append($h2);
    var selected = characterList[i];
    $h2.on('click', function() {
      currentCharacter = selected;
      var $h2 = $('<h2>');
      $h2.html(currentCharacter.name);
      $('.chosen-character').append($h2);
      var $h2 = $('<h2>').attr('id', 'hp');
      $h2.html('HP: ' + currentCharacter.currentHp + '/' + currentCharacter.maxHp);
      $('.chosen-character').append($h2);
      var $h2 = $('<h2>').attr('id', 'tp')
      $h2.html('TP: ' + currentCharacter.currentTp + '/' + currentCharacter.maxTp);
      $('.chosen-character').append($h2);
      $('.Character-Select').html('');
      $characters.empty();
      $.get('/enemies/', renderEnemy, 'json');
    });
  }
};

var renderEnemy = function(data) {
  $enemy.empty();
  var enemyList = data.enemies;
  var $h2 = $('<h2>');
  currentEnemy = enemyList[enemyNumber];
  $h2.html(enemyList[enemyNumber].name);
  $enemy.append($h2);
  enemyNumber += 1;
  $.get('/techniques', setTechniques, 'json');
};

var setTechniques = function(data) {
  allTechniques = data.techniques;
  $.get('/items', setItems, 'json');
};

var setItems = function(data) {
  allItems = data.items;
  playerTurn();
}

var playerTurn = function() {
  $attack.show();
  $techniques.show();
  $items.show();
  $techniqueList.empty();
  $itemList.empty();
};

var damageEnemy = function() {

};

var techniqueMenu = function() {
  $.get('/techniques', chooseTechnique, 'json');
};

var itemMenu = function() {
  $.get('/items', chooseItem, 'json');
};

var chooseTechnique = function() {
  $techniqueList.empty();
  for (var i = 0; i < allTechniques.length; i++) {
    var possibleTechnique = allTechniques[i];
    if (possibleTechnique.availability === true) {
      var $h3 = $('<h3>')
      $h3.html(allTechniques[i].name);
      $techniqueList.append($h3);
      $h3.on('click', function() {
        useTechnique(i);
      })
    };
  };
  $attack.hide();
  $techniques.hide();
  $items.hide();
  $techniqueList.append($back);
  $back.on('click', playerTurn);
};

var chooseItem = function() {
  $itemList.empty();
  for (var i = 0; i < allItems.length; i++) {
    var $h3 = $('<h3>');
    $h3.html(allItems[i].name);
    $itemList.append($h3);
  };
  $attack.hide();
  $techniques.hide();
  $items.hide();
  $itemList.append($back);
  $back.on('click', playerTurn);
};

var playerAttack = function() {
  if (charged === true) {
    chargeModifier = 2.5
    charged = false
  }
  var attack = currentCharacter.attack;
  var defense = currentEnemy.defense;
  var basicDamage = currentCharacter.basicDamage;
  var damageModifier = 0.8 + (Math.random() * (1.2 - 0.8));
  var damage = Math.floor(attack/defense * basicDamage * 2 * damageModifier * chargeModifier);
  console.log(currentEnemy.name + ' took ' + damage + ' damage');
  currentEnemy.currentHp -= damage;
  //console.log(currentEnemy.currentHp);
  chargeModifier = 1;
  checkWin();
}

var useTechnique = function(i) {
  if (i = 1) {
    strongSlash(i);
  } else if (i = 2) {
    powerCharge(i);
  } else if (i = 3) {
    shedArmor(i);
  };
};

var strongSlash = function(i) {
  var currentTechnique = allTechniques[i];
  if (currentCharacter.currentTp < currentTechnique.tpCost) {
    console.log('You do not have enough TP to use this move');
    playerTurn();
  } else {
    if (charged === true) {
      chargeModifier = 2.5
      charged = false
    }
    currentCharacter.currentTp -= currentTechnique.tpCost;
    $('#tp').html(currentCharacter.currentTp + '/' + currentCharacter.maxTp);
    console.log(currentCharacter.currentTp);
    var attack = currentCharacter.attack;
    var defense = currentEnemy.defense;
    var basicDamage = currentCharacter.basicDamage;
    var damageModifier = 0.8 + (Math.random() * (1.2 - 0.8));
    var damage = Math.floor(attack/defense * basicDamage * 2 *  damageModifier * 1.5 * chargeModifier);
    console.log(currentEnemy.name + ' took ' + damage + ' damage');
    currentEnemy.currentHp -= damage;
    //console.log(currentEnemy.currentHp);
    chargeModifier = 1;
    checkWin();
  };
};

var powerCharge = function(i) {
  var currentTechnique = allTechniques[i];
  if (currentCharacter.currentTp < currentTechnique.tpCost) {
    console.log('You do not have enough TP to use this move');
    playerTurn();
  } else {
    if (charged === true) {
      console.log('You have already charged');
      playerTurn();
    } else if (charged === false) {
      charged = true;
      currentCharacter.currentTp -= currentTechnique.tpCost;
      $('#tp').html(currentCharacter.currentTp + '/' + currentCharacter.maxTp);
      console.log('You are charging up for a powerful attack');
      checkArmor();
    };
  };
};

var shedArmor = function(i) {
  var currentTechnique = allTechniques[i];
  if (currentCharacter.currentTp < currentTechnique.tpCost) {
    console.log('You do not have enough TP to use this move');
    playerTurn();
  } else {
    if (armored === false) {
      console.log('You have already discarded your armor');
      playerTurn();
    } else if (armored === true) {
      currentCharacter.currentTp -= currentTechnique.tpCost;
      $('#tp').html(currentCharacter.currentTp + '/' + currentCharacter.maxTp);
      armored = false;
      console.log('You have discarded your armor');
      currentCharacter.currentDefense /= 2;
      enemyAttack();
    };
  };
};

var checkArmor = function() {
  if (armored === false) {
    currentCharacter.actions += 1;
    if (currentCharacter.actions % 2 === 0) {
      playerTurn();
    } else {
      enemyAttack();
    };
  } else {
    enemyAttack();
  };
};

var healthPotion = function() {
  currentCharacter.currentHp += currentCharacter.maxHp / 2;
  if (currentCharacter.currentHp > currentCharacter.maxHp) {
    currentCharacter.currentHp = currentCharacter.maxHp;
  };
  console.log('Regained ' + currentCharacter.maxHp / 2 + ' HP');
  $('#hp').html(currentCharacter.currentHp + '/' + currentCharacter.maxHp);
  enemyAttack();
};

var staminaPotion = function() {
  currentCharacter.currentTp += currentCharacter.maxTp / 2;
  if (currentCharacter.currentTp > currentCharacter.maxTp) {
    currentCharacter.currentTp = currentCharacter.maxTp;
  };
  console.log('Regained ' + currentCharacter.maxTp / 2 + ' TP');
  $('#tp').html(currentCharacter.currentTp + '/' + currentCharacter.maxTp);
  enemyAttack();
};

var maxPotion = function() {
  currentCharacter.currentHp = currentCharacter.maxHp;
  currentCharacter.currentTp = currentCharacter.maxTp;
  console.log('HP and TP fully restored');
  $('#hp').html(currentCharacter.currentHp + '/' + currentCharacter.maxHp);
  $('#tp').html(currentCharacter.currentTp + '/' + currentCharacter.maxTp);
  enemyAttack();
};

var checkWin = function() {
  if (currentEnemy.currentHp <= 0) {
    $enemy.empty();
    gainExperience();
  } else {
    checkArmor();
  };
};

var gainExperience = function() {
  armored = true;
  currentCharacter.actions = 1;
  console.log(currentCharacter.name + ' gained ' + currentEnemy.expYield + ' experience');
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
};

var levelTwo = function() {
  console.log(currentCharacter.name + ' has reached Level 2!');
  currentCharacter.attack = 20;
  currentCharacter.defense = 15;
  currentCharacter.currentDefense = currentCharacter.defense;
  $.get('/enemies/', renderEnemy, 'json');
};

var levelThree = function() {
  console.log(currentCharacter.name + ' has reached Level 3!');
  currentCharacter.currentDefense = currentCharacter.defense;
  allTechniques[1].availability = true;
  $.get('/enemies/', renderEnemy, 'json');
};

var levelFour = function() {
  console.log(currentCharacter.name + ' has reached Level 4!');
  currentCharacter.attack = 25;
  currentCharacter.defense = 20;
  currentCharacter.currentDefense = currentCharacter.defense;
  $.get('/enemies/', renderEnemy, 'json');
};

var levelFive = function() {
  console.log(currentCharacter.name + ' has reached Level 5!');
  currentCharacter.currentDefense = currentCharacter.defense;
  allTechniques[2].availability = true;
  $.get('/enemies/', renderEnemy, 'json');
};

var enemyAttack = function() {
  var attack = currentEnemy.attack;
  var defense = currentCharacter.defense;
  var basicDamage = currentEnemy.basicDamage;
  var damageModifier = 0.8 + (Math.random() * (1.2 - 0.8));
  var damage = Math.floor(attack/defense * basicDamage * 2 * damageModifier);
  console.log('You took ' + damage + ' damage');
  currentCharacter.currentHp -= damage;
  $('#hp').html(currentCharacter.currentHp + '/' + currentCharacter.maxHp);
  checkLoss();
};

var checkLoss = function() {
  if (currentCharacter.currentHp <= 0) {
    if (currentCharacter.currentHp < 0) {
      currentCharacter.currentHp = 0;
      $('#hp').html(currentCharacter.currentHp + '/' + currentCharacter.maxHp);
    };
    console.log('You are dead');
  } else {
    playerTurn();
  };
};

var enemyNumber = 0;
var currentCharacter;
var currentEnemy;
var $characters = $('.characters');
var $enemy = $('.enemy');
var $attack = $('.attack');
var $techniques = $('.techniques');
var $items = $('.items');
var $techniqueList = $('.techniques-list');
var $itemList = $('.items-list');
var $back = $('<div>').append($('<h3>').html('Back'));
var allTechniques;
var selectedTechnique;
var allItems;
var charged = false;
var chargeModifier = 1;
var armored = true;
