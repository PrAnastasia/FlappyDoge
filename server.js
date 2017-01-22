let express = require('express');
let app = express();

app.use(express.static('public'));
app.use(express.static('assets'));

app.get('/phaser.min.js', function (req, res) {
  res.sendFile('phaser.min.js', { root : __dirname + '/bower_components/phaser/build' });
});

app.get('/', function (req, res) {
  res.sendFile('index.html', { root : __dirname });
});

app.use('/docs', express.static('docs'))

let server = app.listen(3000, function () {

  let host = server.address().address;
  let port = server.address().port;

  console.log('Listening at http://%s:%s', host, port);

});