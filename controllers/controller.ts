/* GLOBALS */

let cars: Car[] = []; // collection of Car

/* REFS */

// 1.0 forms
const formCreateCar = document.getElementById("form_create_car") as HTMLFormElement;
const formAddWheels = document.getElementById("form_add_wheels") as HTMLFormElement;

// 2.1 Car's inputs
const inputPlate = document.getElementById("input_plate") as HTMLInputElement;
const inputBrand = document.getElementById("input_brand") as HTMLInputElement;
const inputColor = document.getElementById("input_color") as HTMLInputElement;

// 2.2 Plate's Regexp()
const regexPlate = new RegExp(/^[0-9]{4}[a-zA-Z]{3}$/); // "Plate" has 4 digits followed by 3 letters

// 2.3 feedbackPlate -> validatePlate + validateBeforeCreateCar
const feedbackPlate = document.querySelector(`#${inputPlate.id} ~ div.invalid-feedback`) as HTMLElement;

// 3.1 Wheel's inputs
// wheel FL
const inputWheelBrandFL = document.getElementById("wheel_FL_brand") as HTMLInputElement;
const inputWheelDiameterFL = document.getElementById("wheel_FL_diameter") as HTMLInputElement;
// wheel FR
const inputWheelDiameterFR = document.getElementById("wheel_FR_diameter") as HTMLInputElement;
const inputWheelBrandFR = document.getElementById("wheel_FR_brand") as HTMLInputElement;
// wheel RL
const inputWheelDiameterRL = document.getElementById("wheel_RL_diameter") as HTMLInputElement;
const inputWheelBrandRL = document.getElementById("wheel_RL_brand") as HTMLInputElement;
// wheel RR
const inputWheelDiameterRR = document.getElementById("wheel_RR_diameter") as HTMLInputElement;
const inputWheelBrandRR = document.getElementById("wheel_RR_brand") as HTMLInputElement;

// 3.2 wheelsLength -> validateDiameter + validateBeforeAddWheel
const wheelsLength = formAddWheels.length - 1; // (+4 brands + 4 diameters -1 button)

// 4.0 Outlet - created Car
const carInfo = document.getElementById("carInfo") as HTMLElement;

// 4.1 Outlet - List Of Cars <button>
const btnShowAllCars = document.getElementById("btn-show-all-cars") as HTMLButtonElement;

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

// 4. Utility -> validate "wheel.diameter" CSS
for (let i = 0; i < wheelsLength; i += 2) {
	formAddWheels.elements[i].addEventListener("blur", function () {
		validateDiameter(formAddWheels.elements[i] as HTMLInputElement); // [i] -> [0, 2, 4, 6]
	});
}

// 5. Utility -> List of Cars
btnShowAllCars.addEventListener("click", showListOfCars);

/* VALIDATION */

// 1. validate "plate" value
function validateBeforeCreateCar(e: Event): void {
	// (pre) props -> Case
	const plate: string = inputPlate.value.toUpperCase();
	const brand: string = FirstUpperCase(inputBrand.value);
	const color: string = FirstUpperCase(inputColor.value);

	if (regexPlate.test(plate)) {
		inputPlate.classList.remove("is-valid"); // clear CSS for next Car's Plate
		createCar(e, plate, brand, color);
	} else {
		inputPlate.classList.add("is-invalid");
		feedbackPlate.textContent = '"Plate" must have 4 digits followed by 3 letters';
		e.preventDefault();
		e.stopPropagation();
	}
}

// 2. validate "wheel" value
function validateBeforeAddWheel(e: Event): void {
	let diameters: HTMLInputElement[] = [];
	let brands: HTMLInputElement[] = [];

	let errorCount: number = 0;

	for (let i = 0; i < wheelsLength; i += 2) {
		let diameter = formAddWheels.elements[i] as HTMLInputElement; // [i] -> [0, 2, 4, 6]
		let brand = formAddWheels.elements[i + 1] as HTMLInputElement; // [i] -> [1, 3, 5, 7]
		let feedbackDiameter = document.querySelector(`[name = ${diameter.name}] ~ div.invalid-feedback`) as HTMLElement;

		diameters.push(diameter);
		brands.push(brand);

		// (pre) prop diameter -> parse int
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

function createCar(e: Event, plate: string, brand: string, color: string): void {
	// new Car + outlet for Car
	const car = new Car(plate, color, brand);
	const outletCar = document.querySelectorAll("#carInfo p span") as NodeListOf<HTMLElement>; // <- plate, brand, color

	// 1. car of cars
	cars.push(car);

	// 2. toString -> #carInfo p <span>
	outletCar[0].textContent = `${cars.indexOf(car) + 1}`;
	outletCar[1].textContent = car.plate ? car.plate : "not specified";
	outletCar[2].textContent = car.brand ? car.brand : "not specified";
	outletCar[3].textContent = car.color ? car.color : "not specified";

	// 3. form's CSS
	carInfo.classList.remove("is-none"); // disabled for the rest of life cycle
	formCreateCar.classList.add("is-none");
	formAddWheels.classList.remove("is-none");

	// 4. prevent submit + reset form for next Car's inputs
	formPreventAndReset(e, formCreateCar);
}

function addWheelsToCurrentCar(e: Event, diameters: HTMLInputElement[], brands: HTMLInputElement[]): void {
	const diametersLength: number = diameters.length; // === brands.length
	const outletWheel = document.querySelectorAll("#carInfo ul li span") as NodeListOf<HTMLSpanElement>; // <- diameter / brand

	for (let i = 0; i < diametersLength; i++) {
		let parsedDiameter: number = +diameters[i].value;
		let capitalCasedBrand: string = FirstUpperCase(brands[i].value);
		let wheel = new Wheel(parsedDiameter, capitalCasedBrand);
		let brandToString: string = capitalCasedBrand !== "" ? capitalCasedBrand : "not specified";

		// 1. add Wheel to Car
		cars[cars.length - 1].addWheel(wheel);

		// 2. toString -> #carInfo ul li <span>
		outletWheel[i].textContent = `Brand: ${brandToString} / Diameter: ${parsedDiameter}"`; // e.g. Firestone / 1.5"
	}

	// 3. form's CSS
	formCreateCar.classList.toggle("is-none"); // show Car's form for next Car's input
	formAddWheels.classList.toggle("is-none"); // hide Wheel's form

	// 4. prevent submit + clear Wheel's for next Wheel's input
	for (let i = 0; i < wheelsLength; i += 2) {
		formAddWheels.elements[i].classList.remove("is-valid"); // clear inputs for next Wheel'sform
	}

	// 5. prevent submit + reset form for next Wheel's inputs
	formPreventAndReset(e, formAddWheels);
}

/* AUX */

function FirstUpperCase(value: string): string {
	return value.substr(0, 1).toUpperCase() + value.substr(1, value.length - 1).toLowerCase();
}

function formPreventAndReset(e: Event, ref: HTMLFormElement): void {
	e.preventDefault();
	e.stopPropagation();
	ref.reset();
}

/* UTILITY */

// 3. validate "plate" CSS
function validateInputPlate(plate: HTMLInputElement): void {
	if (regexPlate.test(plate.value)) {
		plate.classList.remove("is-invalid");
		plate.classList.add("is-valid");
	} else {
		plate.classList.add("is-invalid");
		feedbackPlate.textContent = '"Plate" must have 4 digits followed by 3 letters';
	}
}

// 4. validate "wheel.diameter" CSS
function validateDiameter(diameter: HTMLInputElement): void {
	const feedbackDiameter = document.querySelector(`[name = ${diameter.name}] ~ div.invalid-feedback`) as HTMLElement;

	if (+diameter.value <= 0.4 || +diameter.value >= 2) {
		diameter.classList.add("is-invalid");
		feedbackDiameter.textContent = '"Diameter" must be bigger than 0.4" and smaller then 2"';
	} else {
		diameter.classList.remove("is-invalid");
		diameter.classList.add("is-valid");
	}
}
// 5. List of Cars
function showListOfCars(): void {
	const outletLength: number = cars.length;
	const outletList = document.getElementById("list-all-cars") as HTMLElement;

	// ON -> create List + show
	if (outletList.children.length === 0) {
		for (let i = 0; i < outletLength; i++) {
			// 1. clone
			let outletCloned = carInfo.cloneNode(true) as HTMLElement;
			let outletWheelsLength: number = outletCloned.children[7].children.length;

			// 2. id + class
			outletCloned.id = `carinfo-${i + 1}`;
			outletCloned.classList.replace("bg-light", "bg-dark");
			outletCloned.classList.replace("text-primary", "text-info");

			// 3. append cloned + show List
			outletList.append(outletCloned);
			outletCloned.classList.remove("is-none");

			// 4.1 CSS - Car <span>
			outletCloned.children[0].children[1].classList.replace("text-dark", "text-light");
			outletCloned.children[2].children[1].classList.replace("text-dark", "text-light");
			outletCloned.children[3].children[1].classList.replace("text-dark", "text-light");
			outletCloned.children[4].children[1].classList.replace("text-dark", "text-light");

			// 4.2 CSS - Wheels <span>
			for (let j = 0; j < outletWheelsLength; j++) {
				outletCloned.children[7].children[j].children[2].classList.replace("text-dark", "text-light");
			}

			// 5.1 toString - existing Car props
			outletCloned.children[0].children[1].textContent = `${i + 1}`;
			outletCloned.children[2].children[1].textContent = cars[i].plate ? cars[i].plate : "not specified";
			outletCloned.children[3].children[1].textContent = cars[i].brand ? cars[i].brand : "not specified";
			outletCloned.children[4].children[1].textContent = cars[i].color ? cars[i].color : "not specified";

			// 5.2 toString - existing Wheel props
			for (let j = 0; j < outletWheelsLength; j++) {
				// default values
				let brandToString: string = "not specified";
				let diameterToString: string = "not specified";

				// <form> Wheel submited?
				if (cars[i].wheels.length) {
					if (cars[i].wheels[j].brand !== "") brandToString = cars[i].wheels[j].brand;
					if (cars[i].wheels[j].diameter > 0) diameterToString = "" + cars[i].wheels[j].diameter; // stringified
				}

				// prettier-ignore
				outletCloned
					.children[7]
					.children[j]
					.children[2]
					.textContent = `Brand: ${brandToString} / Diameter: ${diameterToString}"` // e.g. Firestone / 1.5"
			}
		}
	} else outletList.innerHTML = ""; // OFF -> destroy List
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
