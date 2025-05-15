//import { sayHello } from "./utils.js"; // :x:

// El error da por que al tener default no se necesita poner las llaves al hacer el import, asi que o
// se elimina el default o se eliminan las llaves (en este caso el default en el archivo utils)
import { sayHello } from "./utils.js";  // Import nombrado con llaves
sayHello();