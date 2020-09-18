/* GLOBALS */
let cars: Car[] = []; // Cars collection

// DOM REFS
const formCreateCar = document.querySelector("form") as HTMLFormElement; // (!) =>  not null && HTMLFormElement
const inputPlate = document.querySelector('[name="input_plate"]') as HTMLFormElement;
const inputBrand = document.querySelector('[name="input_brand"]') as HTMLFormElement;
const inputColor = document.querySelector('[name="input_color"]') as HTMLFormElement;

/* EVENTS */
formCreateCar.addEventListener("submit", function (e) {
	createCar(e, inputPlate.value, inputBrand.value, inputColor.value);
});

/* AUX */
function createCar(e: Event, plate: string, brand: string, color: string) {
	const carInfo = document.getElementById("carInfo") as HTMLDivElement;
	const car = new Car(plate, color, brand);
	car.addWheel(new Wheel(16, "Firestone"));

	// car of cars
	cars.push(car);

	// toString
	carInfo.innerHTML = `
		<i class="fas fa-car"></i>
		CAR: <span class="text-dark">${cars.indexOf(car) + 1}</span> </br>
		<i class="far fa-address-card"></i>
		PLATE: <span class="text-dark">${car.plate}</span> </br>
		<i class="fas fa-palette"></i>
		COLOR: <span class="text-dark">${car.color}</span> </br>
		<i class="fas fa-signature"></i>
		BRAND: <span class="text-dark">${car.brand}</span> </br>
		<i class="fas fa-dot-circle"></i>
		WHEELS: <span class="text-dark">
			${+car.wheels[car.wheels.length - 1].diameter} inches.
			${car.wheels[car.wheels.length - 1].brand}			
			</span> </br>
	`;

	carInfo.classList.remove("is-none");

	// prevent submit
	e.preventDefault();
	e.stopPropagation();
}
