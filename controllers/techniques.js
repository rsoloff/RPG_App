var Technique = require('../models/Technique');

//Route to get all the items. All items are given to the current character
function getAllTechniques(req, res) {
  Technique.find(function(err, techniques) {
    if (err) res.json({message: err + '. Could not get techniques'});
    res.json({techniques: techniques});
  });
}

function getTechnique(req, res) {
  var id = req.params.id;

  Technique.findById({_id: id}, function(err, technique) {
    if (err) res.json({message: err + '. Could not get technique'});
    res.json({technique: technique});
  });
}

function updateTechnique(req, res) {
  var id = req.params.id;

  Technique.findById({_id: id}, function(err, technique) {
    if (err) res.json({message: err + '. Could not get technique'});

    if (req.body.availability) technique.availability = req.body.availability;

    technique.save(function(err) {
      if (err) res.json({message: err + '. Could not update technique'});
      res.json({message: 'Technique updated', technique: technique});
    })
  });
}

//All are exported for use by routes.js
module.exports = {
  getAllTechniques  : getAllTechniques,
  getTechnique      : getTechnique,
  updateTechnique   : updateTechnique
};
