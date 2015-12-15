var express     = require('express');
var logger      = require('morgan');
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');
var routes      = require('./config/routes');
var app         = express();

mongoose.connect(process.env.MONGOLAB_URI||'mongodb://127.0.0.1:27017/rpgApp');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('mongoose connected')
});

app.use(logger('dev'));
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))
app.use(routes);

app.listen(3000, function() {
  console.log('App is listening on port 3000');
});
