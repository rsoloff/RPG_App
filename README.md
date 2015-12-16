# RPG App

A turn-based RPG without a creative name. Players choose a character to survive an onslaught of enemies with limited items, gaining strength and abilities as they go along.

### Screenshot
  - ![RPG App](http://i.imgur.com/cJSFAR4.png)

### Technologies Used
  - Node/express
  - Mongoose - MongoDB object modeling for Node.js.
	- Morgan - Node to write log line as request instead of response.
  - mongoose-seeder - Used to seed json data.

### Approach
  - Figured out game mechanics.
  - Created wireframes.
  - Created Node models and controllers and seeded database.
  - Created routes.
  - Programmed game functions in Javascript console.
  - Added text display and click events.
  - Styled front end design with Bootstrap.

### Project Features
  - Choose a character
    - Select a character to play.
  - Gameplay
    - Read game text.
    - Encounter an enemy.
    - Start a battle.
    - Attack an enemy.
    - Select and use a technique.
    - Use items.
    - Defeat an enemy.
    - Lose to an enemy.
    - Gain experience by winning.
    - Level up to gain stats and new techniques.
    - Use strategy and limited resources to defeat all the enemies.
    - Reach the end and win.
    - Restart game on win or loss.

### Unresolved Problems
  - Currently can only play as Fighter.
  - Can only seed two items.
  - Could not make separate text functions.
  - Did not get to use/need Angular.

### Major Hurdles
  - Seeding the database with nested Schema: I wanted to find a way without a long nested function, but could not get one to work so I did it the hard way.
  - Creating click events in a loop: I had trouble getting the loop to save the value 'i' for the individual clicks. A for each loop worked much better.
