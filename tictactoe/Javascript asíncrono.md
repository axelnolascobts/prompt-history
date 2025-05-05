Javascript asíncrono:

Básicamente ejecutar una tarea de larga duración pero poder resolver varios eventos mientras tanto.
No hay que tener que esperar a que termine una tarea para comenzar otra.

Tareas asíncronas:
peticiones HTTP: fetch()
acceder al microfono o cámara de un usuario getUserMedia()
que el usuario seleccione archivos showOpenFilePicker()

Manejadores de eventos:
en lugar de ejecutarse sincronamente se ejecutan cuando ocurre un evento.

XMLHttpRequest es una API que permite hacer peticiones HTTP a un servidor remoto usando JavaScript

los eventos no son necesariamente eventos provocados por el usuario, si no pueden ser consecuencia de un cambio de estado.

CALLBACKS:
los manejadores de eventos son un tipo especial de callback.
un callback es una funcion que se pasa a otra función esperando que el callback sea llamado en el momento adecuado. 

por cuestion de manejo de errores las nuevas APIs no utilizan callback si no "promise"

Promise: es un objeto que representa la eventual finalizacion o falla de una tarea asíncrona y su valor resultante.

estados de promise:
pending (pendiente) - fetch()
fulfilled (cumplida) - then()
rejected (rechazada) - catch()

Promise.prototype.then() puede tomar hasta dos argumentos, que son: callback en caso de cumplir la promesa y una funcion en caso de un rechazo.

Promise.prototype.catch() en escencia solo obtiene la funcion en caso de una promesa rechazada.

Manejo de errores:
La API fetch() puede mandar errores por muchas razones:
por ejemplo, no había conexión de red o el url se malformó.
para el manejo de errores se llama catch()
si se añade catch() al final de una cadena de promesas entonces se llamará cuando cualqiera falle.

settled - Se utiliza tanto para describir una proemra rechazada como una cumplida.
resolved - se utiliza para una promesa settled o una promesa ciclada para poder continuar con la siguiente.

Combinación de promesas:
La cadena de promesas es lo que se usa cuando la operacion consiste de varias funciones asíncronas y es necesario que cada una se complete antes de empezar con la siguiente.

Aveces es necesario completar todas las promesas pero no son dependientes una de otra, solo necesitas ejecutarlas a la vez y notificar cuando todas se cumplan.

el método Promise.all() toma una serie de promesas y devuelve una sola.

devuelve then() cuando todas las promesas se cumplieron.
devuelve catch() cuando alguna promeza se rechazó.

aveces solo es necesario que se cumpla una sola promeza de una cadena, aunque no importa cual, para esos casos se utiliza el método Promise.any() aquí se cumple en cuanto se cumple una de las promesas, a menos que todas sean rechazadas.

ASYNC And AWAIT

la palabra reservada async se coloca antes de una función y esto sirve para indicar que esa función será asíncrona.

la palabra reserada await se utiliza dentro de una funcion async, e indica que ahí esperará hasta que una promesa se resuelva. 

en caso de uso de un await se puede hacer uso de try catch para el manejo de errores como en un código cnvencional.

NOTA IMPORTANTE: las funciones async siempre retornan promesas.


