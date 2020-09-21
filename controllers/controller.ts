/* GLOBALS */

let cars: Car[] = []; // collection of Car

enum Forms {
	"form_create_car" = 0,
	"form_add_wheels" = 1,
}

enum inputCar {
	"input_plate" = 0,
	"input_brand" = 1,
	"input_color" = 2,
}

enum inputWheels {
	"wheel_FL_diameter" = 0,
	"wheel_FL_brand" = 1,
	"wheel_FR_diameter" = 2,
	"wheel_FR_brand" = 3,
	"wheel_RL_diameter" = 4,
	"wheel_RL_brand" = 5,
	"wheel_RR_diameter" = 6,
	"wheel_RR_brand" = 7,
}

// Refs -> Forms
const formCreateCar = document.forms[Forms.form_create_car];
const formAddWheels = document.forms[Forms.form_add_wheels];
// NOTE: Dynamic <form> acces via 'string' is not normative -> use 'number' index instead

// Refs -> inputs
const inputPlate = formCreateCar.elements[inputCar.input_plate] as HTMLInputElement;
const inputBrand = formCreateCar.elements[inputCar.input_brand] as HTMLInputElement;
const inputColor = formCreateCar.elements[inputCar.input_color] as HTMLInputElement;

// Outlet
const carInfo = document.getElementById("carInfo")!; // ! => object not null
const carInfoUlLiSpans = document.querySelectorAll("#carInfo ul li span");

// Wheels
// wheel 1
const inputWheelBrandFL = formAddWheels.elements[inputWheels.wheel_FL_brand] as HTMLInputElement;
const inputWheelDiameterFL = formAddWheels.elements[inputWheels.wheel_FL_diameter] as HTMLInputElement;
// wheel 2
const inputWheelDiameterFR = formAddWheels.elements[inputWheels.wheel_FR_diameter] as HTMLInputElement;
const inputWheelBrandFR = formAddWheels.elements[inputWheels.wheel_FR_brand] as HTMLInputElement;
// wheel 3
const inputWheelDiameterRL = formAddWheels.elements[inputWheels.wheel_RL_diameter] as HTMLInputElement;
const inputWheelBrandRL = formAddWheels.elements[inputWheels.wheel_RL_brand] as HTMLInputElement;
// wheel 4
const inputWheelDiameterRR = formAddWheels.elements[inputWheels.wheel_RR_diameter] as HTMLInputElement;
const inputWheelBrandRR = formAddWheels.elements[inputWheels.wheel_RR_brand] as HTMLInputElement;

// Regexp
const regexPlate = new RegExp(/^[0-9]{4}[a-zA-Z]{3}$/); // "Plate" has 4 digits followed by 3 letters
const regexDiameter = new RegExp(/^([0]\.[5-9])|([1]\.[0-9]{1,2})$/); // "Diameter" bigger than 0.4" and smaller than 2"

// validatePlate + validateBeforeCreateCar
let feedbackPlate = document.querySelector(`[name = ${inputPlate.name}] ~ div.invalid-feedback`)!; // ! => object not null

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
const inputsWheelLength = formAddWheels.elements.length - 1; // (4 brands + 4 diameters -1 button)

for (let i = 0; i < inputsWheelLength; i += 2) {
	formAddWheels.elements[i].addEventListener("blur", function () {
		validateInputDiameter(formAddWheels.elements[i] as HTMLInputElement);
	});
}

/* VALIDATION */

// 1. validate "plate" value
function validateBeforeCreateCar(e: Event): void {
	// (pre) style -> Case
	const plate: string = inputPlate.value.toUpperCase();
	const brand: string = FirstUpperCase(inputBrand.value);
	const color: string = FirstUpperCase(inputColor.value);

	// PLATE
	if (regexPlate.test(plate)) {
		inputPlate.classList.remove("is-valid"); // clear CSS for next Car's Plate
		createCar(e, plate, color, brand);
	} else {
		inputPlate.classList.add("is-invalid");
		feedbackPlate.textContent = '"Plate" must have 4 digits followed by 3 letters';
		e.preventDefault();
		e.stopPropagation();
	}
}

// 2. validate "wheel" value
function validateBeforeAddWheel(e: Event): void {
	let diameters: HTMLInputElement[] = []; // i -> odd. e.g. element 1, element3...
	let brands: HTMLInputElement[] = []; // i+1 -> even. e.g. element 2, element4...
	// const inputsWheelLength = formAddWheels.elements.length - 1; /// (4 brands + 4 diameters -1 button)

	let errorCount = 0;

	for (let i = 0; i < inputsWheelLength; i += 2) {
		let diameter = formAddWheels.elements[i] as HTMLInputElement; // i: 0, 2, 4, 6
		let brand = formAddWheels.elements[i + 1] as HTMLInputElement; // i: 1, 3, 5, 7
		let diameterWheelFeedback = document.querySelector(`[name = ${diameter.name}] ~ div.invalid-feedback`)!; // ! Element not null

		diameters.push(diameter);
		brands.push(brand);

		console.log(typeof diameter.value, diameter); //str "0.34"
		console.log(regexDiameter.test(diameter.value)); //str "0.34"

		// validate +Diameter (parsed int) CSS
		if (!regexDiameter.test(diameter.value)) {
			formAddWheels.elements[i].classList.add("is-invalid");
			diameterWheelFeedback.textContent = '"Diameter" must be bigger than 0.4" and smaller then 2"';
			errorCount++;
		} else formAddWheels.elements[i].classList.remove("is-invalid"); // clear CSS for next Car's Wheels
	}

	// submit || prevent
	errorCount === 0 ? addWheelsToCurrentCar(e, diameters, brands) : (e.preventDefault(), e.stopPropagation());
}

/* UTILITY */

// validate "plate" CSS
function validateInputPlate(ref: HTMLInputElement): void {
	if (regexPlate.test(ref.value)) {
		ref.classList.remove("is-invalid");
		ref.classList.add("is-valid");
	} else {
		ref.classList.add("is-invalid");
		feedbackPlate.textContent = '"Plate" must have 4 digits followed by 3 letters';
	}
}

// validate "wheel.diameter" CSS
function validateInputDiameter(ref: HTMLInputElement): void {
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

function showListOfVehicles(): void {
	// ON
	// OFF
}

/* LIB */

function createCar(e: Event, plate: string, color: string, brand: string): void {
	// outlet
	const carInfoSpans = document.querySelectorAll("#carInfo p span");

	// new vehicle
	const car = new Car(plate, color, brand);

	// car of cars
	cars.push(car);

	// toString -> <span>
	carInfoSpans[0].textContent = `${cars.indexOf(car) + 1}`;
	carInfoSpans[1].textContent = car.plate;
	carInfoSpans[2].textContent = car.brand;
	carInfoSpans[3].textContent = car.color;

	// toString -> <ul><li> -> clear previous wheels
	for (let i = 0; i < carInfoUlLiSpans.length; i++) {
		carInfoUlLiSpans[i].textContent = ``;
	}

	// CSS
	carInfo.classList.remove("is-none"); // diabled for the rest of life cycle
	formCreateCar.classList.add("is-none");
	formAddWheels.classList.remove("is-none");

	// prevent submit + clear Car's for next Car's input
	formPreventAndReset(e, formCreateCar);
}

function addWheelsToCurrentCar(e: Event, diameters: HTMLInputElement[], brands: HTMLInputElement[]): void {
	const length = diameters.length; // === brands.length

	for (let i = 0; i < length; i++) {
		let parsedDiameter: number = +diameters[i].value; // int
		let capitalCasedBrand: string = FirstUpperCase(brands[i].value);
		let wheel = new Wheel(parsedDiameter, capitalCasedBrand); // {}

		// 1. add Wheel to Car
		cars[cars.length - 1].addWheel(wheel);

		// 2. toString -> <ul><li>
		let brandToString = capitalCasedBrand !== "" ? capitalCasedBrand : "not specified";
		carInfoUlLiSpans[i].textContent = `Brand: ${brandToString} / Diameter: ${parsedDiameter}"`; // e.g. Firestone / 1.5"
	}

	// 3. form's CSS
	formCreateCar.classList.toggle("is-none"); // show Car's form for next Car's input
	formAddWheels.classList.toggle("is-none"); // hide Wheel's form

	// 4. prevent submit + clear Wheel's for next Wheel's input
	formPreventAndReset(e, formAddWheels);
}

// AUX
function FirstUpperCase(value: string): string {
	return value.substr(0, 1).toUpperCase() + value.substr(1, value.length - 1).toLowerCase();
}

function formPreventAndReset(e: Event, ref: HTMLFormElement): void {
	e.preventDefault();
	e.stopPropagation();

	ref.reset(); // clear input
}
