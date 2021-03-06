var express = require('express');
var reload = require('reload');
var app = express();
var bodyParser = require('body-parser')



app.set('port', process.env.PORT || 3000 );
app.set('view engine', 'ejs');
app.set('views', 'app/views');

app.locals.siteTitle = 'Pear Rank';

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use(express.static('app/public'));
app.use(require('./routes/index'));
app.use(require('./routes/university'));

app.use(require('./routes/program'));
app.use(require('./routes/dbpage'));



var server = app.listen(app.get('port'), function() {
  console.log('Listening on port ' + app.get('port'));
});

reload(server, app);
