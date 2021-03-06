"use strict";
/* REFS + GLOBALS */
var cars = []; // collection of Car
// 1 Car's
var formCar = document.getElementById("form-create-car");
var lastCar; // last Car in cars
var btnCreateCar = document.getElementById("btn-create-car");
var carInfo = document.getElementById("car-info");
var carInfoInstance = document.getElementById("car-info-instance");
var carInfoPlate = document.getElementById("car-info-plate");
var carInfoBrand = document.getElementById("car-info-brand");
var carInfoColor = document.getElementById("car-info-color");
var validPlate = function (value) { return new RegExp(/^([0-9]{4}[a-z]{3})$/i).test(value); };
var inputPlate = document.getElementById("input-plate");
var feedbackPlate = document.querySelector("#" + inputPlate.id + " ~ div.invalid-feedback");
feedbackPlate.textContent = '"Plate" must have 4 digits followed by 3 letters';
var validIfNotEmpty = function (value) { return new RegExp(/\w/i).test(value); };
var inputBrand = document.getElementById("input-brand");
var feedbackBrand = document.querySelector("#" + inputBrand.id + " ~ div.invalid-feedback");
feedbackBrand.textContent = 'Please, fill in the "Brand" field';
var inputColor = document.getElementById("input-color");
var feedbackColor = document.querySelector("#" + inputColor.id + " ~ div.invalid-feedback");
feedbackColor.textContent = 'Please, fill in the "Color" field';
// 2 Wheel's
var formWheels = document.getElementById("form-add-wheels");
var btnAddWheels = document.getElementById("btn-add-wheels");
var btnFinish = document.getElementById("btn-finish");
var wheelInfo = document.getElementById("wheel-info");
var alertWheelSuccess = document.getElementById("wheel-success");
var alertWheelDanger = document.getElementById("wheel-danger");
var validWheelDiameter = function (value) { return (+value > 0.4 && +value < 2 ? true : false); };
var inputWheelDiameter = document.getElementById("wheel-diameter");
var feedbackWheelDiameter = document.querySelector("#" + inputWheelDiameter.id + " ~ div.invalid-feedback");
feedbackWheelDiameter.textContent = '"Diameter" must be bigger than 0.4" and smaller then 2"';
var inputWheelBrand = document.getElementById("wheel-brand");
var feedbackWheelBrand = document.querySelector("#" + inputWheelBrand.id + " ~ div.invalid-feedback");
feedbackWheelBrand.textContent = "You didn't specify any \"Brand\"";
// 3 List Of Cars
var btnShowAllCars = document.getElementById("btn-show-all-cars");
/* EVENTS */
// 1. "Car" -> validity
inputPlate.addEventListener("blur", function () {
    feedback(this, validPlate(this.value));
});
inputBrand.addEventListener("blur", function () {
    feedback(this, validIfNotEmpty(this.value));
});
inputColor.addEventListener("blur", function () {
    feedback(this, validIfNotEmpty(this.value));
});
// 1. "Car" <- validity to create
btnCreateCar.addEventListener("click", validityToCreateCar);
// 2. "Wheel" -> validity
inputWheelDiameter.addEventListener("blur", function () {
    feedback(this, validWheelDiameter(+this.value));
});
inputWheelBrand.addEventListener("blur", function () {
    feedback(this, validIfNotEmpty(this.value));
});
// 2. "Wheel" -> remove Alerts
inputWheelDiameter.addEventListener("focus", function () { return alertWheelSuccess.classList.add("d-none"); });
inputWheelBrand.addEventListener("focus", function () { return alertWheelSuccess.classList.add("d-none"); });
// 2. "Wheel" reset + clear "Car / Wheel" Info
btnFinish.addEventListener("click", finish);
// 2. "Wheel" <- validity to create
btnAddWheels.addEventListener("click", validityToCreateWheel);
// 3. "List of Cars" <- show/hide
btnShowAllCars.addEventListener("click", renderListOfCars);
/* LIB */
function validityToCreateCar() {
    var errorCount = 0;
    // validity...
    if (!validPlate(inputPlate.value)) {
        inputPlate.classList.add("is-invalid");
        errorCount++;
    }
    if (!validIfNotEmpty(inputBrand.value)) {
        inputBrand.classList.add("is-invalid");
        errorCount++;
    }
    if (!validIfNotEmpty(inputColor.value)) {
        inputColor.classList.add("is-invalid");
        errorCount++;
    }
    // ...to create
    if (errorCount === 0) {
        // 1. create Car
        cars.push(new Car(
        // prettier-ignore
        inputPlate.value.toUpperCase(), firstUpperCase(inputBrand.value.trim()), firstUpperCase(inputColor.value.trim())));
        // 2. spot last "Car" created
        lastCar = cars[cars.length - 1];
        // 3. "Car Info"
        carInfo.classList.remove("d-none"); // will always visibile
        carInfoInstance.textContent = "" + (cars.indexOf(lastCar) + 1);
        carInfoPlate.textContent = lastCar.plate;
        carInfoBrand.textContent = lastCar.brand;
        carInfoColor.textContent = lastCar.color;
        // 4. clear Car <form>
        inputPlate.classList.remove("is-valid");
        inputBrand.classList.remove("is-valid");
        inputColor.classList.remove("is-valid");
        formCar.reset();
        // 5. toogle <form> visibility
        formCar.classList.add("d-none");
        formWheels.classList.remove("d-none");
    }
}
function validityToCreateWheel() {
    inputWheelDiameter.classList.remove("is-valid"); // (pre) clear CSS
    inputWheelBrand.classList.remove("is-valid"); // (pre) clear CSS
    if (validWheelDiameter(+inputWheelDiameter.value) && validIfNotEmpty(inputWheelBrand.value)) {
        // 1. spot last "Car" created
        lastCar = cars[cars.length - 1];
        // 2. add wheels
        lastCar.addWheel(new Wheel(+inputWheelDiameter.value, // parsed int
        firstUpperCase(inputWheelBrand.value.trim())));
        // 3. wheel alert state
        alertWheelSuccess.classList.remove("d-none");
        alertWheelDanger.classList.add("d-none");
        // 4. "Wheel Info"
        wheelInfo.innerHTML += "\n\t\t\t<li>\n\t\t\t\t<i class=\"far fa-dot-circle\"></i>\n\t\t\t\t\t<span class=\"text-dark\">\n\t\t\t\t\t\tdiameter: " + inputWheelDiameter.value + "\"\n\t\t\t\t\t\t/\n\t\t\t\t\t\tbrand: " + firstUpperCase(inputWheelBrand.value.trim()) + "\n\t\t\t\t\t</span>\n\t\t\t</li>";
        // 5 clear Wheel <form>
        formWheels.reset();
    }
    else {
        // 1. wheel alert state
        alertWheelSuccess.classList.add("d-none");
        alertWheelDanger.classList.remove("d-none");
        // 2. induce CSS onblur validation
        if (!validWheelDiameter(+inputWheelDiameter.value))
            inputWheelDiameter.classList.add("is-invalid");
        if (!validIfNotEmpty(inputWheelBrand.value))
            inputWheelBrand.classList.add("is-invalid");
    }
}
function finish() {
    // spot last "Car" created
    lastCar = cars[cars.length - 1];
    // toggle if "Car.wheels" not empty
    if (lastCar.wheels.length > 0) {
        // clear Wheel <form>
        inputWheelDiameter.classList.remove("is-valid");
        inputWheelBrand.classList.remove("is-valid");
        formWheels.reset();
        // clear "Car Info" + "Wheel Info"
        carInfoInstance.textContent = "";
        carInfoPlate.textContent = "";
        carInfoBrand.textContent = "";
        carInfoColor.textContent = "";
        wheelInfo.innerHTML = "";
        // visibility
        carInfo.classList.add("d-none");
        formWheels.classList.add("d-none");
        formCar.classList.remove("d-none");
        // alert
        alertWheelSuccess.classList.add("d-none");
    }
    else
        alertWheelDanger.classList.remove("d-none");
}
function renderListOfCars() {
    var outletList = document.getElementById("list-all-cars");
    // destroy / construct list
    if (outletList.children.length > 0)
        outletList.innerHTML = "";
    else {
        for (var i = 0; i < cars.length; i++) {
            // 1. <div> clone + append + style
            var cloned = carInfo.cloneNode(true); // clone template <div>
            outletList.append(cloned);
            cloned.id = "list-car-" + (i + 1);
            cloned.classList.replace("bg-light", "bg-dark");
            cloned.classList.remove("d-none");
            // 2. <p> CSS
            var clonedPs = cloned.querySelectorAll("p");
            clonedPs.forEach(function (p) {
                p.classList.add("text-info");
            });
            // 3. <span> models id
            var modelInstance = cloned.querySelector("#car-info-instance");
            var modelPlate = cloned.querySelector("#car-info-plate");
            var modelBrand = cloned.querySelector("#car-info-brand");
            var modelColor = cloned.querySelector("#car-info-color");
            var modelWheel = cloned.querySelector("#wheel-info");
            modelInstance.id = "model-instance-" + (i + 1);
            modelPlate.id = "model-plate-" + (i + 1);
            modelBrand.id = "model-max-brand-" + (i + 1);
            modelColor.id = "model-current-color-" + (i + 1);
            modelWheel.id = "wheel-info-" + (i + 1);
            // 3. <span> models CSS
            modelInstance.classList.replace("text-dark", "text-light");
            modelPlate.classList.replace("text-dark", "text-light");
            modelBrand.classList.replace("text-dark", "text-light");
            modelColor.classList.replace("text-dark", "text-light");
            modelWheel.classList.replace("text-dark", "text-light");
            // 3. <span> modles data
            modelInstance.textContent = "" + (i + 1);
            modelPlate.textContent = cars[i].plate;
            modelBrand.textContent = cars[i].brand;
            modelColor.textContent = cars[i].color;
            for (var _i = 0, _a = cars[i].wheels; _i < _a.length; _i++) {
                var wheel = _a[_i];
                modelWheel.innerHTML += "\n\t\t\t\t<li class=\"text-info\">\n\t\t\t\t\t<i class=\"far fa-dot-circle\"></i>\n\t\t\t\t\t<span class=\"text-light\">\n\t\t\t\t\t\tdiameter: " + wheel.diameter + "\"\n\t\t\t\t\t\t/\n\t\t\t\t\t\tbrand: " + wheel.brand + "\n\t\t\t\t\t</span>\n\t\t\t\t</li>";
            }
            // 6. divisors CSS
            var divisiors = cloned.querySelectorAll("div.border");
            divisiors.forEach(function (divisior) {
                divisior.classList.replace("border", "border-info");
            });
        }
    }
}
/* UTILITY */
function firstUpperCase(value) {
    return value.substr(0, 1).toUpperCase() + value.substr(1, value.length - 1).toLowerCase();
}
function feedback(ref, condition) {
    condition
        ? (ref.classList.add("is-valid"), ref.classList.remove("is-invalid"))
        : (ref.classList.remove("is-valid"), ref.classList.add("is-invalid"));
}
/* TEST */
// cars = [
// 	new Car("0001TST", "Test-brand-1", "Test-color-1"),
// 	new Car("0002TST", "Test-brand-2", "Test-color-2"),
// ];
// cars[0].addWheel(new Wheel(1.1, "Firestone"));
// cars[0].addWheel(new Wheel(1.2, "Firestone"));
// cars[1].addWheel(new Wheel(1.3, "Dunlop"));
// cars[1].addWheel(new Wheel(1.4, "Dunlop"));
// cars[1].addWheel(new Wheel(1.5, "Dunlop"));
// cars[1].addWheel(new Wheel(1.6, "Dunlop"));
