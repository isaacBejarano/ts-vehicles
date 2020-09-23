"use strict";
/* GLOBALS */
var cars = []; // collection of Car
/* REFS */
// 1.0 forms
var formCreateCar = document.getElementById("form_create_car");
var formAddWheels = document.getElementById("form_add_wheels");
// 2.1 Car's inputs
var inputPlate = document.getElementById("input_plate");
var inputBrand = document.getElementById("input_brand");
var inputColor = document.getElementById("input_color");
// 2.2 Plate's Regexp()
var regexPlate = new RegExp(/^[0-9]{4}[a-zA-Z]{3}$/); // "Plate" has 4 digits followed by 3 letters
// 2.3 feedbackPlate -> validatePlate + validateBeforeCreateCar
var feedbackPlate = document.querySelector("#" + inputPlate.id + " ~ div.invalid-feedback");
// 3.1 Wheel's inputs
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
// 3.2 wheelsLength -> validateDiameter + validateBeforeAddWheel
var wheelsLength = formAddWheels.length - 1; // (+4 brands + 4 diameters -1 button)
// 4.0 Outlet - created Car
var carInfo = document.getElementById("carInfo");
// 4.1 Outlet - List Of Cars <button>
var btnShowAllCars = document.getElementById("btn-show-all-cars");
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
        validateDiameter(formAddWheels.elements[i]); // [i] -> [0, 2, 4, 6]
    });
};
// 4. Utility -> validate "wheel.diameter" CSS
for (var i = 0; i < wheelsLength; i += 2) {
    _loop_1(i);
}
// 5. Utility -> List of Cars
btnShowAllCars.addEventListener("click", showListOfCars);
/* VALIDATION */
// 1. validate "plate" value
function validateBeforeCreateCar(e) {
    // (pre) style -> Case
    var plate = inputPlate.value.toUpperCase();
    var brand = FirstUpperCase(inputBrand.value);
    var color = FirstUpperCase(inputColor.value);
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
    var diameters = [];
    var brands = [];
    var errorCount = 0;
    for (var i = 0; i < wheelsLength; i += 2) {
        var diameter = formAddWheels.elements[i]; // [i] -> [0, 2, 4, 6]
        var brand = formAddWheels.elements[i + 1]; // [i] -> [1, 3, 5, 7]
        var feedbackDiameter = document.querySelector("[name = " + diameter.name + "] ~ div.invalid-feedback");
        diameters.push(diameter);
        brands.push(brand);
        // validate +Diameter (parsed int) CSS
        if (+diameter.value <= 0.4 || +diameter.value >= 2) {
            formAddWheels.elements[i].classList.add("is-invalid");
            feedbackDiameter.textContent = '"Diameter" must be bigger than 0.4" and smaller then 2"';
            errorCount++;
        }
    }
    // submit || prevent
    errorCount === 0 ? addWheelsToCurrentCar(e, diameters, brands) : (e.preventDefault(), e.stopPropagation());
}
/* LIB */
function createCar(e, plate, color, brand) {
    // new Car
    var car = new Car(plate, color, brand);
    // outlet
    var outletCar = document.querySelectorAll("#carInfo p span"); // <- plate, brand, color
    // 1. car of cars
    cars.push(car);
    // 2. toString -> #carInfo p <span>
    outletCar[0].textContent = "" + (cars.indexOf(car) + 1);
    outletCar[1].textContent = car.plate;
    outletCar[2].textContent = car.brand;
    outletCar[3].textContent = car.color;
    // 3. form's CSS
    carInfo.classList.remove("is-none"); // diabled for the rest of life cycle
    formCreateCar.classList.add("is-none");
    formAddWheels.classList.remove("is-none");
    // 4. prevent submit + reset form for next Car's inputs
    formPreventAndReset(e, formCreateCar);
}
function addWheelsToCurrentCar(e, diameters, brands) {
    var length = diameters.length; // === brands.length
    var outletWheel = document.querySelectorAll("#carInfo ul li span"); // <- diameter / brand
    for (var i = 0; i < length; i++) {
        var parsedDiameter = +diameters[i].value;
        var capitalCasedBrand = FirstUpperCase(brands[i].value);
        var wheel = new Wheel(parsedDiameter, capitalCasedBrand);
        var brandToString = capitalCasedBrand !== "" ? capitalCasedBrand : "not specified";
        // 1. add Wheel to Car
        cars[cars.length - 1].addWheel(wheel);
        // 2. toString -> #carInfo ul li <span>
        outletWheel[i].textContent = "Brand: " + brandToString + " / Diameter: " + parsedDiameter + "\""; // e.g. Firestone / 1.5"
    }
    // 3. form's CSS
    formCreateCar.classList.toggle("is-none"); // show Car's form for next Car's input
    formAddWheels.classList.toggle("is-none"); // hide Wheel's form
    // 4. prevent submit + clear Wheel's for next Wheel's input
    for (var i = 0; i < wheelsLength; i += 2) {
        formAddWheels.elements[i].classList.remove("is-valid"); // clear inputs for next Wheel'sform
    }
    // 5. prevent submit + reset form for next Wheel's inputs
    formPreventAndReset(e, formAddWheels);
}
/* AUX */
function FirstUpperCase(value) {
    return value.substr(0, 1).toUpperCase() + value.substr(1, value.length - 1).toLowerCase();
}
function formPreventAndReset(e, ref) {
    e.preventDefault();
    e.stopPropagation();
    ref.reset();
}
/* UTILITY */
// 3. validate "plate" CSS
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
// 4. validate "wheel.diameter" CSS
function validateDiameter(diameter) {
    var feedbackDiameter = document.querySelector("[name = " + diameter.name + "] ~ div.invalid-feedback");
    if (+diameter.value <= 0.4 || +diameter.value >= 2) {
        diameter.classList.add("is-invalid");
        feedbackDiameter.textContent = '"Diameter" must be bigger than 0.4" and smaller then 2"';
    }
    else {
        diameter.classList.remove("is-invalid");
        diameter.classList.add("is-valid");
    }
}
// 5. List of Cars
function showListOfCars() {
    var outletLength = cars.length;
    var outletList = document.getElementById("list-all-cars");
    for (var i = 0; i < outletLength; i++) {
        // 1. clone
        var outletCloned = carInfo.cloneNode(true);
        var outletWheelsLength = outletCloned.children[7].children.length;
        // 2. id + class
        outletCloned.id = "carinfo-" + (i + 1);
        outletCloned.classList.replace("bg-light", "bg-dark");
        outletCloned.classList.replace("text-primary", "text-light");
        // 3. append cloned + toggle display
        outletList.append(outletCloned);
        outletCloned.classList.toggle("is-none");
        // 4.1 CSS - Car <span>
        outletCloned.children[0].children[1].classList.replace("text-dark", "text-light");
        outletCloned.children[2].children[1].classList.replace("text-dark", "text-light");
        outletCloned.children[3].children[1].classList.replace("text-dark", "text-light");
        outletCloned.children[4].children[1].classList.replace("text-dark", "text-light");
        // 4.2 CSS - Wheels <span>
        for (var j = 0; j < outletWheelsLength; j++) {
            outletCloned.children[7].children[j].children[2].classList.replace("text-dark", "text-light");
        }
        // 5.1 toString - Car
        console.log(outletLength);
        // 5.2 toString - Wheel
    }
}
// TEST
cars = [new Car("car1", "1", "1"), new Car("car2", "2", "2"), new Car("car3", "3", "3"), new Car("car4", "4", "4")];
