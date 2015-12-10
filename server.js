const express     = require('express');
const logger      = require('morgan');
const bodyParser  = require('body-parser');
const mongoose    = require('mongoose');
const routes      = require('./config/routes');
const app         = express();

mongoose.connect('mongodb://localhost/rpg', function (err) {
  if (err) {
    console.log('connection error', err);
  } else {
    console.log('connection successful');
  }
});

app.use(logger('dev'));
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))
app.use(routes);

app.listen(3000, function() {
  console.log('App is listening on port 3000');
});
