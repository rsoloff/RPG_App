$(document).ready(function() {
  $.get('/characters/', renderCharacters, 'json');
})

var renderCharacters = function(data) {
  $characters = $('.characters');
  var characterList = data.characters;
  for (var i = 0; i < characterList.length; i++) {
    var $h1 = $('<h1>');
    var currentCharacter = characterList[i];
    $h1.html(currentCharacter.name);
    $characters.append($h1);
    $h1.on('click', function() {
      $('.chosen-character').append($h1);
      $('.Characters').html('');
      $characters.empty();
      $.get('/battle', function() {
        console.log('off to battle');
      });
    });
  }
};
