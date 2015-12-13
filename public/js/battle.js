$(document).ready(function() {
  $.get('/characters/', renderCharacter, 'json');
  $attack.hide();
  $techniques.hide();
  $items.hide();
})

var renderCharacter = function(data) {
  $characters = $('.characters');
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
      $('.Choose-Character').html('');
      $characters.empty();
      $.get('/enemies/', renderEnemy, 'json');
    });
  }
};

var renderEnemy = function(data) {
  $enemy = $('.enemy');
  $enemy.empty();
  var enemyList = data.enemies;
  var $h2 = $('<h2>');
  currentEnemy = enemyList[enemyNumber];
  $h2.html(enemyList[enemyNumber].name);
  $enemy.append($h2);
  enemyNumber += 1;
  playerTurn();
};

var playerTurn = function() {
  $attack.show();
  $techniques.show();
  $items.show();
  $attack.on('click', playerAttack());
  $techniques.on('click', playerAttack);
  $attack.on('click', playerAttack);
}

var enemyNumber = 0;
var currentCharacter;
var currentEnemy;
var $attack = $('.attack');
var $techniques = $('.techniques');
var $items = $('.items');

/*var renderItems = function(data) {
  console.log(data)
  $item = $('.item');
  $item.empty();
  for (var i = 0; i < 5; i++) {
    var $li = $('<li>');
    var item = data[i]
    console.log(item);
    //$li.html(item.name);
    //$item.append($li);
  }
}*/
