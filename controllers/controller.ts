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
	const carInfoSpans = document.querySelectorAll("#carInfo p span") as NodeListOf<HTMLDivElement>;
	const car = new Car(plate, color, brand);
	car.addWheel(new Wheel(16, "Firestone"));

	cars.push(car); // car of cars

	// toString -> <span>
	carInfoSpans[0].textContent = `${cars.indexOf(car) + 1}`;
	carInfoSpans[1].textContent = car.plate;
	carInfoSpans[2].textContent = car.brand;
	carInfoSpans[3].textContent = car.color;
	carInfoSpans[4].textContent = `${+car.wheels[car.wheels.length - 1].diameter} inches. ${
		car.wheels[car.wheels.length - 1].brand
	}`;

	carInfo.classList.remove("is-none"); // CSS overwrite

	// prevent submit
	e.preventDefault();
	e.stopPropagation();
}
