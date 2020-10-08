"use strict";
/* GLOBALS */
var cars = []; // collection of Car
/* REFS */
// 1.0 forms
var formCar = document.getElementById("form_create_car");
var formWheels = document.getElementById("form_add_wheels");
// 2.1 Car's inputs
var inputPlate = document.getElementById("input_plate");
var inputBrand = document.getElementById("input_brand");
var inputColor = document.getElementById("input_color");
// 2.2 Plate's Regexp()
var regexPlate = new RegExp(/^([0-9]{4}\w{3})$/i); // "Plate" has 4 digits followed by 3 letters
// 2.3 feedbackPlate -> validatePlate + validateBeforeCreateCar
var feedbackPlate = document.querySelector("#" + inputPlate.id + " ~ div.invalid-feedback");
// 3.1 Wheel's inputs
var btnAddWheels = document.getElementById("btn_add_wheels");
var inputWheelDiameter = document.getElementById("wheel-diameter");
var inputWheelBrand = document.getElementById("wheel-brand");
var feedbackWheelDiameter = document.querySelector("#" + inputWheelDiameter.id + " ~ div.invalid-feedback");
var feedbackWheelBrand = document.querySelector("#" + inputWheelBrand.id + " ~ div.invalid-feedback");
var alertWheelList = document.getElementById("wheel-list");
var alertWheelSuccess = document.getElementById("wheel-success");
feedbackWheelDiameter.textContent = '"Diameter" must be bigger than 0.4" and smaller then 2"';
feedbackWheelBrand.textContent = "You didn't specify any \"Brand\"";
// 3.2 wheelsLength -> validateDiameter + validateBeforeAddWheels
var wheelsLength = formWheels.length - 1; // (+4 brands + 4 diameters -1 button)
// 4.0 Outlet - created Car
var carInfo = document.getElementById("carInfo");
// 4.1 Outlet - List Of Cars <button>
var btnShowAllCars = document.getElementById("btn-show-all-cars");
/* EVENTS */
// 1. validate "plate" + create Car
formCar.addEventListener("submit", function (e) {
    validateBeforeCreateCar(e);
});
// 3. Utility -> validate "plate" CSS
inputPlate.addEventListener("input", function () {
    validateInputPlate(this);
});
// 4. Utility -> validate "wheel.diameter" CSS
inputWheelDiameter.addEventListener("input", function () {
    alertWheelSuccess.classList.add("d-none"); // clear previous success alert
    validateWheelDiamater(this);
});
// 4. Utility -> validate "wheel.brand" CSS
inputWheelBrand.addEventListener("input", function () {
    alertWheelSuccess.classList.add("d-none"); // clear previous success alert
    validateWheelBrand(this);
});
// 5. Utility -> validate "Wheel" values
btnAddWheels.addEventListener("click", function () {
    validateBeforeAddWheels();
});
// 6. Finish CRUD
formWheels.addEventListener("submit", function () {
    formWheels.classList.add("d-none");
    outletWheels();
});
// 7. Utility -> List of Cars
btnShowAllCars.addEventListener("click", showListOfCars);
/* VALIDATION */
// 1. validate "plate" value
function validateBeforeCreateCar(e) {
    inputPlate.classList.remove("is-valid"); // clear CSS for next Car's Plate
    // (pre) props -> Case
    var plate = inputPlate.value.toUpperCase();
    var brand = FirstUpperCase(inputBrand.value);
    var color = FirstUpperCase(inputColor.value);
    if (regexPlate.test(plate)) {
        createCar(e, plate, brand, color);
    }
    else {
        inputPlate.classList.add("is-invalid");
        feedbackPlate.textContent = '"Plate" must have 4 digits followed by 3 letters';
        e.preventDefault();
        e.stopPropagation();
    }
}
function validateBeforeAddWheels() {
    var countError = 0;
    if (validateWheelDiamater(inputWheelDiameter))
        countError++;
    if (validateWheelBrand(inputWheelBrand))
        countError++;
    if (countError === 0) {
        // 1. add Wheels to Car
        var lastCar = cars[cars.length - 1];
        // prettier-ignore
        lastCar.addWheel(new Wheel(+inputWheelDiameter.value, // parsed int
        inputWheelBrand.value));
        // 2. clear form
        var formElements = formWheels.getElementsByTagName("input");
        formWheels.reset(); // clear input values
        for (var i = 0; i < formElements.length; i++) {
            formElements[i].classList.remove("is-valid"); // clear input validation
        }
        // 3. Wheel List toString
        alertWheelList.classList.remove("d-none");
        alertWheelSuccess.classList.remove("d-none");
        // plate
        alertWheelList.children[0].children[1].textContent = lastCar.plate;
        // separator
        if (lastCar.wheels.length > 0)
            alertWheelList.children[1].children[0].textContent += " , ";
        // diameter and brand
        alertWheelList.children[1].children[0].textContent += "{\n\t\t\t" + lastCar.wheels[lastCar.wheels.length - 1].diameter + "\t:\n\t\t\t" + lastCar.wheels[lastCar.wheels.length - 1].brand + "\n\t\t}";
    }
}
function outletWheels() {
    var outletWheel = document.getElementById("#feedback-wheels");
}
// for (let i = 0; i < diametersLength; i++) {
// 	let parsedDiameter: number = +diameters[i].value;
// 	let capitalCasedBrand: string = FirstUpperCase(brands[i].value);
// 	let wheel = new Wheel(parsedDiameter, capitalCasedBrand);
// 	let brandToString: string = capitalCasedBrand !== "" ? capitalCasedBrand : "not specified";
// 	// 1. add Wheel to Car
// 	cars[cars.length - 1].addWheel(wheel);
// 	// 2. toString -> #carInfo ul li <span>
// 	outletWheel[i].textContent = `Brand: ${brandToString} / Diameter: ${parsedDiameter}"`; // e.g. Firestone / 1.5"
// }
// 3. form's CSS
// formCar.classList.toggle("d-none"); // show Car's form for next Car's input
// formWheels.classList.toggle("d-none"); // hide Wheel's form
// 4. prevent submit + clear Wheel's for next Wheel's input
// for (let i = 0; i < wheelsLength; i += 2) {
// 	formWheels.elements[i].classList.remove("is-valid"); // clear inputs for next Wheel'sform
// }
// 5. prevent submit + reset form for next Wheel's inputs
// formPreventAndReset(e, formWheels);
/* LIB */
function createCar(e, plate, brand, color) {
    // new Car + outlet for Car
    var car = new Car(plate, color, brand);
    var outletCar = document.querySelectorAll("#carInfo p span"); // <- plate, brand, color
    // 1. car of cars
    cars.push(car);
    // 2. toString -> #carInfo p <span>
    outletCar[0].textContent = "" + (cars.indexOf(car) + 1);
    outletCar[1].textContent = car.plate ? car.plate : "not specified";
    outletCar[2].textContent = car.brand ? car.brand : "not specified";
    outletCar[3].textContent = car.color ? car.color : "not specified";
    // 3. form's CSS
    carInfo.classList.remove("d-none"); // disabled for the rest of life cycle
    formCar.classList.add("d-none");
    formWheels.classList.remove("d-none");
    // 4. prevent submit + reset form for next Car's inputs
    formPreventAndReset(e, formCar);
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
// 4. validate "wheel.diameter" CSS
function validateWheelDiamater(ref) {
    if (+ref.value > 0.4 && +ref.value < 2) {
        ref.classList.remove("is-invalid");
        ref.classList.add("is-valid");
    }
    else {
        ref.classList.add("is-invalid");
        // feedbackWheelDiameter.textContent = '"Diameter" must be bigger than 0.4" and smaller then 2"';
        return true; // error found
    }
}
// 4. validate "wheel.diameter" CSS
function validateWheelBrand(ref) {
    if (+ref.value.length > 0) {
        ref.classList.remove("is-invalid");
        ref.classList.add("is-valid");
    }
    else {
        ref.classList.add("is-invalid");
        // feedbackWheelBrand.textContent = `You didn't specify any "Brand"`;
        return true; // error found
    }
}
// 3. validate "plate" CSS
function validateInputPlate(plate) {
    if (regexPlate.test(plate.value) && plate.value.length === 7) {
        plate.classList.remove("is-invalid");
        plate.classList.add("is-valid");
    }
    else {
        plate.classList.add("is-invalid");
        plate.classList.remove("is-valid");
        feedbackPlate.textContent = '"Plate" must have 4 digits followed by 3 letters';
    }
}
// 4. validate "wheel.diameter" CSS
// function validateDiameter(diameter: HTMLInputElement): void {
// 	const feedbackDiameter = document.querySelector(`[name = ${diameter.name}] ~ div.invalid-feedback`) as HTMLElement;
// 	if (+diameter.value <= 0.4 || +diameter.value >= 2) {
// 		diameter.classList.add("is-invalid");
// 		feedbackDiameter.textContent = '"Diameter" must be bigger than 0.4" and smaller then 2"';
// 	} else {
// 		diameter.classList.remove("is-invalid");
// 		diameter.classList.add("is-valid");
// 	}
// }
// 5. List of Cars
function showListOfCars() {
    var outletLength = cars.length;
    var outletList = document.getElementById("list-all-cars");
    // ON -> create List + show
    if (outletList.children.length === 0) {
        for (var i = 0; i < outletLength; i++) {
            // 1. clone
            var outletCloned = carInfo.cloneNode(true);
            var outletWheelsLength = outletCloned.children[7].children.length;
            // 2. id + class
            outletCloned.id = "carinfo-" + (i + 1);
            outletCloned.classList.replace("bg-light", "bg-dark");
            outletCloned.classList.replace("text-primary", "text-info");
            // 3. append cloned + show List
            outletList.append(outletCloned);
            outletCloned.classList.remove("d-none");
            // 4.1 CSS - Car <span>
            outletCloned.children[0].children[1].classList.replace("text-dark", "text-light");
            outletCloned.children[2].children[1].classList.replace("text-dark", "text-light");
            outletCloned.children[3].children[1].classList.replace("text-dark", "text-light");
            outletCloned.children[4].children[1].classList.replace("text-dark", "text-light");
            // 4.2 CSS - Wheels <span>
            for (var j = 0; j < outletWheelsLength; j++) {
                outletCloned.children[7].children[j].children[2].classList.replace("text-dark", "text-light");
            }
            // 5.1 toString - existing Car props
            outletCloned.children[0].children[1].textContent = "" + (i + 1);
            outletCloned.children[2].children[1].textContent = cars[i].plate ? cars[i].plate : "not specified";
            outletCloned.children[3].children[1].textContent = cars[i].brand ? cars[i].brand : "not specified";
            outletCloned.children[4].children[1].textContent = cars[i].color ? cars[i].color : "not specified";
            // 5.2 toString - existing Wheel props
            for (var j = 0; j < outletWheelsLength; j++) {
                // default values
                var brandToString = "not specified";
                var diameterToString = "not specified";
                // <form> Wheel submited?
                if (cars[i].wheels.length) {
                    if (cars[i].wheels[j].brand !== "")
                        brandToString = cars[i].wheels[j].brand;
                    if (cars[i].wheels[j].diameter > 0)
                        diameterToString = "" + cars[i].wheels[j].diameter; // stringified
                }
                // prettier-ignore
                outletCloned
                    .children[7]
                    .children[j]
                    .children[2]
                    .textContent = "Brand: " + brandToString + " / Diameter: " + diameterToString + "\""; // e.g. Firestone / 1.5"
            }
        }
    }
    else
        outletList.innerHTML = ""; // OFF -> destroy List
}
/* TEST */
// cars = [new Car("car1", "1", "1"), new Car("car2", "2", "2")];
// cars[0].wheels[0] = new Wheel(1.5, "Firestone");
// cars[0].wheels[1] = new Wheel(1.5, "Firestone");
// cars[0].wheels[2] = new Wheel(1.5, "Firestone");
// cars[0].wheels[3] = new Wheel(1.5, "Firestone");
// cars[1].wheels[0] = new Wheel(1.3, "Dunlop");
// cars[1].wheels[1] = new Wheel(1.3, "Dunlop");
// cars[1].wheels[2] = new Wheel(1.3, "Dunlop");
// cars[1].wheels[3] = new Wheel(1.3, "Dunlop");
