'use strict'
const express     = require('express');
const logger      = require('morgan');
const bodyParser  = require('body-parser');
const mongoose    = require('mongoose');
const routes      = require('./config/routes');
const app         = express();

mongoose.connect(process.env.MONGOLAB_URI||'mongodb://127.0.0.1:27018/rpgApp');

let db = mongoose.connection;
db.on('error',console.error.bind(console, 'connection error:'));
db.once('open',  callback=>console.log('mongoose connected'));

app.use(logger('dev'));
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))
app.use(routes);

app.listen(3000, function() {
  console.log('App is listening on port 3000');
});
