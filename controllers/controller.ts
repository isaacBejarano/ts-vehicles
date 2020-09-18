// GLOBAL
let cars: Car[] = []; // Cars collection

// REFS
enum Forms {
	"form_create_car" = 0,
}
enum Elements {
	"input_plate" = 0,
	"input_brand" = 1,
	"input_color" = 2,
}
const formCreateCar = document.forms[Forms.form_create_car] as HTMLFormElement;
const inputPlate = formCreateCar.elements[Elements.input_plate] as HTMLInputElement;
const inputBrand = formCreateCar.elements[Elements.input_brand] as HTMLInputElement;
const inputColor = formCreateCar.elements[Elements.input_color] as HTMLInputElement;

// EVENTS
formCreateCar.addEventListener("submit", function (e) {
	createCar(e, inputPlate.value, inputBrand.value, inputColor.value);
});

// AUX
function createCar(e: Event, plate: string, brand: string, color: string) {
	const carInfo = document.getElementById("carInfo") as HTMLElement;
	const carInfoSpans = document.querySelectorAll("#carInfo p span") as NodeListOf<HTMLSpanElement>;
	const car = new Car(plate, color, brand);
	car.addWheel(new Wheel(16, "Firestone"));

	cars.push(car); // car of cars

	// toString -> <span>
	carInfoSpans[0].textContent = `${cars.indexOf(car) + 1}`;
	carInfoSpans[1].textContent = car.plate;
	carInfoSpans[2].textContent = car.brand;
	carInfoSpans[3].textContent = car.color;
	carInfoSpans[4].textContent = `
		${+car.wheels[car.wheels.length - 1].diameter} inches.
		${car.wheels[car.wheels.length - 1].brand}`;

	carInfo.classList.remove("is-none"); // CSS overwrite

	// prevent submit
	e.preventDefault();
	e.stopPropagation();
}
