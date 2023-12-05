const mysql = require('mysql');

var conexion = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "dbloginnodejs"
});

const db = {
    conexion: conexion,
    conectarDB: function conectarDB() {
        conexion.connect(function(error) {
            if (!error) {
                console.log("Conexion a la base de datos realizada con exito");
            }
            else {
                console.log("El error en la conexión a MySQL es: " + error);
            }
        });
    }
}

module.exports = db; //Se exporta la conexión.