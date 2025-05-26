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










