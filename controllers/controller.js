"use strict";
/* GLOBALS */
var cars = []; // collection of Car
/* REFS */
// forms
var formCreateCar = document.getElementById("form_create_car");
var formAddWheels = document.getElementById("form_add_wheels");
// 1.1 Car's inputs
var inputPlate = document.getElementById("input_plate");
var inputBrand = document.getElementById("input_brand");
var inputColor = document.getElementById("input_color");
// 1.2 Plate's Regexp()
var regexPlate = new RegExp(/^[0-9]{4}[a-zA-Z]{3}$/); // "Plate" has 4 digits followed by 3 letters
// 1.3 feedbackPlate -> validatePlate + validateBeforeCreateCar
var feedbackPlate = document.querySelector("#" + inputPlate.id + " ~ div.invalid-feedback"); // ! => object not null
// 2.1 Wheel's inputs
// wheel FL
var inputWheelBrandFL = document.getElementById("wheel_FL_brand");
var inputWheelDiameterFL = document.getElementById("wheel_FL_diameter");
// wheel FR
var inputWheelDiameterFR = document.getElementById("wheel_FR_diameter");
var inputWheelBrandFR = document.getElementById("wheel_FR_brand");
// wheel RL
var inputWheelDiameterRL = document.getElementById("wheel_RL_diameter");
var inputWheelBrandRL = document.getElementById("wheel_RL_brand");
// wheel RR
var inputWheelDiameterRR = document.getElementById("wheel_RR_diameter");
var inputWheelBrandRR = document.getElementById("wheel_RR_brand");
// 2.2 wheelsLength -> validateDiameter + validateBeforeAddWheel
var wheelsLength = formAddWheels.length - 1; // (4 brands + 4 diameters -1 button)
// 3. Outlet
var carInfo = document.getElementById("carInfo"); // ! => object not null
var carInfoUlLiSpans = document.querySelectorAll("#carInfo ul li span");
/* EVENTS */
// 1. validate "plate" + create Car
formCreateCar.addEventListener("submit", function (e) {
    validateBeforeCreateCar(e);
});
// 2. validate "wheel" + add Wheel to Car
formAddWheels.addEventListener("submit", function (e) {
    validateBeforeAddWheel(e);
});
// 3. Utility -> validate "plate" CSS
inputPlate.addEventListener("blur", function () {
    validateInputPlate(this);
});
var _loop_1 = function (i) {
    formAddWheels.elements[i].addEventListener("blur", function () {
        validateDiameter(formAddWheels.elements[i]); // diamneter[x] -> 0, 2, 4, 6
    });
};
// 3. Utility -> validate "wheel.diameter" CSS
for (var i = 0; i < wheelsLength; i += 2) {
    _loop_1(i);
}
/* VALIDATION */
// 1. validate "plate" value
function validateBeforeCreateCar(e) {
    // (pre) style -> Case
    var plate = inputPlate.value.toUpperCase();
    var brand = FirstUpperCase(inputBrand.value);
    var color = FirstUpperCase(inputColor.value);
    // PLATE
    if (regexPlate.test(plate)) {
        inputPlate.classList.remove("is-valid"); // clear CSS for next Car's Plate
        createCar(e, plate, color, brand);
    }
    else {
        inputPlate.classList.add("is-invalid");
        feedbackPlate.textContent = '"Plate" must have 4 digits followed by 3 letters';
        e.preventDefault();
        e.stopPropagation();
    }
}
// 2. validate "wheel" value
function validateBeforeAddWheel(e) {
    var diameters = []; // i -> odd. e.g. element 1, element3...
    var brands = []; // i+1 -> even. e.g. element 2, element4...
    var errorCount = 0;
    for (var i = 0; i < wheelsLength; i += 2) {
        var diameter = formAddWheels.elements[i]; // i: 0, 2, 4, 6
        var brand = formAddWheels.elements[i + 1]; // i: 1, 3, 5, 7
        var feedbackDiameter = document.querySelector("[name = " + diameter.name + "] ~ div.invalid-feedback"); // ! Element not null
        diameters.push(diameter);
        brands.push(brand);
        // validate +Diameter (parsed int) CSS
        if (+diameter.value <= 0.4 || +diameter.value >= 2) {
            formAddWheels.elements[i].classList.add("is-invalid");
            feedbackDiameter.textContent = '"Diameter" must be bigger than 0.4" and smaller then 2"';
            errorCount++;
        }
        // else formAddWheels.elements[i].classList.remove("is-valid"); // clear CSS for next Car's Plate
    }
    // submit || prevent
    errorCount === 0 ? addWheelsToCurrentCar(e, diameters, brands) : (e.preventDefault(), e.stopPropagation());
}
/* UTILITY */
// validate "plate" CSS
function validateInputPlate(plate) {
    if (regexPlate.test(plate.value)) {
        plate.classList.remove("is-invalid");
        plate.classList.add("is-valid");
    }
    else {
        plate.classList.add("is-invalid");
        feedbackPlate.textContent = '"Plate" must have 4 digits followed by 3 letters';
    }
}
// validate "wheel.diameter" CSS
function validateDiameter(diameter) {
    var feedbackDiameter = document.querySelector("[name = " + diameter.name + "] ~ div.invalid-feedback"); // ! Element not null
    if (+diameter.value <= 0.4 || +diameter.value >= 2) {
        diameter.classList.add("is-invalid");
        feedbackDiameter.textContent = '"Diameter" must be bigger than 0.4" and smaller then 2"';
    }
    else {
        diameter.classList.remove("is-invalid");
        diameter.classList.add("is-valid");
    }
}
function showListOfVehicles() {
    // ON
    // OFF
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
    carInfo.classList.remove("is-none"); // diabled for the rest of life cycle
    formCreateCar.classList.add("is-none");
    formAddWheels.classList.remove("is-none");
    // prevent submit + clear Car's for next Car's input
    formPreventAndReset(e, formCreateCar);
}
function addWheelsToCurrentCar(e, diameters, brands) {
    var length = diameters.length; // === brands.length
    for (var i = 0; i < length; i++) {
        var parsedDiameter = +diameters[i].value; // int
        var capitalCasedBrand = FirstUpperCase(brands[i].value);
        var wheel = new Wheel(parsedDiameter, capitalCasedBrand); // {}
        // 1. add Wheel to Car
        cars[cars.length - 1].addWheel(wheel);
        // 2. toString -> <ul><li>
        var brandToString = capitalCasedBrand !== "" ? capitalCasedBrand : "not specified";
        carInfoUlLiSpans[i].textContent = "Brand: " + brandToString + " / Diameter: " + parsedDiameter + "\""; // e.g. Firestone / 1.5"
    }
    // 3. form's CSS
    formCreateCar.classList.toggle("is-none"); // show Car's form for next Car's input
    formAddWheels.classList.toggle("is-none"); // hide Wheel's form
    // 4. prevent submit + clear Wheel's for next Wheel's input
    for (var i = 0; i < wheelsLength; i += 2) {
        formAddWheels.elements[i].classList.remove("is-valid"); // clear inputs for next Wheel'sform
    }
    formPreventAndReset(e, formAddWheels);
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
