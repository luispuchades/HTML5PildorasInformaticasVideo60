/*global window */
/*global alert */
/*jslint browser: true, for:true */

//JavaScript Document

/**Curso: HMTL5 - Pildoras Informáticas - API File VII
 * Origin: Capitulo60.html ==> Eliminando archivos
 */

// "use strict";

//1. Definición de Objetos y Variables
var zonaDatos;
var botonAceptar;
var nombreArchivo;
var espacio;
var ruta;
var botonVolver;
var archivoOrigen;
var directorioDestino;

//1.1 Extracción de elementos desde HTML
zonaDatos = document.getElementById("zona-datos");
botonAceptar = document.getElementById("boton-aceptar");
nombreArchivo = document.getElementById("entrada").value;
botonVolver = document.getElementById("boton-volver");
archivoOrigen = document.getElementById("archivo-origen");

function errores (e) {
    'use strict';

    alert("Ha habido un error" + e.code);
}


function volverAtras() {
    'use strict';

    espacio.getDirectory(ruta, null, function(directorioActual) {
            directorioActual.getParent (function(directorioPadre) {
                    ruta = directorioPadre.fullpath;
                    mostrar();
            }, errores();)
    }, errores(););


}

function crearSys(system) {
    'use strict';

    espacio = system.root;
    ruta = "";
    mostrar();
}

//function errores (error) {
//    'use strict';
//
//    alert("Ha habido un error: " + error.code);
//}


function accesoEspacio() {
    'use strict';

//Indicamos que requerimos un espacio permanente (persistente)
    window.webkitRequestFileSystem(PERSISTENT, 5*1024*1024, crearSys, errores);
    window.mozRequestFileSystem(PERSISTENT, 5*1024*1024, crearSys, errores);
}

function listar(archivos) {
    'use strict';

    for (i = 0; i < archivos.length; i = 1 + 1) {
        if(archivos[i].isFile) {
            zonaDatos.innerHTML += archivos[i].name + "<br />";
        }
        else if (archivos[i].isDirectory) {
            zonaDatos.innerHTML += "<span class = 'directorio'>" + archivos[i].name + "</span><br />";
        }
    }
}

function leer() {
    'use strict';

    lector.readEntries(function(archivos) {
        if (archivos.length) {
            listar(archivos);
        }
    }, errores);
}

function leerDirectorio(directorio) {
    'use strict';

    var lector;


// Creamos el lector. y le asignamos el createReader del objeto directorio que nos pasa la función gerDirectory
    lector = directorio.createReader();
// Leemos las entradas del directorio creado
    leer();
}

function mostrarArchivo(entrada) {
    'use strict';

    document.getElementById("archivo-origen").value = "";
    zonaDatos.innerHTML = "";

/**
 * Abrimos el directorio donde nos encontramos (espacio = system.root;)
 *Ojo con el null, que se utiliza si ya se han creado directorios
 *Si no, tendremos que usar {create: true, exclusive: false}
 */

    espacio.getDirectory(ruta, null, leerDirectorio, errores);

    zonaDatos.innerHTML = "Éxito en la creación de espacio y archivo!" + "<br />";
    zonaDatos.innerHTML += "Nombre: " + entrada.name + "<br />";
    zonaDatos.innerHTML += "Ruta: " + entrada.fullpath + "<br />";
}

function exito() {
    'use strict';

    mostrar();
}

function modificarArchivo() {
    'use strict';

/**
 * Añadimos la ruta para poder eliminar el fichero desde
 * cualquier directorio
 */
    archivoOrigen = ruta + archivoOrigen;

        espacio.getFile(archivoOrigen, null, function(archivo) {
            archivo.remove(exito, errores);
        }, errores);
}




function crearArchivo() {
    'use strict';

// Si se propone un nombre de archivo, entonces si crea con getFile
// siempre que no exista otro anterior o con el mismo nombre.
    if (nombreArchivo != "") {

        nombreArchivo = ruta + nombreArchivo;

        espacio.getFile(nombreArchivo, {create: true, exclusive: false}, mostrarArchivo, errores)
// Si sustituimos getFile() por getDirectory, lo que creamos es un directorio
//        espacio.getdirectory(nombreArchivo, {create: true, exclusive: false}, mostrarArchivo, errores)
    }
}


function comenzar() {
    'use strict';

    botonAceptar.addEventListener("click", modificarArchivo, false);
    botonVolver.addEventListener("click", volverAtras, false);

/**
 * Determinamos si el espacio debe ser temporal o permanente
 * Aun no es estandard y hay que usar prefijos de navegador (webkit, moz y ms)
 * Pedimos permiso al navegador para acceder a nuestro disco duro
 * Reservamos con requestQuota 5MB = (5 * 1024 bits/KB *...
 * ... * 1024 KB/MB)
 */

    navigator.webkitPersistentStorage.requestQuota(5*1024*1024, accesoEspacio)
    navigator.mozPersistentStorage.requestQuota(5*1024*1024, accesoEspacio)
}




//3. Asignación de Eventos
document.addEventListener("DOMContentLoaded", comenzar, false);
