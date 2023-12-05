var app = require('./app.js');

var puerto = 2900;

var server = app.listen(puerto, function() {
    console.log(`Servidor levantado correctamente en el puerto ${puerto}`);
});