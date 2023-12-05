//1. Declarar e iniciar las librerías necesarias.
const express = require('express');
const bcryptjs = require('bcryptjs');
const session = require('express-session');

//2. Importar las variables necesarias.
const db = require('./db/conexion'); //Importando la conexión a DB.

//3. Realizar la conexión a la base de datos.
db.conectarDB();

//4. Almacenar el servidor.
const app = express();

//5. Establecer el directorio público.
app.use(express.static("../client"));

//6. Establecer el motor de plantillas.
app.set("view engine", "ejs");

//7. Establecer la carpeta de vistas (Necesario para el motor de plantillas).
app.set('views', '../client');

//8. Realizar la configuración general de sesiones.
app.use(session({
    key: "cookie_usuario", //Nombre de la cookie que se almacena en el equipo del cliente.
    secret: "#LW3$W1N392", //Aquí hay que poner una cadena cualquiera.
    resave: true,
    saveUninitialized: true
}));

//9. Setear express (Configurar las cabeceras).
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//10. Establecer las rutas.
app.get("/", async function(request, response) {
    if (request.session.usuario) {
        response.render("index.ejs", {
            usuarioConectado: true,
            id: request.session.usuario.id,
            correo: request.session.usuario.correo,
            clave: request.session.usuario.correo,
            tipo: request.session.usuario.tipo
        });
    }
    else {
        response.render("index.ejs");
    }
});

//10.1 Rutas Vista (Renderizan vistas).
app.get("/registrarse", async function(request, response) {
    response.render("registrarse.ejs");
});

app.get("/iniciar-sesion", async function(request, response) {
    response.render("iniciar_sesion.ejs");
});

//10.2 Rutas Acción (Procesan datos).
app.post("/usuario-save", async function(request, response) {
   var correo = request.body.correo;
   
   var clave = request.body.clave;
   var claveEncriptada = await bcryptjs.hash(clave, 8);

   var tipo = request.body.tipo;

    var sql = db.conexion.query("INSERT INTO usuario SET ?", {correo: correo, clave: claveEncriptada, tipo: tipo}, async function(error, resultado) {
        if (error) {
            response.render("registrarse.ejs", { //Este objeto JSON contiene los datos necesarios para la alerta de la librería "SweetAlert2".
                alerta: true,
                titulo: "Registro",
                mensaje: "!Registro Fallido¡",
                icono: "error",
                mostrarBotonConfirmacion: false,
                tiempo: 1500,
                ruta: "/registrarse"
           });
        }
        else {
           response.render("registrarse.ejs", { //Este objeto JSON contiene los datos necesarios para la alerta de la librería "SweetAlert2".
                alerta: true,
                titulo: "Registro",
                mensaje: "!Registro Exitoso¡",
                icono: "success",
                mostrarBotonConfirmacion: false,
                tiempo: 1500,
                ruta: "/"
           });
        }
    });
});

app.post("/autenticacion", async function(request, response) {
    var correo = request.body.correo;
    var clave = request.body.clave;

    if (correo && clave) {
        var sql = db.conexion.query("SELECT * FROM usuario WHERE correo = " + "'" + correo  + "'" + ";", async function(error, resultado) {
            if (resultado.length == 1 && await bcryptjs.compare(clave, resultado[0].clave)) { //Verificando si el usuario existe y si la contraseña es correcta.
                request.session.usuario = resultado[0];
                
                response.render("registrarse.ejs", { //Este objeto JSON contiene los datos necesarios para la alerta de la librería "SweetAlert2".
                    alerta: true,
                    titulo: "Login",
                    mensaje: "!Credenciales Correctas¡",
                    icono: "success",
                    mostrarBotonConfirmacion: false,
                    tiempo: 1500,
                    ruta: "/"
               });
            }
            else {
                response.render("registrarse.ejs", { //Este objeto JSON contiene los datos necesarios para la alerta de la librería "SweetAlert2".
                    alerta: true,
                    titulo: "Login",
                    mensaje: "!Credenciales Incorrectas¡",
                    icono: "error",
                    mostrarBotonConfirmacion: false,
                    tiempo: 1500,
                    ruta: "/iniciar-sesion"
               });
            }
        });
    }
});

app.get("/cerrar-sesion", async function(request, response) {
    delete request.session.usuario;
    response.redirect("/");
});

module.exports = app;