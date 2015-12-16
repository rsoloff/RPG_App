var Item = require('../models/Item');

//Route to get all the items. All items are given to the current character
function getAllItems(req, res) {
  Item.find(function(err, items) {
    if (err) res.json({message: err + '. Could not get items'});
    res.json({items: items});
  });
}

function createItem(req, res) {
  var item = new Item(req.body);
  item.save(function(err) {
    if (err) res.json({message: err + '. Could not create item'});
  });
}

function getItem(req, res) {
  var id = req.params.id;

  Item.findById({_id: id}, function(err, item) {
    if (err) res.json({message: err + '. Could not get item'});
    res.json({item: item});
  });
}

function removeItem(req, res) {
  var id = req.params.id;
  Item.remove({_id: id}, function(err) {
    if (err) res.json({message: err + '. Could not delete item'});
    res.json({message: 'Item deleted'})
  });
}

//All are exported for use by routes.js
module.exports = {
  getAllItems   : getAllItems,
  createItem    : createItem,
  getItem       : getItem,
  removeItem    : removeItem
};
