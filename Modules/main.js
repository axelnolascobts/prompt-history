import { default as sayHello } from "./utils.js"; // X
sayHello();

//El error en el export default ocurría porque en untils tenemos un export default y en main
// se está intentando hacer una exportación por nombre.
// La solucion es eliminar las llaves {} en el import de main, o bien,
// utilizar "default as" haciendo ahora si una importacion nombrada.