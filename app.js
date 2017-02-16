var express = require('express')
var app = express()

var port = normalizePort(process.env.PORT || '8100');
app.set('port', port);

app.get('/', function (request, response) {
    response.sendFile(__dirname + "/www/index.html");
});

app.use(express.static(__dirname + '/www'));

app.listen(port, function () {
  console.log('Example app listening on port ' + port );
});

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}
