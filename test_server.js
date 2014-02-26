var express = require('express');
var http = require('http');
var path = require('path');
var app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname)));

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

app.get('/api', function( request, response ) {
  response.send({ 'name' : 'Matt', 'age': 30 });
  response.end();
});

app.post('/api', function( request, response ) {
  console.log( request.body );

  response.send('Nice work, buddy!');
  response.end();
});





