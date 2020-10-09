/* REFS + GLOBALS */

let cars: Car[] = []; // collection of Car

// 1 Car's
const formCar = document.getElementById("form-create-car") as HTMLFormElement;
let lastCar: Car; // last Car in cars
const btnCreateCar = document.getElementById("btn-create-car") as HTMLButtonElement;
const carInfo = document.getElementById("car-info") as HTMLElement;
const carInfoInstance = document.getElementById("car-info-instance") as HTMLSpanElement;
const carInfoPlate = document.getElementById("car-info-plate") as HTMLSpanElement;
const carInfoBrand = document.getElementById("car-info-brand") as HTMLSpanElement;
const carInfoColor = document.getElementById("car-info-color") as HTMLSpanElement;
const validPlate = (value: string): boolean => new RegExp(/^([0-9]{4}[a-z]{3})$/i).test(value);
const inputPlate = document.getElementById("input-plate") as HTMLInputElement;
const feedbackPlate = document.querySelector(`#${inputPlate.id} ~ div.invalid-feedback`) as HTMLElement;
feedbackPlate.textContent = '"Plate" must have 4 digits followed by 3 letters';
const validBrand = (value: string): boolean => (value !== "" ? true : false);
const inputBrand = document.getElementById("input-brand") as HTMLInputElement;
const feedbackBrand = document.querySelector(`#${inputBrand.id} ~ div.invalid-feedback`) as HTMLElement;
feedbackBrand.textContent = 'Please, fill in the "Brand" field';
const validColor = (value: string): boolean => (value !== "" ? true : false);
const inputColor = document.getElementById("input-color") as HTMLInputElement;
const feedbackColor = document.querySelector(`#${inputColor.id} ~ div.invalid-feedback`) as HTMLElement;
feedbackColor.textContent = 'Please, fill in the "Color" field';

// 2 Wheel's
const formWheels = document.getElementById("form-add-wheels") as HTMLFormElement;
const btnAddWheels = document.getElementById("btn-add-wheels") as HTMLButtonElement;
const btnFinish = document.getElementById("btn-finish") as HTMLButtonElement;
const wheelInfo = document.getElementById("wheel-info") as HTMLOListElement;
const alertWheelSuccess = document.getElementById("wheel-success") as HTMLElement;
const alertWheelDanger = document.getElementById("wheel-danger") as HTMLElement;
const validWheelDiameter = (value: number): boolean => (+value > 0.4 && +value < 2 ? true : false);
const inputWheelDiameter = document.getElementById("wheel-diameter") as HTMLInputElement;
const feedbackWheelDiameter = document.querySelector(`#${inputWheelDiameter.id} ~ div.invalid-feedback`) as HTMLElement;
feedbackWheelDiameter.textContent = '"Diameter" must be bigger than 0.4" and smaller then 2"';
const validWheelBrand = (value: string): boolean => (value.length > 0 ? true : false);
const inputWheelBrand = document.getElementById("wheel-brand") as HTMLInputElement;
const feedbackWheelBrand = document.querySelector(`#${inputWheelBrand.id} ~ div.invalid-feedback`) as HTMLElement;
feedbackWheelBrand.textContent = `You didn't specify any "Brand"`;

// 3 List Of Cars
const btnShowAllCars = document.getElementById("btn-show-all-cars") as HTMLButtonElement;

/* EVENTS */

// 1. "Car" -> validity
inputPlate.addEventListener("blur", function () {
	feedback(this, validPlate(this.value));
});
inputBrand.addEventListener("blur", function () {
	feedback(this, validBrand(this.value));
});
inputColor.addEventListener("blur", function () {
	feedback(this, validColor(this.value));
});

// 1. "Car" <- validity to create
btnCreateCar.addEventListener("click", validityToCreateCar);

// 2. "Wheel" -> validity
inputWheelDiameter.addEventListener("blur", function () {
	feedback(this, validWheelDiameter(+this.value));
});
inputWheelBrand.addEventListener("blur", function () {
	feedback(this, validWheelBrand(this.value));
});

// 2. "Wheel" -> remove Alerts
inputWheelDiameter.addEventListener("focus", () => alertWheelSuccess.classList.add("d-none"));
inputWheelBrand.addEventListener("focus", () => alertWheelSuccess.classList.add("d-none"));

// 2. "Wheel" reset + clear "Car / Wheel" Info
btnFinish.addEventListener("click", finish);

// 2. "Wheel" <- validity to create
btnAddWheels.addEventListener("click", validityToCreateWheel);

// 3. "List of Cars" <- show/hide
btnShowAllCars.addEventListener("click", showListOfCars);

/* LIB */

function validityToCreateCar(): void {
	let errorCount: number = 0;

	// validity...
	if (!validPlate(inputPlate.value)) {
		inputPlate.classList.add("is-invalid");
		errorCount++;
	}
	if (!validBrand(inputBrand.value)) {
		inputBrand.classList.add("is-invalid");
		errorCount++;
	}
	if (!validColor(inputColor.value)) {
		inputColor.classList.add("is-invalid");
		errorCount++;
	}

	// ...to create
	if (errorCount === 0) {
		// 1. create Car
		cars.push(
			new Car(
				// prettier-ignore
				inputPlate.value.toUpperCase(),
				firstUpperCase(inputBrand.value),
				firstUpperCase(inputColor.value)
			)
		);
		// 2. spot last "Car" created
		lastCar = cars[cars.length - 1];
		// 3. "Car Info"
		carInfo.classList.remove("d-none"); // will always visibile
		carInfoInstance.textContent = `${cars.indexOf(lastCar) + 1}`;
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

function validityToCreateWheel(): void {
	inputWheelDiameter.classList.remove("is-valid"); // (pre) clear CSS
	inputWheelBrand.classList.remove("is-valid"); // (pre) clear CSS

	if (validWheelDiameter(+inputWheelDiameter.value) && validWheelBrand(inputWheelBrand.value)) {
		// 1. spot last "Car" created
		lastCar = cars[cars.length - 1];
		// 2. add wheels
		lastCar.addWheel(
			new Wheel(
				+inputWheelDiameter.value, // parsed int
				firstUpperCase(inputWheelBrand.value)
			)
		);
		// 3. wheel alert state
		alertWheelSuccess.classList.remove("d-none");
		alertWheelDanger.classList.add("d-none");
		// 4. "Wheel Info"
		wheelInfo.innerHTML += `
			<li>
				<i class="far fa-dot-circle"></i>
					<span class="text-dark">
						Diameter: ${inputWheelDiameter.value}".
						Brand: ${inputWheelBrand.value}
					</span>
			</li>`;
		// 5 clear Wheel <form>
		formWheels.reset();
	} else {
		// 1. wheel alert state
		alertWheelSuccess.classList.add("d-none");
		alertWheelDanger.classList.remove("d-none");
		// 2. induce CSS onblur validation
		if (!validWheelDiameter(+inputWheelDiameter.value)) inputWheelDiameter.classList.add("is-invalid");
		if (!validWheelBrand(inputWheelBrand.value)) inputWheelBrand.classList.add("is-invalid");
	}
}

function finish(): void {
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
	} else alertWheelDanger.classList.remove("d-none");
}

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
			outletCloned.classList.remove("d-none");

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

/* UTILITY */

function firstUpperCase(value: string): string {
	return value.substr(0, 1).toUpperCase() + value.substr(1, value.length - 1).toLowerCase();
}

function feedback(ref: HTMLElement, condition: boolean): void {
	condition
		? (ref.classList.add("is-valid"), ref.classList.remove("is-invalid"))
		: (ref.classList.remove("is-valid"), ref.classList.add("is-invalid"));
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
