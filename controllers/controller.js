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
    var carInfoSpans = document.querySelectorAll("#carInfo p span");
    var car = new Car(plate, color, brand);
    car.addWheel(new Wheel(16, "Firestone"));
    cars.push(car); // car of cars
    // toString -> <span>
    carInfoSpans[0].textContent = "" + (cars.indexOf(car) + 1);
    carInfoSpans[1].textContent = car.plate;
    carInfoSpans[2].textContent = car.brand;
    carInfoSpans[3].textContent = car.color;
    carInfoSpans[4].textContent = +car.wheels[car.wheels.length - 1].diameter + " inches. " + car.wheels[car.wheels.length - 1].brand;
    carInfo.classList.remove("is-none"); // CSS overwrite
    // prevent submit
    e.preventDefault();
    e.stopPropagation();
}
