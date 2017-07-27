# bindie

Proyecto de desarrollo manager de bandas para Taller de Desarrollo de proyectos.

Version de Node:    4.2.3
Version de Bower:   1.7.9

----------------------------------------------------------------------------------------------------------------------------------------

NOTA:

Todo el contenido del directorio /public/lib y node_modules/ esta marcado como ignorado por git.

Toda biblioteca publica (para el cliente) que desarrollen y que deseen commitear debe estar en /public/custom.

----------------------------------------------------------------------------------------------------------------------------------------

Instalacion del proyecto:

> Instalar NodeJs desde https://nodejs.org/en/download/.
> Si trabajan en Windows:
    * Agregar el directorio de instalacion a la variable PATH.
    * Abrir inicio -> "Node.js Command prompt" -> ABRIR COMO ADMINISTRADOR (IMPORTANTE!).

> Instalar Bower globalmente:
    * Abrir linea de comando y correr: "npm install -g bower".

> Instalar MongoDb.
> Si trabajan en Windows, seguir instrucciones de: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/#install-mongodb-community-edition.
> Agregar el directorio bin/ de Mongo a la variable PATH.

> Para iniciar el server de Mongo, abrir una terminal y correr "mongod".
> Para conectarse con el server de mongo, abrir una terminal y correr "mongo".

> Abrir una terminal en la carpeta raiz del proyecto y correr:
    * npm install.
    * bower install.

----------------------------------------------------------------------------------------------------------------------------------------

Correr el proyecto:

> Abrir una terminal en la carpeta raiz del proyecto y correr "node app.js"

----------------------------------------------------------------------------------------------------------------------------------------

Estructura del proyecto:

> bin: carpeta generada por defecto con el arquetipo de express. No se usa, pero leyendo un poco se podria encontrar algun uso.
> config: configuraciones de la aplicacion.
> controllers: controladores de la aplicacion. Funciones y metodos que responen a solicitudes de usuario.
> lib: middlewares y clases de utilidades.
> models: modelos de datos.
> node_modules: guarda todos los modulos instalados por npm. Este directorio no deberia tocarse manualmente.
> public: archivos publicos (client-side) como imagenes, musica, etc.
> public/lib: BIBLIOTECAS DESCARGADAS MEDIANTE BOWER (NO SE SUBEN AL REPOSITORIO).
> public/custom: BIBLIOTECAS CLIENT-SIDE NUESTRAS QUE DESEEMOS SUBIR AL REPO.
> routes: rutas y redireccionamientos. Vincula rutas de acceso a la aplicacion con funciones de controladores.
> views: contiene las vistas de la aplicacion usando el template engine EJS.

app.js: punto de entrada de la aplicacion. Carga todas las configuraciones y levanta la aplicacion.
bower.json: modulos de bower necesarios para la aplicacion.
package.json: modulos de node necesarios para la aplicacion.