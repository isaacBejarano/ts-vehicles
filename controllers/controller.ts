/* GLOBALS */
let cars: Car[] = []; // collection of Car

/* REFS */
// forms
let formCreateCar = document.getElementById("form_create_car") as HTMLFormElement;
let formAddWheels = document.getElementById("form_add_wheels") as HTMLFormElement;

// 1.1 Car's inputs
let inputPlate = document.getElementById("input_plate") as HTMLInputElement;
let inputBrand = document.getElementById("input_brand") as HTMLInputElement;
let inputColor = document.getElementById("input_color") as HTMLInputElement;

// 1.2 Plate's Regexp()
let regexPlate = new RegExp(/^[0-9]{4}[a-zA-Z]{3}$/); // "Plate" has 4 digits followed by 3 letters

// 1.3 feedbackPlate -> validatePlate + validateBeforeCreateCar
let feedbackPlate = document.querySelector(`#${inputPlate.id} ~ div.invalid-feedback`)!; // ! => object not null

// 2.1 Wheel's inputs
// wheel FL
let inputWheelBrandFL = document.getElementById("wheel_FL_brand") as HTMLInputElement;
let inputWheelDiameterFL = document.getElementById("wheel_FL_diameter") as HTMLInputElement;
// wheel FR
let inputWheelDiameterFR = document.getElementById("wheel_FR_diameter") as HTMLInputElement;
let inputWheelBrandFR = document.getElementById("wheel_FR_brand") as HTMLInputElement;
// wheel RL
let inputWheelDiameterRL = document.getElementById("wheel_RL_diameter") as HTMLInputElement;
let inputWheelBrandRL = document.getElementById("wheel_RL_brand") as HTMLInputElement;
// wheel RR
let inputWheelDiameterRR = document.getElementById("wheel_RR_diameter") as HTMLInputElement;
let inputWheelBrandRR = document.getElementById("wheel_RR_brand") as HTMLInputElement;

// 2.2 wheelsLength -> validateDiameter + validateBeforeAddWheel
let wheelsLength = formAddWheels.length - 1; // (4 brands + 4 diameters -1 button)

// 3. Outlet
let carInfo = document.getElementById("carInfo") as HTMLElement; // ! => object not null
let carInfoUlLiSpans = document.querySelectorAll("#carInfo ul li span") as NodeListOf<HTMLSpanElement>;

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

// 3. Utility -> validate "wheel.diameter" CSS
for (let i = 0; i < wheelsLength; i += 2) {
  formAddWheels.elements[i].addEventListener("blur", function () {
    validateDiameter(formAddWheels.elements[i] as HTMLInputElement); // diamneter[x] -> 0, 2, 4, 6
  });
}

/* VALIDATION */
// 1. validate "plate" value
function validateBeforeCreateCar(e: Event): void {
  // (pre) style -> Case
  console.log(inputPlate.value);

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

  let errorCount = 0;

  for (let i = 0; i < wheelsLength; i += 2) {
    let diameter = formAddWheels.elements[i] as HTMLInputElement; // i: 0, 2, 4, 6
    let brand = formAddWheels.elements[i + 1] as HTMLInputElement; // i: 1, 3, 5, 7
    let feedbackDiameter = document.querySelector(`[name = ${diameter.name}] ~ div.invalid-feedback`)!; // ! Element not null

    diameters.push(diameter);
    brands.push(brand);

    // validate +Diameter (parsed int) CSS
    if (+diameter.value <= 0.4 || +diameter.value >= 2) {
      formAddWheels.elements[i].classList.add("is-invalid");
      feedbackDiameter.textContent = '"Diameter" must be bigger than 0.4" and smaller then 2"';
      errorCount++;
    }
    // else formAddWheels.elements[i].classList.remove("is-valid"); // clear CSS for next Car's Plate
  }

  // submit || prevent
  errorCount === 0 ? addWheelsToCurrentCar(e, diameters, brands) : (e.preventDefault(), e.stopPropagation());
}

/* UTILITY */
// validate "plate" CSS
function validateInputPlate(plate: HTMLInputElement): void {
  if (regexPlate.test(plate.value)) {
    plate.classList.remove("is-invalid");
    plate.classList.add("is-valid");
  } else {
    plate.classList.add("is-invalid");
    feedbackPlate.textContent = '"Plate" must have 4 digits followed by 3 letters';
  }
}

// validate "wheel.diameter" CSS
function validateDiameter(diameter: HTMLInputElement): void {
  let feedbackDiameter = document.querySelector(`[name = ${diameter.name}] ~ div.invalid-feedback`)!; // ! Element not null

  if (+diameter.value <= 0.4 || +diameter.value >= 2) {
    diameter.classList.add("is-invalid");
    feedbackDiameter.textContent = '"Diameter" must be bigger than 0.4" and smaller then 2"';
  } else {
    diameter.classList.remove("is-invalid");
    diameter.classList.add("is-valid");
  }
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
  for (let i = 0; i < wheelsLength; i += 2) {
    formAddWheels.elements[i].classList.remove("is-valid"); // clear inputs for next Wheel'sform
  }
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
