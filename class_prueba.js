class Persona {
    constructor(nombre, edad) {
        this.nombre = nombre
        this.edad = edad
        
    }
    saludar () {
        console.log(`hola soy ${this.nombre} y tengo ${this.edad} años`);
    }

    static compararEdad(p1, p2) {
    if(p1.edad > p2.edad){
        console.log(`${p1.nombre} es mayor`)
    }else{
        console.log(`${p2.nombre} es mayor`)
    }
      }
}

/*const p = new Persona('Luis',30);
p.saludar();*/ 


  
  const a = new Persona('Ana', 35);
  const b = new Persona('Carlos', 28);
  console.log(Persona.compararEdad(a, b)); 



  class Empleado extends Persona {
    #salario;
    constructor(nombre, edad, salario) {
      // llama a super() y añade salario
      super(nombre,edad); //super solo se puede llamar una vez y debes poner todos sus valores
      this.#salario = salario;
    }
  
    info() {
        console.log(`${this.nombre}, ${this.edad} años, gana $${this.salario}`)
      // imprime: {nombre}, {edad} años, gana ${salario}
    }
    getSalario() {
        return this.#salario;
      }
    
  }
  


  const emp = new Empleado('Diana', 26, 30000);
  console.log(emp.getSalario());
  //console.log(emp.#salario);
  


