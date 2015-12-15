var express    = require('express');
var router     = express.Router();
var bodyParser = require('body-parser');

var charactersController = require('../controllers/characters');
var enemiesController    = require('../controllers/enemies');
var itemsController      = require('../controllers/items');
var techniquesController = require('../controllers/techniques');

router.route('/characters')
  .get(charactersController.getAllCharacters);

router.route('/characters/:id')
  .get(charactersController.getCharacter)
  .patch(charactersController.updateCharacter);

router.route('/enemies')
  .get(enemiesController.getAllEnemies);

router.route('/enemies/:id')
  .get(enemiesController.getEnemy)
  .patch(enemiesController.updateEnemy);

router.route('/items')
  .get(itemsController.getAllItems)
  .post(itemsController.createItem);

router.route('/items/:id')
  .get(itemsController.getItem)
  .delete(itemsController.removeItem);

router.route('/techniques')
  .get(techniquesController.getAllTechniques);

router.route('/techniques/:id')
  .get(techniquesController.getTechnique)
  .patch(techniquesController.updateTechnique);

module.exports = router;
