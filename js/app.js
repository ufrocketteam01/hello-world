var http = require('http');
var fs = require('fs');
var ode45 = require('ode45-cash-karp')
// var expres = require('express');
// var app = express();

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  var myReadStream = fs.createReadStream(__dirname+ '/../index.html','utf8');
  myReadStream.pipe(res);
}).listen(8080);


// app.use('/assets', express.static('css'));