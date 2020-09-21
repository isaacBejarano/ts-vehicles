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
// Wheels
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
// Regexp
var regexPlate = new RegExp(/^[0-9]{4}[a-zA-Z]{3}$/); // "Plate" has 4 digits followed by 3 letters
var regexDiameter = new RegExp(/^([0]\.[5-9])|([1]\.[0-9]{1,2})$/); // "Diameter" bigger than 0.4" and smaller than 2"
// validatePlate + validateBeforeCreateCar
var feedbackPlate = document.querySelector("[name = " + inputPlate.name + "] ~ div.invalid-feedback"); // ! => object not null
/* EVENTS */
// 1. validate "plate" + create Car
formCreateCar.addEventListener("submit", function (e) {
    validateBeforeCreateCar(e);
});
// 2. validate "wheel" + add Wheel to Car
formAddWheels.addEventListener("submit", function (e) {
    validateBeforeAddWheel(e);
});
// Utility -> validate "plate" CSS
inputPlate.addEventListener("blur", function () {
    validateInputPlate(this);
});
// Utility -> validate "wheel.diameter" CSS
var inputsWheelLength = formAddWheels.elements.length - 1; // (4 brands + 4 diameters -1 button)
var _loop_1 = function (i) {
    formAddWheels.elements[i].addEventListener("blur", function () {
        validateInputDiameter(formAddWheels.elements[i]);
    });
};
for (var i = 0; i < inputsWheelLength; i += 2) {
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
    // const inputsWheelLength = formAddWheels.elements.length - 1; /// (4 brands + 4 diameters -1 button)
    var errorCount = 0;
    for (var i = 0; i < inputsWheelLength; i += 2) {
        var diameter = formAddWheels.elements[i]; // i: 0, 2, 4, 6
        var brand = formAddWheels.elements[i + 1]; // i: 1, 3, 5, 7
        var diameterWheelFeedback = document.querySelector("[name = " + diameter.name + "] ~ div.invalid-feedback"); // ! Element not null
        diameters.push(diameter);
        brands.push(brand);
        console.log(typeof diameter.value, diameter); //str "0.34"
        console.log(regexDiameter.test(diameter.value)); //str "0.34"
        // validate +Diameter (parsed int) CSS
        if (!regexDiameter.test(diameter.value)) {
            formAddWheels.elements[i].classList.add("is-invalid");
            diameterWheelFeedback.textContent = '"Diameter" must be bigger than 0.4" and smaller then 2"';
            errorCount++;
        }
        else
            formAddWheels.elements[i].classList.remove("is-invalid"); // clear CSS for next Car's Wheels
    }
    // submit || prevent
    errorCount === 0 ? addWheelsToCurrentCar(e, diameters, brands) : (e.preventDefault(), e.stopPropagation());
}
/* UTILITY */
// validate "plate" CSS
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
// validate "wheel.diameter" CSS
function validateInputDiameter(ref) {
    console.log(typeof ref.value, ref.value);
    // if (regexDiameter.test(ref.value)) {
    // 	console.log(ref.value);
    // } else console.log("regex ERROR");
    // if (regexPlate.test(ref.value)) {
    // 	ref.classList.remove("is-invalid");
    // 	ref.classList.add("is-valid");
    // } else {
    // 	ref.classList.add("is-invalid");
    // 	feedbackPlate.textContent = '"Plate" must have 4 digits followed by 3 letters';
    // }
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
