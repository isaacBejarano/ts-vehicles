"use strict";
/* GLOBALS */
var cars = []; // Cars collection
// DOM REFS
var formCreateCar = document.querySelector("form"); // (!) =>  not null && HTMLFormElement
var inputPlate = document.querySelector('[name="input_plate"]');
var inputBrand = document.querySelector('[name="input_brand"]');
var inputColor = document.querySelector('[name="input_color"]');
/* EVENTS */
formCreateCar.addEventListener("submit", function (e) {
    createCar(e, inputPlate.value, inputBrand.value, inputColor.value);
});
/* AUX */
function createCar(e, plate, brand, color) {
    var carInfo = document.getElementById("carInfo");
    var car = new Car(plate, color, brand);
    car.addWheel(new Wheel(16, "Firestone"));
    // car of cars
    cars.push(car);
    // toString
    carInfo.innerHTML = "\n\t\t<i class=\"fas fa-car\"></i>\n\t\tCAR: <span class=\"text-dark\">" + (cars.indexOf(car) + 1) + "</span> </br>\n\t\t<i class=\"far fa-address-card\"></i>\n\t\tPLATE: <span class=\"text-dark\">" + car.plate + "</span> </br>\n\t\t<i class=\"fas fa-palette\"></i>\n\t\tCOLOR: <span class=\"text-dark\">" + car.color + "</span> </br>\n\t\t<i class=\"fas fa-signature\"></i>\n\t\tBRAND: <span class=\"text-dark\">" + car.brand + "</span> </br>\n\t\t<i class=\"fas fa-dot-circle\"></i>\n\t\tWHEELS: <span class=\"text-dark\">\n\t\t\t" + +car.wheels[car.wheels.length - 1].diameter + " inches.\n\t\t\t" + car.wheels[car.wheels.length - 1].brand + "\t\t\t\n\t\t\t</span> </br>\n\t";
    carInfo.classList.remove("is-none");
    // prevent submit
    e.preventDefault();
    e.stopPropagation();
}
