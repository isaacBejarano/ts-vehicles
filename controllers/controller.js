"use strict";
// GLOBAL
var cars = []; // Cars collection
// REFS
var Forms;
(function (Forms) {
    Forms[Forms["form_create_car"] = 0] = "form_create_car";
    Forms[Forms["form_add_wheels"] = 1] = "form_add_wheels";
})(Forms || (Forms = {}));
var Elements;
(function (Elements) {
    Elements[Elements["input_plate"] = 0] = "input_plate";
    Elements[Elements["input_brand"] = 1] = "input_brand";
    Elements[Elements["input_color"] = 2] = "input_color";
})(Elements || (Elements = {}));
var carInfo = document.getElementById("carInfo");
var formCreateCar = document.forms[Forms.form_create_car];
var formAddWheels = document.forms[Forms.form_add_wheels];
var inputPlate = formCreateCar.elements[Elements.input_plate];
var inputBrand = formCreateCar.elements[Elements.input_brand];
var inputColor = formCreateCar.elements[Elements.input_color];
// EVENTS
formCreateCar.addEventListener("submit", function (e) {
    createCar(inputPlate.value, inputBrand.value, inputColor.value);
    formPreventAndReset(e, this);
});
formAddWheels.addEventListener("submit", function (e) {
    formCreateCar.classList.remove("is-none"); // CSS
    formAddWheels.classList.add("is-none"); // CSS
    formPreventAndReset(e, this);
});
// AUX
function createCar(plate, brand, color) {
    var carInfoSpans = document.querySelectorAll("#carInfo p span");
    var car = new Car(plate, color, brand);
    car.addWheel(new Wheel(16, "Firestone"));
    cars.push(car); // car of cars
    // toString -> <span>
    carInfoSpans[0].textContent = "" + (cars.indexOf(car) + 1);
    carInfoSpans[1].textContent = car.plate;
    carInfoSpans[2].textContent = car.brand;
    carInfoSpans[3].textContent = car.color;
    carInfoSpans[4].textContent = "\n\t\t" + +car.wheels[car.wheels.length - 1].diameter + " inches.\n\t\t" + car.wheels[car.wheels.length - 1].brand;
    // CSS
    carInfo.classList.remove("is-none");
    formCreateCar.classList.add("is-none");
    formAddWheels.classList.remove("is-none");
}
function formPreventAndReset(e, ref) {
    // prevent submit
    e.preventDefault();
    e.stopPropagation();
    // clear input
    ref.reset();
}
