"use strict";
/* GLOBALS */
var cars = []; // collection of Car
var Forms;
(function (Forms) {
    Forms[Forms["form_create_car"] = 0] = "form_create_car";
    Forms[Forms["form_add_wheels"] = 1] = "form_add_wheels";
})(Forms || (Forms = {}));
var inputCar;
(function (inputCar) {
    inputCar[inputCar["input_plate"] = 0] = "input_plate";
    inputCar[inputCar["input_brand"] = 1] = "input_brand";
    inputCar[inputCar["input_color"] = 2] = "input_color";
})(inputCar || (inputCar = {}));
var inputWheels;
(function (inputWheels) {
    inputWheels[inputWheels["wheel_FL_diameter"] = 0] = "wheel_FL_diameter";
    inputWheels[inputWheels["wheel_FL_brand"] = 1] = "wheel_FL_brand";
    inputWheels[inputWheels["wheel_FR_diameter"] = 2] = "wheel_FR_diameter";
    inputWheels[inputWheels["wheel_FR_brand"] = 3] = "wheel_FR_brand";
    inputWheels[inputWheels["wheel_RL_diameter"] = 4] = "wheel_RL_diameter";
    inputWheels[inputWheels["wheel_RL_brand"] = 5] = "wheel_RL_brand";
    inputWheels[inputWheels["wheel_RR_diameter"] = 6] = "wheel_RR_diameter";
    inputWheels[inputWheels["wheel_RR_brand"] = 7] = "wheel_RR_brand";
})(inputWheels || (inputWheels = {}));
// Refs -> Forms
var formCreateCar = document.forms[Forms.form_create_car];
var formAddWheels = document.forms[Forms.form_add_wheels];
// NOTE: Dynamic <form> acces via 'string' is not normative -> use 'number' index instead
// Refs -> inputs
var inputPlate = formCreateCar.elements[inputCar.input_plate];
var inputBrand = formCreateCar.elements[inputCar.input_brand];
var inputColor = formCreateCar.elements[inputCar.input_color];
// Outlet
var carInfo = document.getElementById("carInfo"); // ! => object not null
var carInfoUlLiSpans = document.querySelectorAll("#carInfo ul li span");
// Regexp
var regexPlate = new RegExp(/^[0-9]{4}[a-zA-Z]{3}$/); // (pre) "Plate" must have 4 digits followed by 3 letters
var feedbackPlate = document.querySelector("[name = " + inputPlate.name + "] ~ div.invalid-feedback"); // ! => object not null
/* EVENTS */
formCreateCar.addEventListener("submit", function (e) {
    validateBeforeCreateCar(e); // values
});
inputPlate.addEventListener("blur", function () {
    validateInputPlate(this); // CSS
});
formAddWheels.addEventListener("submit", addWheelsToCurrentCar);
/* VALIDATION */
function validateBeforeCreateCar(e) {
    // (pre) "Brand" style -> Case
    var plate = inputPlate.value.toUpperCase();
    var brand = FirstUpperCase(inputBrand.value);
    var color = FirstUpperCase(inputColor.value);
    // 1. PLATE
    if (regexPlate.test(plate)) {
        inputPlate.classList.remove("is-valid"); // clear CSS for next input Car
        createCar(e, plate, color, brand);
    }
    else {
        inputPlate.classList.add("is-invalid");
        feedbackPlate.textContent = '"Plate" must have 4 digits followed by 3 letters';
        e.preventDefault();
        e.stopPropagation();
    }
    // 2. WHEELS
}
function validateInputPlate(ref) {
    if (regexPlate.test(ref.value)) {
        ref.classList.remove("is-invalid");
        ref.classList.add("is-valid");
    }
    else {
        ref.classList.add("is-invalid");
        feedbackPlate.textContent = '"Plate" must have 4 digits followed by 3 letters';
    }
}
/* LIB */
function createCar(e, plate, color, brand) {
    // outlet
    var carInfoSpans = document.querySelectorAll("#carInfo p span");
    // new vehicle
    var car = new Car(plate, color, brand);
    // car of cars
    cars.push(car);
    // toString -> <span>
    carInfoSpans[0].textContent = "" + (cars.indexOf(car) + 1);
    carInfoSpans[1].textContent = car.plate;
    carInfoSpans[2].textContent = car.brand;
    carInfoSpans[3].textContent = car.color;
    // toString -> <ul><li> -> clear previous wheels
    for (var i = 0; i < carInfoUlLiSpans.length; i++) {
        carInfoUlLiSpans[i].textContent = "";
    }
    // CSS
    carInfo.classList.remove("is-none");
    formCreateCar.classList.add("is-none");
    formAddWheels.classList.remove("is-none");
    // prevent submit + clear input
    formPreventAndReset(e, formCreateCar);
}
function addWheelsToCurrentCar(e) {
    // wheel 1
    var inputWheelBrandFL = formAddWheels.elements[inputWheels.wheel_FL_brand];
    var inputWheelDiameterFL = formAddWheels.elements[inputWheels.wheel_FL_diameter];
    // wheel 2
    var inputWheelDiameterFR = formAddWheels.elements[inputWheels.wheel_FR_diameter];
    var inputWheelBrandFR = formAddWheels.elements[inputWheels.wheel_FR_brand];
    // wheel 3
    var inputWheelDiameterRL = formAddWheels.elements[inputWheels.wheel_RL_diameter];
    var inputWheelBrandRL = formAddWheels.elements[inputWheels.wheel_RL_brand];
    // wheel 4
    var inputWheelDiameterRR = formAddWheels.elements[inputWheels.wheel_RR_diameter];
    var inputWheelBrandRR = formAddWheels.elements[inputWheels.wheel_RR_brand];
    // (pre) "Brand" style -> Case
    var brandFL = FirstUpperCase(inputWheelBrandFL.value);
    var brandFR = FirstUpperCase(inputWheelBrandFR.value);
    var brandRL = FirstUpperCase(inputWheelBrandRL.value);
    var brandRR = FirstUpperCase(inputWheelBrandRR.value);
    // .addWheel() <- (pre) +"Diameter" is int
    cars[cars.length - 1].addWheel(new Wheel(+inputWheelDiameterFL.value, brandFL));
    cars[cars.length - 1].addWheel(new Wheel(+inputWheelDiameterFR.value, brandFR));
    cars[cars.length - 1].addWheel(new Wheel(+inputWheelDiameterRL.value, brandRL));
    cars[cars.length - 1].addWheel(new Wheel(+inputWheelDiameterRR.value, brandRR));
    // toString -> <ul><li>
    for (var i = 0; i < carInfoUlLiSpans.length; i++) {
        var brandToString = cars[cars.length - 1].wheels[i].brand
            ? cars[cars.length - 1].wheels[i].brand + " /"
            : "No brand specified /";
        var diameterToString = cars[cars.length - 1].wheels[i].diameter > 0
            ? cars[cars.length - 1].wheels[i].diameter + '"'
            : "No diameter specified";
        carInfoUlLiSpans[i].textContent = brandToString + " " + diameterToString; // e.g. Firestone 15.5"
    }
    // CSS
    formCreateCar.classList.toggle("is-none");
    formAddWheels.classList.toggle("is-none");
    // prevent submit + clear input
    formPreventAndReset(e, formAddWheels);
}
function showListOfVehicles() {
    // ON
    // OFF
}
// AUX
function FirstUpperCase(value) {
    return value.substr(0, 1).toUpperCase() + value.substr(1, value.length - 1).toLowerCase();
}
function formPreventAndReset(e, ref) {
    e.preventDefault();
    e.stopPropagation();
    ref.reset(); // clear input
}
