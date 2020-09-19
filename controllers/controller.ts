/* GLOBAL */

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

const formCreateCar = document.forms[Forms.form_create_car]; // REF <form> Cars
const formAddWheels = document.forms[Forms.form_add_wheels];// REF <form> Wheels

/* OUTLET */

const carInfo = document.getElementById("carInfo") as HTMLElement;
const carInfoUlLiSpans = document.querySelectorAll("#carInfo ul li span") as NodeListOf<HTMLSpanElement>;

/* EVENTS */

formCreateCar.addEventListener("submit", createCar);
formAddWheels.addEventListener("submit", addWheelsToCurrentCar);

/* LIB */

function createCar(e: Event): void {
	// outlet
	const carInfoSpans = document.querySelectorAll("#carInfo p span") as NodeListOf<HTMLSpanElement>;
	// inputs
	const inputPlate = formCreateCar.elements[inputCar.input_plate] as HTMLInputElement;
	const inputBrand = formCreateCar.elements[inputCar.input_brand] as HTMLInputElement;
	const inputColor = formCreateCar.elements[inputCar.input_color] as HTMLInputElement;

	// (pre) "Brand" style -> Case
	const plate: string = inputPlate.value.toUpperCase();
	const brand: string = FirstUpperCase(inputBrand.value);
	const color: string = FirstUpperCase(inputColor.value);

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
	carInfo.classList.remove("is-none");
	formCreateCar.classList.add("is-none");
	formAddWheels.classList.remove("is-none");

	// prevent submit + clear input
	formPreventAndReset(e, formCreateCar);
}

function addWheelsToCurrentCar(e: Event): void {
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

	// (pre) "Brand" style -> Case
	const brandFL = FirstUpperCase(inputWheelBrandFL.value);
	const brandFR = FirstUpperCase(inputWheelBrandFR.value);
	const brandRL = FirstUpperCase(inputWheelBrandRL.value);
	const brandRR = FirstUpperCase(inputWheelBrandRR.value);

	// .addWheel() <- (pre) +"Diameter" is int
	cars[cars.length - 1].addWheel(new Wheel(+inputWheelDiameterFL.value, brandFL));
	cars[cars.length - 1].addWheel(new Wheel(+inputWheelDiameterFR.value, brandFR));
	cars[cars.length - 1].addWheel(new Wheel(+inputWheelDiameterRL.value, brandRL));
	cars[cars.length - 1].addWheel(new Wheel(+inputWheelDiameterRR.value, brandRR));

	// toString -> <ul><li>
	for (let i = 0; i < carInfoUlLiSpans.length; i++) {
		carInfoUlLiSpans[i].textContent = `
			${cars[cars.length - 1].wheels[i].brand}
			${cars[cars.length - 1].wheels[i].diameter}"`;
	}

	// CSS
	formCreateCar.classList.toggle("is-none");
	formAddWheels.classList.toggle("is-none");

	// prevent submit + clear input
	formPreventAndReset(e, formAddWheels);
}

function showListOfVehicles(): void {
	// ON
	// OFF
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
