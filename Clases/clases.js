"use strict"

class Car {
    constructor (brand, model, year) {
        this.brand = brand;
        this. model = model;
        this.year = year;
    }

    getCarInfo () {

        return `Brand: ${this.brand}, Model: ${this.model}, Year: ${this.year}`;
    }

    static compareYears (car1, car2) {

        return `Car 1 Year: ${car1.year}, Car 2 Year: ${car2.year}`;
    }

}

class ElectricCar extends Car{
    constructor (brand, model, year, batteryLife) {
        super(brand, model, year);
        this.batteryLife = batteryLife;
    }

    getCarInfo () {

        return `${super.getCarInfo()}, Battery Life: ${this.batteryLife} Ah`;
    }

}

const car1 = new Car ("Nissan", "Tsuru II", 1991);
const car2 = new ElectricCar ("Tesla", "Cyber Truck", 2024, 75);

console.log(car1.getCarInfo());
console.log(car2.getCarInfo());

console.log(Car.compareYears(car1, car2));

const user = {
  name: "Alice",
  greet: function () {
    console.log(`Hello, my name is ${this.name}`);
  },
};
const greetFn = user.greet;
greetFn();

// Why this.name is “undefined”?
// this.name is "undefned" because user its a constant, no is a class, so when we declarate
// greetFn = user.greet we lost the context of "this" into the "const user" 

//How can you fix this? (using bind, call or apply)

// we fix that with bind doing user.greet.bind(user); - keep the context
// we fix that with call using user.greet.call(user); - use in another context (I'm not sure)
// we fix that with apply using user.greet.apply(user); - make an array with the argument

const greetFnBind = user.greet.bind(user);
greetFnBind();

const greetFnCall = user.greet.call(user);
const greetFnApply = user.greet.apply(user);