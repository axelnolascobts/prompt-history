Documentación de Node.js:

Indices de estabilidad:

0 - Deprecated: LA funcion puede dar advertencias, compatibilidad no garantizada.
1 - Experimental: NO sujeta a una versión semántica. Podria dejar de ser compatible en actualizaciones futuras.
1.0 - Desarrolo temprano: Las caracteristicas están inconclusas y sujetas a cambios importantes.
1.1 - Desarrolo activo: LAs caracteristicas se acercan a la vitalidad mínima.
1.2 - Candidato de liberación: Se acercan a ser una versión estable y no se preveen actualizaciones
importantes pronto, sin embargo aún no son suficientemente provadas para considerarse "estables".
2 - Estable: la compatibilidad con el ecosistema npm es alta.
3 - Legado: Version que ya no es activa y que existen otras opciones.

Node asserts: es un módulo que provee funciones de afirmación para verificar invariantes.

Strict assertion mode:
En este modo, los métodos no estrictos se comportan como sus métodos estrictos.
En modo assert los mensajes de error muestran diff, en modo legacy muestran los objetos truncados.

modo assert:
const assert = require('node:assert').strict;

modo strict assert:
const assert = require('node:assert/strict');

Legacy assertion mode:
usa el operador == en:

- assert.deepEqual()
- assert.equal()
- assert.notDeepEqual()
- assert.notEqual()

Para usar el modo legacy assertion:
const assert = require('node:assert');

Class: assert.AssertionError

extends errors.Error

Indica una falla en una afirmación. todos los errores del módulo node:assert pueden instansearse con:
AssertionError 

new assert.AssertionError(options)

options
- message: Mensaje personalizado de error.
- actual - Valor real obtenido.
- expected - Valor que se esperaba obtener.
- operator - Operador utilizado para la prueba.
- stackStartFn - Permite omitir funciones anteriores en el stack trace.

Propiedades de una instancia AssertError:

Ademas de message y error hay propiedades adicionales:

actual - El valor que se obtubo de la prueba.
expected - el valor que se esperaba de la brueba.
generatedMessage - indica si el mensaje de error se generó automáticamente.
code - es para saber si el error fue causado por una afirmación.
operator - el operador lógico que fue utilizado para la prueba.

Class: assert.CallTracker
(DEPRECATED) - estabilidad 0
considerar utilizar otras alternativas.

new assert.CallTracker():
sirve para saber si ciertas fucniones fueron llamadas la cantidad de veces que se esperaba.

tracker.calls([fn][, exact])

fn - es una funcion sin operadores
exact - número de veces que se espera que se ejecute la funcion (1 por default).
return - una funcion que funciona igual que la funcion fn pero internamente lleva el conteo de ejecuciones.

si la funcion no se ejecuto la cantidad de veces especificada con exact entonces tracker.verify() retornará un error.

tracker.getCalls(fn):

fn - es una función
return - Un array con todas las llamadas a la función

Cada elemento del array es un objeto que contiene

thisArg - el argumento con el que se llamó la función.
arguments - un array con los argumentos con los que se llamó a la función.

tracker.report()
Da un reporte que retorna un arreglo de objetos que contienen información envuelta en las funciones devueltas por tracker.calls().

cada objeto contiene:
message - mensaje personalizado
actual - valor actual obtenido.
expected - valor esperado al evaluar.
operator - el nombre de la funcion envuelta
stack - un objeto con la pila del rastro de la función.

tracker.reset([fn])
Es una funcion que reinicia el conteo de llamadas de callTracker

fn - una función que sea usada en algun callTracker

tracker.verify()
Verfica si todas las funciones llamadas por callTracker fueron llamadas exitosamente el número de veces esperado.

assert(value[, message])
assert.ok() es lo mismo

value - evalua el valor como un truthy
message - mensaje de error

assert.deepEqual(actual, expected[, message])
assert.deepStrictEqual() es lo mismo

actual - valor actual recibido
expected - valor esperado
message - mensaje de error

assert.deepEqual()
sirve para probar la igualdad entre el valor actual y el esperado

Reglas:
- Permite evaluar cualquer valor que acepte el operador == (a excepción de NaN).
- Que tengan el mismo tipo Date y {} no son iguales aunque tengan las mísmas propiedades.
- Solo se comparan propiedades enumerables y no las heredadas.
- Si se comparan Error, TypeError siempre se comparan sus propiedades.
- Objetos como new String o new Number se comparan como objetos con su valor primitivo.
- El orden de las propiedades es irrelevante.
- Con map y set tampoco importa el orden de los elementos pero si su contenido.
- La comparación se hace con funciones recursivas pero se detiene si hay una diferencia clara o hay una referencia circular.
- solo le importa el contenido de los objetos, es decir que no evalúa sus prototipos.
- las propiedades symbol no las toma en cuenta.
- weakmap y weakset se comparan por su instancia, no por su contenido.  
- Los regex se comparan usando el patrón, la bandera y el índice actual.

assert.deepStrictEqual(actual, expected[, message])
sirve para probar la igualdad entre el valor actual y el esperados

Reglas:
- Permite evaluar cualquer valor que acepte el operador == (a excepción de NaN).
- Que tengan el mismo tipo Date y {} no son iguales aunque tengan las mísmas propiedades.
- Solo se comparan propiedades enumerables y no las heredadas.
- Si se comparan Error, TypeError siempre se comparan sus propiedades.
- Objetos como new String o new Number se comparan como objetos con su valor primitivo.
- El orden de las propiedades es irrelevante.
- Con map y set tampoco importa el orden de los elementos pero si su contenido.
- La comparación se hace con funciones recursivas pero se detiene si hay una diferencia clara o hay una referencia circular.
- solo le importa el contenido de los objetos, es decir que no evalúa sus prototipos.
- las propiedades symbol no las toma en cuenta.
- weakmap y weakset se comparan por su instancia, no por su contenido.  
- Los regex se comparan usando el patrón, la bandera y el índice actual.

assert.doesNotMatch(string, regexp[, message])
Valida que una cadena string NO cohincida con una expreción regular (regex).

string - una cadena de texto
regex - una expreción regular /regex/
message - mensaje de error

assert.doesNotReject(asyncFn[, error][, message])
Esta función valida si una promesa o función async fue o n rechazada, en caso de haber sido rechada devuelve un mensaje de error.

asyncFn - una función asincrona o promesa.
error - filtro de errores que no deberían de ocurrir.
message - mensaje de error.

assert.doesNotThrow(fn[, error][, message])
Se asegura de que una función no devuelva un error al ser ejecutada.

fn - es la función que se desea evaluar.
error - filtro de errores que no deberían ocurrir.
message - mensaje de error.

assert.equal(actual, expected[,message])
Verifica que el valor actual sea igual al esperada, en caso de no serlo, devuelve un error.

assert.fail([message])
lanza un assertionError intencional, es decir que hace que la prueba falle en ese punto.

assert.fail(actual, expected[, message[, operator[, stackStartFn]]])
permite lanzar un AssertionError personalizado.

actual - el valor actual obtenido.
expected - el valor esperado.
message - mensaje de error personalizado.
operador - el operador utilizado ( != o == ).
stackStartFn - a partir de donde se traza la pila de llamadas.

assert.ifError(value)
si el valor no es null o undefined entnces retorna throw

value - es un valor cualquiera.

assert.match(string, regexp[, message])
Valida que una cadena string cohincida con la estructura de una regex

string - cadena de texto.
regexp - expreción regular a evaluar.
message - mensaje de error.

assert.notDeepEqual(actual, expected[, message])
Verifica que el valor actual y el esperado no sean profundamente iguales.

actual - valor actual
expected - valor esperado
message - mensaje de error personalizado.

assert.notDeepStrictEqual(actual, expected[, message])
Verifica que el valor actual y el esperado no sean profunda y estrictamente iguales, en caso de serlo retorna un error.

actual - valor actual obtenido.
expected - valor esperado
message - mensaje de error personalizado.

assert.notEqual(actual, expected[, message])
Verifica que dos valores no sean iguales de forma simple !=

actual - valor actual obtenido.
expected - valor esperado.
message - mensaje de error personalizado.

assert.notStrictEqual(actual, expected[, message])
Verifica que dos valores sean iguales de manera simple y estricta ( !== )

actual - valor actual obtenido.
expected - valor esperado.
message - mensaje de error personalizado.

assert.ok(value[, message])
Verifica que el valor sea un truthy y en caso de no serlo entonces retrna un mensaje de error.

value - valor cualquiera a evluar.
message - mensaje de error personalizado.

assert.rejects(asyncFn[, error][, message])
Se utiliza para saber si una promesa o función asíncrona se rechaza.
si la primesa no se rechaza entonces envia un error.

asyncFn - función asíncrona
error - para verificar el tipo de coontenido del error.
message- mensaje de error personalizado.

retorna una promesa.

assert.strictEqual(actual, expected[, message])
Verifica que el valor actual sea igual al esperado de forma estricta.

actual - valor actual obtenido.
expected - valor esperado.
message - mensaje de error personalizado.

assert.throws(fn[, error][, message])
Verifica que una funcion síncrona retorne un error al ejecutarse, en caso de que no sea así entonces lanza error.

Fn - función síncrona a evaluar
error - tipo de error esperado
message - mensaje de error personalizado

assert.partialDeepStrictEqual(actual, expected[, message])
Verifica de manera profunda y estricta que al menos las propiedades definidas dentro de actual sean iguales a las de expected

actual - valor actual obtenido.
expected - valor esperado.
message - mensaje de error personalizado.

Reglas:
- Valores primitivos: Se comparan con Object.is() → es más estricto que ===.
- Propiedades de objetos: Solo las enumerable y own (propiedades propias).
- Errors: Se comparan name, message, cause y errors, aunque no sean enumerables.
- Símbolos: Se comparan los símbolos enumerables también.
- Mapas y Sets: Se comparan sin importar el orden.
- RegExp: Se comparan sus propiedades como source, flags, etc.
- Arrays dispersos: Se ignoran los huecos (holes).
- WeakMap / WeakSet: Solo son iguales si apuntan al mismo objeto, no por su contenido.

BUFFER: 

definición:
Se usan para manejar datos binarios en bruto, son utiles para trabajar con datos a nivel de bytes. (como archivos, imágenes y datos que vienen de una red).

buffer - secuencia de bytes de longitud fija.

buffer es global pero se recomienda inportarlo:

const { Buffer } = require('buffer');

Para convertir entre buffer y string el código de caracteres debe ser especificado si no son especificados se toma UTF-8 como la default.

Buffer y codificaciones de caracteres:

La codificacion de caracteres es representar el texto como bytes.

utf8 - el más común de 1 a 4 bytes por caracter y coporta todos los caracteres unidode.
utf16le - soporta los caracteres unicode, 2 a 4 bytes por caracter solo disponible en little endian.
latin1 - solo los primeros 256 caracteres unicode, no soporta emojis ni caracteres especiales. Si el caractér está fuera de rango simplememte lo borra (se pierden datos).

encoding - convertir de string a bytes (buffer)
decoding - convertir de buffer (bytes) a string 

codificación binario a texto:

base 64 - convierte binarios a letras, números y algunos símbolos para enviar archivos o imagenes a texto. (no es para texto plano).

base64url - igual que base 64 pero evitas caracteres + o / no añade relleno =

hex - convierte cada byte a 2 caracteres hexadecimales, utilizado para identificadores únicos. (si el número de caracteres no es par podria fallar al decodificar)

codificaciones heredadas: (no recomendables).

ascii - solo soporta caracteres de 7 bits usa latin1 al codificar, al decodificar borra el bit más alto solo dejando 7 bits, util con datos muy antiguos.

binary - alias de latin1 (NO SON DATOS BINARIOS)

ucs2 - alias de utf16le

Aunque algunos navegadores aun soportan latin1 es mejor usar win-1252 ya que de cualquer manera los navegadores interpretan latin1 como win-1252 y eso podría causar problemas.

Buffers and TypedArrays:

Los buffer en Node.js son una especialización de Uint8Array lo que significa que el buffer hereda todos los métodos de TypedArray como .slice, .subarray, .set pero también tiene sus comportamientos que no simepre cohinciden con los de typearray

TypedArray.prototype.slice() - crea una copia del array original
Buffer.prototype.slice() - crea una vista del array original pero no una copia, si se módifica esa vista entonces se modifica el original.

buf.toString() - convierte el buffer a texto string (no funciona con TypedArray).

métodos propios de buffer:
- buf.indexOf()
- buf.includes()
- buf.equals()
- buf.toJSON()

convertir de Buffer a typedArray

cosnt BUF = Buffer.from([1, 2, 3, 4]);

const arr = new (Uint32Array(BUF));
console.log(arr)

convertir de ArrayBuffer a TypedArray
de modo que se crea una vista que comparte memoria con el buffer.

const BUF = Buffer.from([1, 2, 3, 4]);

const VIEW = new new Uint32Array(BUF);

obtener el bufer adyacente a partir de TypedArray

const ARRAY = new Uint8Array([10, 20, 30, 40, 50]);

console.log(ARRAY.buffer.bytelength); // 5 (hay 5 bytes)

const BUF = Buffer.from(ARRAY.buffer, 1, 3);

console.log(BUF) // contiene los bytes 20, 30 y 40 (posicion 1, 2 y 3) del array

diferencia entre TypedArray.from() y Buffer.form() ya que mbos sirven para instansiar un buffer podria parecer que son lo mismo, sin embargo TypedArray si permite el uso del metodo map, a diferencia de Buffer.from que no lo permite.

Buffer acepta lo siguiente:

Buffer.from(array)
Buffer.from(buffer)
Buffer.from(arrayBuffer[, byteOffset[, length]])
Buffer.from(string[, encoding])

Sin embargo no acepta mapeo, es decir no podemos hacer algo como:

Buffer.from([1, 2, 3], x => x * 10);

primero hacer el mapeo aparte y después instanciar el buffer.

Buffers e Iteración

Una instancia de buffer puede itrarse con la sintaxis de un for ... of

for ( b of buff )

también pueden usarse buf.values(), buf.keys() y buf.entries para iterar sobre un buffer.

class: Blob

Blob (Binary Large Object) es una estructura que encapsula datos binarios que no se pueden cambiar una vez creados.

crear un blob:

const blob = new buffer.Blob([sources[, options]]);

sources - un array que puede tener strings, ArrayBuffer TypedArray, DataView u otros Blob.
options - un objeto con las propiedades "ending" y string.

Los datos de ArrayBuffer TypedArray, DataView y Buffer se copian dentro del blob, después puedes modificar el original sin afectar al blob.

blob.arrayBuffer()

Este método retorna una promesa que se resuelve con ArrayBuffer y contiene una copia de los datos del Blob

blob.bytes()

retorna una promesa que se resuelve con un Uint8Array que es una vista sobre los bytes del blob.

blob.size

Retorna el tamaño total del blob en bytes.

blob.slice([start[, end[, type]]])
Crea un nuevo blob que contiene un fragmento del blob original

start - el valor del índice del byte donde inicia.
end - el valor del índice del byte donde termina.
type - Tipo del elemento (solo afecta la descripción sin afectar los datos).

blob.stream()
devuelve un ReandableStream para permitir leer los datos del blob poco a poco y no cargar todo a la memoria de golpe.

blob.text()
devuelve una promesa que se resuelve con el contenido del blob como texto, el texto se interpreta en utf-8 por lo que solo funcinará correctamente si el contenido original era texto plano utf-8

blob.type
es una propiedad que indica el tipo de contenido MIME del blob
text/plain, application/json, image/png, por ejemplo.

Blob objects y MessajeChannel
cunado se envia un blob por medio de un MessagePort como MessageChannel.postMessage() el blob se puede compartir en hilos sin copiar los datos inmediatamente.

se copian los datos del blob pero mo de manera inmediata.

Class: Buffer:

La clase buffer es una estructura de datos de bajo nivel que permite trabajar directamente con bytes (datos binarios).

util para: manipular datos binarios, leer/escribir datos en redes, codificar/decodificar contenido (imágenes, archivos, datos crutos).

Buffer.alloc(size[, fill[, encoding]])
Es un método estático que crea un buffer con un tamallo especificado y lo rellena con un valor (opcionalmente).

size - tamaño del buffer
fill - valor con el que se quiere rellenar el buffer
encoding - si fill fuera un string se puede elegir su codificación (por default es utf-8)

size debe ser un número válido mayor o igual a 0 y menor al máximo permitido (usualmente 1 GB)
cuando pasas el parametro fill internamente rellena el buffer usando el método .fill()

buffer.alloc es más lento porque siempre rellena todo el buffer con lo especificado o con ceros sin embargo es más seguro porque limpia la memoria.

Método estático: Buffer.allocUnsafe(size):
Es un método que crea un nuevo buffer con el tamaño especificado, sin embargo no limpia la memoria y rellena el buffer con cosas aleatorias. 

size - parámetro que indica el tamaño del buffer (debe ser un número entero).

Buffer.poolSize es parte del sistema de Node.Js que preasigna un pool de memoria y cuando se crea Buffer.allocUnsafe(), Buffer.from(array), Buffer.from(string), Buffer.concat() y se utiliza menos de la mitad de la memoria Node reutiliza ese bloque de memoria en lugar de pedir mas al SO.

Método Estático: Buffer.allocUnsafeSlow(size):
Es un método que crea un buffer del tamaño indicado pero lo crea fuera del pool de memoria interno de Node.js

se utiliza para crear un buffer independie del pool de memoria y no afectar así a algun buffer que se quiera mantener por largo tiempo.

Método Estátio: Buffer.byteLength(string[, encoding]):
Este método calcula cuantos bytes ocupa un valor del buffer.

string - una cadena de texto string, un ArrayBuffer o un TypedArray.
encoding - solo importa si el input es una cadena string y por defecto es utf8

util para saber el peso de un string en bytes y evitar el límite de tamaño de un buffer.

Método Estático: Buffer.compare(buf1, buf2)
Método que compara buffers byte por byte y devuelve un número que indica cual es el mayor, cual es el menor o si son iguales.
útil para ordenar buffers en un array.

buf1 y buf2 - deben ser objetos buffer o typedarray

retorna -1 si buf1 < buf2
retorna 0 si buf1 === buf2
retorna 1 si buf1 > buf2

Método estático Buffer.concat(list[, totalLength])
Método para concatenar varios buffers en uno solo, util cuando se resiven partes de un solo buffer por ejemplo recibidos de ReandableStream.

list - es un array de buffers
totalLength - es el tamaño total del nuevo buffer resultante y es opcional. (si no se especifica Node.js suma los tamaños de buffers automáticamente).

Método Estático: Buffer.copyBytesFrom(view[, offset[, length]]):
Método que crea un nuevo buffer copiando bytes directamente de un TypedArray

view - es un TypedArray de donde se tomarán los bytes.
offset - parametro opcional, un número que es la posicion a partir de donde se comenzará a copiar.
lenght - parametro opcional que indica cuantos elementos a partir del offset se copiarán.

el objetivo es copar los valores binarios directamente en un buffer.

Método Estático: Buffer.from(array):
crea un nuevo buffer de bytes a partir de un arreglo de enteros con valores entre 0 y 255.

array - un arreglo de enteros con valores de 0 a 255, cada número es un byte.

retorna un buffer

si el valor es menor a 0 se suma 256 para ajustar su valor.
si el número es mayor a 255 se resta 256 para ajustar su valor.

# SOCKET IO
Biblioteca que sirve para conectar cliente y servidor de manera bidimencional.

- new Server(httpServer[, options])

httpServer - es un servidor http personalizado
options - especificar opciones que controlan el comportamiento del servidor Socket.IO

options comunes:

| Opción              | Descripción                                                                 |
| ------------------- | --------------------------------------------------------------------------- |
| `cors`              | Controla qué orígenes pueden conectarse. Muy útil para evitar errores CORS. |
| `pingInterval`      | Tiempo entre pings automáticos para mantener la conexión.                   |
| `pingTimeout`       | Tiempo de espera para responder a un ping antes de cerrar la conexión.      |
| `maxHttpBufferSize` | Tamaño máximo del mensaje que el servidor aceptará (por defecto 1MB).       |
| `allowEIO3`         | Permite compatibilidad con clientes Socket.IO v2 (Electron, etc).           |
| `serveClient`       | Si `true`, sirve el cliente Socket.IO (JS del navegador) desde el servidor. |
| `path`              | Cambia la ruta del endpoint WebSocket (por defecto: `/socket.io`).          |
| `cookie`            | Define si se usa cookie para identificar conexiones (por defecto: `false`). |
| `perMessageDeflate` | Habilita compresión de mensajes. Útil para reducir tráfico de datos.        |

ejemplo:

import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
  // options
});

io.on("connection", (socket) => {
  // ...
});

httpServer.listen(3000);

- new Server(port[, options])

port - número del puerto directo en el que se inicializa el socketio
options - especificar opciones que controlan el comportamiento del servidor Socket.IO

import { Server } from "socket.io";

const io = new Server(3000, {
  // options
});

io.on("connection", (socket) => {
  // ...
});

diferencia entre httpServer y port
crear server mediante CreateServer te permite completa personalización del servidor HTTP, es posible el uso de expressJS en caso de ser necesario requiere más líneas para fucnionar y se recomienda para proyectos grandes.

En cambio usando new Server(port) es menos versatil en la personaliacion del servidor no permite el uso de ExpressJS aunque requiere menos líneas de código y solo se recomienda usar en pruebas o proyectos simples.

- Eventos:

event: 'connection' / 'connect'
Evento que se activa cuando el cliente se conecta al servidor y marca el inicio de la comunicación entre cliente - servidor.

'connection' - io.on(...) Este se utiliza en el servidor
'connect' - socket.on(...) Este se usa para el cliente

event: 'new_namespace'
Evento que se dispara cuando se crea un nuevo namespace en el servidor.

un namespace es un canal de comunicación independiente por defecto todos los sockets se conectan a la raiz pero se pueden crear otros.

const adminNamespace = io.of("/admin");
adminNamespace.on("connection", (socket) => {
  console.log("Un admin se conectó");
});


se crea un namespace para administradores y se inicializa
se puede crear un namespace usando .of("/nombre") o bien utilizando expresiones regulares.

crear namespaces dinámicos con expreciones regulares:

// Permitir cualquier namespace que empiece con /nsp-
io.of(/^\/nsp-\w+$/); 

io.on("new_namespace", (namespace) => {
  console.log("Nuevo namespace creado:", namespace.name);
});

- Atributos:
server.engine:
server.engine o io.engine es una referencia al servidor que es la base de transporte sobre la que funciona Socket.IO

Con esto puedes limitar a los clientes que se conectan simultaneamente.
ver estadísticas del motor.
personalizar el comportamiento del transport.

server.sockets
server.sockets o io.sockets es un alias del namespace raiz (/) que es lo mismo que io.of(/)

sirve para emitir un mensaje a todos los usuarios sin importar en que sala estén:

io.sockets.emit("mensaje", "Hola a todos");

io.of("/").emit("mensaje", "Hola a todos");

- Métodos:

métodos del objeto server:

- server.adapter([value])
Establece o recupera el "adaptador" que socket IO necesita para compartir estado entre multiples instancias.

- server.attach(...) y server.listen(...)
conecta el servidor de Socket.IO a un servidor HTTP o HTTPS

io.attach(httpServer)
io.attach(port)

io.listen(httpServer)
io.listen(port)

- server.close([callback])
Cierra los servidores Socket y HTTP y por consecuente desconecta a todos los clientes.

- server.disconnectSockets([close])
Desconecta a todos los sockets (clientes). (podrian ser todos o los de una sala específica).

- server.emit(...) 
Emiite mensajes a todos los clientes conectados.

- server.emitWithAck(...)
Emite un mensaje a todos los clientes conectados pero esperando una respuesta.

- server.except(rooms)
Emite mensaje a todos menos a la o salas especificadas.

- server.fetchSockets()
Recupera todos los sockets conectados y puede usarse para revisar si un usuario aun está conectado.

- server.in(room) o server.to(room)
Envia un mensaje a todos los usarios que estén conectados en una sala específica.

- server.use(fn)
Registra middleware para verificar o modificar sockets antes de aceptarlos 

- server.path([value])
Sirve una ruta en la que se sirve Socket.IO

- server.serverSideEmit(...)
Envia mensajes entre servidores de Socket en un cluster.

- FLAGS

-Local:
limíta las emisiones de evento solo para servidor actual sin compartirlo con otros servidores.

io.local.emit("alerta", { msg: "Este mensaje solo lo verán clientes conectados a este servidor." });


-volatile:
Emite un mensaje que se puede perder si el cliente no está listo para recibirlo (perdió la conexión o conexión lenta)
Ideal para datos que no son críticos.

io.volatile.emit("posicion", { x: 200, y: 300 });


Tambien se pueden combinar:
ejemplo:
io.local.volatile.emit("info", { msg: "solo este nodo, y si se pierde no importa" });

-Socket
Un socket es la clase principal que representa la coneccion entre un cliente y el servidor, simpre que un cliente se conecta al servidor, se crea un socket.

Un socket está relacionado a un namespace que es una ruta virtual hacia el servidor.
Así mismo un Socket tambien puede estar relacionado a un Room (una sala) gracias a su namespace.
Un socket se comporta como un EventEmitter de NodeJS es decir que puede escuchar eventos con .on y emitirlos con .emit

ejemplo simple de socket:

io.on("connection", socket => {
  console.log("Un cliente se conectó");

  socket.join("room1"); // se une a una room

  socket.on("saludo", data => {
    console.log("Cliente dijo:", data);
  });

  socket.emit("bienvenida", "¡Bienvenido!"); // evento solo para ese cliente

  socket.to("room1").emit("noticia", "Un nuevo usuario se unió"); // broadcast a room
});


- Eventos:
-event: 'disconnect'
Evento que se ejecuta cuando el cliente se desconecta del servidor

ejemplo:
io.on("connection", (socket) => {
  socket.on("disconnect", (reason) => {
    console.log("Se desconectó por:", reason);
  });
});

reason:
es una cadena de texto que explica el motivo por el que se desconectó del servidor.

| Reason                    | Descripción                                                                 |
|---------------------------|-----------------------------------------------------------------------------|
| `server namespace disconnect` | El servidor forzó la desconexión con `socket.disconnect()`                     |
| `client namespace disconnect` | El cliente llamó manualmente a `socket.disconnect()`                            |
| `server shutting down`        | El servidor se está apagando                                                  |
| `ping timeout`                | El cliente no respondió a un ping en el tiempo configurado (`pingTimeout`)    |
| `transport close`            | Se cerró la conexión (por ejemplo, el usuario perdió conexión)               |
| `transport error`            | Error de conexión de transporte                                              |
| `parse error`                | El servidor recibió un paquete mal formado                                   |
| `forced close`               | Igual que `parse error`; el servidor cerró la conexión                       |
| `forced server close`        | El cliente no se unió al namespace a tiempo (`connectTimeout`)               |

-event: 'disconnecting'
evento que se dispara antes de que el socket se desconecte del servidor util si se va a notificar a otros usuarios.

ejemplo de uso:
io.on("connection", (socket) => {
  socket.on("disconnecting", (reason) => {
    console.log(socket.rooms); // El socket aún pertenece a sus salas
  });
});

NOTA: No usar socket.emit("disconnect")
disconnect, connect, connect_error, disconnecting, newListener y removeListener son eventos especiales del sistema. No debes emitirlos tú mismo como si fueran eventos personalizados.

- Atributos:
-socket.client:
Es una referencia al objeto cliente y permite acceder al objeto cliente de bajo nivel si se necesita un control profundo.

-socket.conn:
Es la conexion de transporte que usa engine.io. Permite controlar o escuchar eventos de transporte de red

console.log(socket.conn.transport.name); // "polling" o "websocket"

ejemplos de eventos:
socket.conn.on("upgrade", () => { /* Se mejoró a WebSocket */ });
socket.conn.on("packet", (p) => { /* Se recibió paquete */ });
socket.conn.on("heartbeat", () => { console.log("latido"); });

-socket.data:
Objeto que permite guardar datos personaliados por usuario. (por ejemplo nombre de usuario).

socket.data.username = "alice";

const sockets = await io.fetchSockets();
console.log(sockets[0].data.username); // "alice"

-socket.handshake:
contiene los detalles del saludo o "apretón de manos" inicial

ejemplo:
console.log(socket.handshake.address); // IP del cliente
console.log(socket.handshake.query);   // parámetros de la URL

| Campo     | Significado                      |
| --------- | -------------------------------- |
| `headers` | Encabezados HTTP iniciales       |
| `address` | IP del cliente                   |
| `secure`  | Si usó HTTPS                     |
| `query`   | Parámetros de la URL             |
| `auth`    | Datos enviados para autenticarse |

-socket.id:
Es un identificador único del socket (este ID cambia cuando el usuario se reconecta o refresca la página).

-socket.recovered
Indica si un socket recupero su estado como salas o datos tras reconectarse

ejemplo:
if (socket.recovered) {
  // reconexión con estado restaurado
} else {
  // nueva conexión
}

-socket.request:
Permite acceder a la solicitud HTTP inicial 

const userAgent = socket.request.headers['user-agent'];

para eliminarla:

delete socket.conn.request;

-socket.rooms:
Muestra las salas a las que pertenece el socket. por default siempre está en la sala con su propio ID.

ejemplo:
console.log(socket.rooms); // Set { socket.id }

socket.join("room1");
console.log(socket.rooms); // Set { socket.id, "room1" }

- Métodos:
-socket.compress(value)
Indica si el siguiente mensaje será comprimido. Por defecto el valor es TRUE.

ejemplo:
socket.compress(false).emit("uncompressed", "sin compresión");

-socket.disconnect([close])
Desconecta el socket. si close = TRUE cierra la conexión.

ejemplo:
setTimeout(() => socket.disconnect(true), 5000); // Desconecta a los 5 segundos


-socket.emit(eventName[, ...args][, ack])
Envia un evento específico al cliente

eventName - el nombre del evento que se envia (puede ser string o symbol)
args - una o más variables/datos que se desea enviar al cliente.
ack - una función de confirmación (opcional)

ejemplo:
socket.emit("saludo", "hola cliente");

// Con confirmación del cliente
socket.emit("pregunta", "¿Todo bien?", (respuesta) => {
  console.log(respuesta); // "sí"
});

-socket.emitWithAck(eventName[, ...args])
Envia un evento específico al cliente pero devuelve una promesa la cual se resuelve una vez el cliente responde (a diferencia de la anterior aquí la respuesta es obligatoria).

const respuesta = await socket.emitWithAck("ping");

-socket.eventNames():
devuelve los nombres de todos los eventos registrados en un socket

console.log(socket.eventNames());

-socket.except(rooms):
Excluye habitaciones específicas de un brodcast

ejemplo:
socket.except("room1").emit("mensaje", "A todos excepto room1");

-socket.in(room)
Es lo mismo que socket.to(room)

-socket.join(room)
Une al socket a una o más salas.

ejemplo:
socket.join("room123");

-socket.leave(room):
Salir de una sala:

ejemplo:
socket.leave("room123");

-socketListenersAny():
Devuelve a todos los oyentes registrados con onAny.

-socket.listenersAnyOutgoing():
Devuelve todos los oyentes registrados con onAnyOutgoing.

-socket.offAny([listener])
Sirve para eliminar un oyente de tip onAny

-socket.offAnyOutgoing([listener])
Elimina un oyente de tipo onAnyOutgoing.

-socket.on(eventName callback)
escucha un evento desde el clinete.

ejemplo:
socket.on("mensaje", (data) => {
  console.log(data);
});

-socket.onAny(callback)
Escucha todos los eventos que llegan al socket.

ejemplo:
socket.onAny((evento, ...args) => {
  console.log(`Evento recibido: ${evento}`, args);
});

-socket.onAnyOutgoing(callback)
escucha todos los eventos salientes desde el servidor hasta el cliente 

-socket.once(eventName, callback)
Hace lo mismo que socket.on pero se ejecuta una sola vez.

-socket.prependAny(callback)
agrega un oyente onAny al principio de una lista.

-socket.prependAnyOutgoing(callback)
agrega un oyente onAny para las salidas al principio de una lista.

-socket.removeAllListeners([eventName])
Elimina todos los oyentes del evento especificado (o de todos los eventos si no se especifíca ese parámetro).

-socket.removeListener(eventName, listener)
Elimina un oyente específico de un evento específico.

-socket.send([...args][, ack])
Es lo mismo que socket.emit("message", ...).

-socket.timeout(ms)
Establee el tiempo máximo para esperar una confirmación (en milisegundos).

ejemplo:
socket.timeout(3000).emit("check", (err) => {
  if (err) {
    console.log("El cliente no respondió a tiempo.");
  }
});

-socket.to(room)
Envia a todos los sockets en la sala excepto a uno mismo.

ejemplo:
socket.to("salaX").emit("nuevo mensaje", "Hola a todos menos yo");

-socket.use(fn)
Intercepta los eventos antes de procesarlos:

socket.use(([evento, ...args], next) => {
  if (evento === "prohibido") return next(new Error("No autorizado"));
  next();
});

-FLAGS
Las banderas en el socket son modificadores que se usan justo antes de un emit para cambiar como se envia un evento.

-Brodcast:
Hace que el mensaje se envie a todos los clientes menos al que lo envió

-volatile:
hace que un evento sea descartable, es decir, si el usuario no está listo para el evento no se guarda ni se reintenta.

-CLIENT:
La clase cliente se crea automáticamente cuando un cliente se conecta y representa la conexión básica entre el servidor y un navegador o cliente. El cliente puede conectarse a varios namespaces cada uno de los namespaces crea una instancia socket pero todos pertenecen al mismo cliente.

- Atributos:
-client.conn:
Referencía a la conexion subyacente de Engine.IO.
Representa la conexion reay y se puede utilizar para cerrar conexión directamente o revisar su estado:

ejemplo:
io.on("connection", (socket) => {
  console.log("¿WebSocket?", socket.client.conn.transport.name); // "websocket" o "polling"
});

-client.request:
Devuelve la solicitud HTTP original que inició la conexión y puedes leer cookies, obtener el User-Agent, ver IP del cliente.

ejemplo:
io.on("connection", (socket) => {
  const userAgent = socket.client.request.headers["user-agent"];
  const cookies = socket.client.request.headers.cookie;
  
  console.log("Navegador:", userAgent);
  console.log("Cookies:", cookies);
});

- Engine:
io.engine es la instancia del servidor que trabaja bajo Socket.IO para gestionar las conexiones de baji nivel.

-Eventos:
connection_error:
Evento que courre cuendo una conexión ocurre de forma anormal 

Para verlo:
io.engine.on("connection_error", (err) => {
  console.log(err.req);      // la solicitud HTTP original
  console.log(err.code);     // código del error
  console.log(err.message);  // mensaje del error
  console.log(err.context);  // información adicional
});

| Código | Mensaje                        | Significado                                         |
| ------ | ------------------------------ | --------------------------------------------------- |
| 0      | "Transport unknown"            | El tipo de transporte no es válido                  |
| 1      | "Session ID unknown"           | El ID de sesión no fue encontrado o expiró          |
| 2      | "Bad handshake method"         | Método HTTP incorrecto para el handshake            |
| 3      | "Bad request"                  | Formato de solicitud no válido                      |
| 4      | "Forbidden"                    | Acceso denegado, por ejemplo, por políticas de CORS |
| 5      | "Unsupported protocol version" | Versión de protocolo no soportada                   |

headers:
Sirve para personalizar los headers de respuesta en las solicitudes HTTP:

ejemplo:
import { serialize, parse } from "cookie";

io.engine.on("headers", (headers, request) => {
  if (!request.headers.cookie) return;

  const cookies = parse(request.headers.cookie);
  
  if (!cookies.randomId) {
    headers["set-cookie"] = serialize("randomId", "abc", { maxAge: 86400 }); // 1 día
  }
});

initial_headers:
similar a headers, con la diferencia de que se ejecuta una sola vez en la primera solicitud HTTP del cliente. Sirve para configurar cookies o headers iniciales.

ejemplo:
import { serialize } from "cookie";

io.engine.on("initial_headers", (headers, request) => {
  headers["set-cookie"] = serialize("uid", "1234", { sameSite: "strict" });
});

-Atributos:
io.engine.clientsCount
este atributo representa la cantidad de conexiones de bajo nivel que están activas en Socket.IO

ejemplo:
const count = io.engine.clientsCount;
console.log(count); // muestra cuántos clientes están conectados actualmente

-Métodos:
-engine.generateId:
Se usa para geerar un ID de sesión punico para cada cliente conectado. (por defeto usa base64id() pero es posible usar uuid)

-engine.handleUppgrade(request, socket, head)
Permite manejar manualmente las solicitudes de acualización de conexión de HTTP a WebSocket.

requuest: la solicitud HTTP entrante.
socket: el socket de red entre el servidor y cliente.
head: el primer fragmento de stream websocket (puede estár vacío).

-engine.use(middleware):
permite añadir middleware tipo express al servidor Engine.IO. El middleware se ejecutará tras cada solicitud HTTP.

ejemplo:
io.engine.use((req, res, next) => {
  // puedes modificar headers, validar sesiones, etc.
  next();
});

















