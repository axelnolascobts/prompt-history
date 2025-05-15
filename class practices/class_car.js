class Car {
  constructor(brand, model, year) {
    this.brand = brand;
    this.model = model;
    this.year = year;
  }

  getCarInfo() {
    return `Car: ${this.brand} ${this.model}, Year: ${this.year}`;
  }

  static compareYears(car1, car2) {
    if (car1.year > car2.year) {
      return `${car1.model} is newer than ${car2.model}`;
    } else if (car1.year < car2.year) {
      return `${car2.model} is newer than ${car1.model}`;
    } else {
      return `${car1.model} and ${car2.model} are from the same year`;
    }
  }
}

class ElectricCar extends Car {
  constructor(brand, model, year, batteryLife) {
    super(brand, model, year);
    this.batteryLife = batteryLife;
  }

  getCarInfo() {
    return `${super.getCarInfo()} - Battery Life: ${this.batteryLife} hours`;
  }
}

const car1 = new Car('Toyota', 'Corolla', 2018);
const car2 = new Car('Honda', 'Civic', 2020);
console.log(car1.getCarInfo());
console.log(Car.compareYears(car1, car2));

const tesla = new ElectricCar('Tesla', 'Model S', 2022, 24);
console.log(tesla.getCarInfo());

const user = {
  name: "Alice",
  greet: function () {
    console.log(`Hello, my name is ${this.name}`);
  },
};


const greetFn = user.greet;
// fix it with .bind, .call and .apply
user.greet.bind(user);
user.greet.call(user);
user.greet.apply(user);
greetFn(); // :x: Why doesn't this work?

  // it doesnt work because the .this lose the context and dont longer refers to user

