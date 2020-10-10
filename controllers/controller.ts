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
const validIfNotEmpty = (value: string): boolean => new RegExp(/\w/i).test(value);
const inputBrand = document.getElementById("input-brand") as HTMLInputElement;
const feedbackBrand = document.querySelector(`#${inputBrand.id} ~ div.invalid-feedback`) as HTMLElement;
feedbackBrand.textContent = 'Please, fill in the "Brand" field';
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
inputWheelDiameter.addEventListener("focus", () => alertWheelSuccess.classList.add("d-none"));
inputWheelBrand.addEventListener("focus", () => alertWheelSuccess.classList.add("d-none"));

// 2. "Wheel" reset + clear "Car / Wheel" Info
btnFinish.addEventListener("click", finish);

// 2. "Wheel" <- validity to create
btnAddWheels.addEventListener("click", validityToCreateWheel);

// 3. "List of Cars" <- show/hide
btnShowAllCars.addEventListener("click", renderListOfCars);

/* LIB */

function validityToCreateCar(): void {
	let errorCount: number = 0;

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
		cars.push(
			new Car(
				// prettier-ignore
				inputPlate.value.toUpperCase(),
				firstUpperCase(inputBrand.value.trim()),
				firstUpperCase(inputColor.value.trim())
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

	if (validWheelDiameter(+inputWheelDiameter.value) && validIfNotEmpty(inputWheelBrand.value)) {
		// 1. spot last "Car" created
		lastCar = cars[cars.length - 1];
		// 2. add wheels
		lastCar.addWheel(
			new Wheel(
				+inputWheelDiameter.value, // parsed int
				firstUpperCase(inputWheelBrand.value.trim())
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
						diameter: ${inputWheelDiameter.value}"
						/
						brand: ${firstUpperCase(inputWheelBrand.value.trim())}
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
		if (!validIfNotEmpty(inputWheelBrand.value)) inputWheelBrand.classList.add("is-invalid");
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

function renderListOfCars(): void {
	const outletList = document.getElementById("list-all-cars") as HTMLElement;

	// destroy / construct list
	if (outletList.children.length > 0) outletList.innerHTML = "";
	else {
		for (let i = 0; i < cars.length; i++) {
			// 1. <div> clone + append + style
			const cloned = carInfo.cloneNode(true) as HTMLLIElement; // clone template <div>
			outletList.append(cloned);

			cloned.id = `list-car-${i + 1}`;
			cloned.classList.replace("bg-light", "bg-dark");
			cloned.classList.remove("d-none");

			// 2. <p> CSS
			const clonedPs = cloned.querySelectorAll("p") as NodeListOf<HTMLParagraphElement>;
			clonedPs.forEach(p => {
				p.classList.add("text-info");
			});

			// 3. <span> models id
			const modelInstance = cloned.querySelector("#car-info-instance") as HTMLSpanElement;
			const modelPlate = cloned.querySelector("#car-info-plate") as HTMLSpanElement;
			const modelBrand = cloned.querySelector("#car-info-brand") as HTMLSpanElement;
			const modelColor = cloned.querySelector("#car-info-color") as HTMLSpanElement;
			const modelWheel = cloned.querySelector("#wheel-info") as HTMLOListElement;

			modelInstance.id = `model-instance-${i + 1}`;
			modelPlate.id = `model-plate-${i + 1}`;
			modelBrand.id = `model-max-brand-${i + 1}`;
			modelColor.id = `model-current-color-${i + 1}`;
			modelWheel.id = `wheel-info-${i + 1}`;

			// 3. <span> models CSS
			modelInstance.classList.replace("text-dark", "text-light");
			modelPlate.classList.replace("text-dark", "text-light");
			modelBrand.classList.replace("text-dark", "text-light");
			modelColor.classList.replace("text-dark", "text-light");
			modelWheel.classList.replace("text-dark", "text-light");

			// 3. <span> modles data
			modelInstance.textContent = `${i + 1}`;
			modelPlate.textContent = cars[i].plate;
			modelBrand.textContent = cars[i].brand;
			modelColor.textContent = cars[i].color;

			for (let wheel of cars[i].wheels) {
				modelWheel.innerHTML += `
				<li class="text-info">
					<i class="far fa-dot-circle"></i>
					<span class="text-light">
						diameter: ${wheel.diameter}"
						/
						brand: ${wheel.brand}
					</span>
				</li>`;
			}

			// 6. divisors CSS
			const divisiors = cloned.querySelectorAll("div.border") as NodeListOf<HTMLDivElement>;

			divisiors.forEach(divisior => {
				divisior.classList.replace("border", "border-info");
			});
		}
	}
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
