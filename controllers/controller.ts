// GLOBAL
let cars: Car[] = []; // Cars collection

// REFS
enum Forms {
	"form_create_car" = 0,
	"form_add_wheels" = 1,
}
enum Elements {
	"input_plate" = 0,
	"input_brand" = 1,
	"input_color" = 2,
}
const carInfo = document.getElementById("carInfo") as HTMLElement;
const formCreateCar = document.forms[Forms.form_create_car] as HTMLFormElement;
const formAddWheels = document.forms[Forms.form_add_wheels] as HTMLFormElement;
const inputPlate = formCreateCar.elements[Elements.input_plate] as HTMLInputElement;
const inputBrand = formCreateCar.elements[Elements.input_brand] as HTMLInputElement;
const inputColor = formCreateCar.elements[Elements.input_color] as HTMLInputElement;

// EVENTS
formCreateCar.addEventListener("submit", function (e) {
	createCar(inputPlate.value, inputBrand.value, inputColor.value);
	formPreventAndReset(e, this);
});
formAddWheels.addEventListener("submit", function (e) {
	formCreateCar.classList.remove("is-none"); // CSS
	formAddWheels.classList.add("is-none"); // CSS
	formPreventAndReset(e, this);
});

// AUX
function createCar(plate: string, brand: string, color: string) {
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

	// CSS
	carInfo.classList.remove("is-none");
	formCreateCar.classList.add("is-none");
	formAddWheels.classList.remove("is-none");
}

function formPreventAndReset(e: Event, ref: HTMLFormElement) {
	// prevent submit
	e.preventDefault();
	e.stopPropagation();

	// clear input
	ref.reset();
}
