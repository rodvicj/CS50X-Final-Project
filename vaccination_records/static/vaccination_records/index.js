document.addEventListener("DOMContentLoaded", function () {
  document.querySelector("#records").addEventListener("click", () => {
    get_records();
    document.querySelector("#records").blur();
  });

  // document.querySelector("#submitButton").addEventListener("click", (event) => {
  //   addRecord();
  //   event.preventDefault();
  // });
  // handle submit form
  document.querySelector("#recordsForm").onsubmit = () => {
    addRecord();
    return false;
  };
  // added event listender for create button
  document.querySelector("#create").addEventListener("click", () => {
    newRecord_form();
    document.querySelector("#create").blur();
  });

  document.querySelector("#about").addEventListener("click", () => {
    aboutPage();
    document.querySelector("#about").blur();
  });

  document.querySelector(".add-btn__wrapper").addEventListener("click", () => {
    console.log("add-btn__wrapper was called");
    addVacInfo();
    updateInputs();
    datePicker();
  });

  get_records();
});

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    let cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      // var cookie = jQuery.trim(cookies[i])
      let cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

function aboutPage() {
  document.querySelector("#create-view").style.display = "none";
  document.querySelector("#vaccine-record").style.display = "none";
  document.querySelector("#vaccine-records").style.display = "none";
  document.querySelector("#about-view").style.display = "block";

  document.querySelector("#about-view").innerHTML = "";
  const container = document.createElement("div");
  container.className = "container";
  let about = document.createElement("h3");
  about.innerHTML = `<h4>CS50X Final Project</h4>`;
  container.append(about);

  let br = document.createElement("br");
  container.append(br);

  let table = document.createElement("table");
  table.className = "table";
  let tableBody = document.createElement("tbody");

  dict = {
    "Project name": "Vaccination Records",
    Name: "Rodvic Agustino",
    City: "Kalibo",
    Country: "Philippines",
  };

  let key = "";

  for (let i = 0; i < 4; i++) {
    let tableHead = document.createElement("th");
    let tableRow = document.createElement("tr");
    let tableData = document.createElement("td");

    key = Object.keys(dict)[i];
    tableHead.innerHTML = Object.keys(dict)[i];
    tableRow.appendChild(tableHead);
    tableData.innerHTML = dict[key];
    tableRow.appendChild(tableData);
    tableBody.appendChild(tableRow);
  }

  table.appendChild(tableBody);
  container.append(table);

  document.querySelector("#about-view").append(container);
}

async function addRecord() {
  // const dosages = document.querySelectorAll(".dosageSequence");
  // const brands = document.querySelectorAll(".vaccineBrand");
  // const vaccinators = document.querySelectorAll(".vaccinator");
  // const dates = document.querySelectorAll(".dateAdministered");

  // const vaccineInfoss = {};

  // vaccineInfoss["dosage_sequence"] = dosages;
  // vaccineInfoss["vaccine_brand"] = brands;
  // vaccineInfoss["vaccinator"] = vaccinators;
  // vaccineInfoss["date_administered"] = dates;

  // console.log("vaccineInfossssss", vaccineInfoss);

  // personal information
  const inputs = document.querySelectorAll(".google-input");
  console.log("inputs", inputs);
  keys = {};
  inputs.forEach((input) => {
    console.log("input value", input.dataset.key);

    keys[`${input.dataset.key}`] = input.value;
  });

  console.log("keys{}", keys);

  // const firstName = document.querySelector("#firstName").value;
  // const lastName = document.querySelector("#lastName").value;
  // const address = document.querySelector("#address").value;
  // const zipCode = document.querySelector("#zipCode").value;
  // const birthdate = document.querySelector("#birthdate").value;
  // const contactNumber = document.querySelector("#contactNumber").value;
  // let gender = "";

  // TODO: change to dynamic array length and take advantage of using class with querySelectorAll
  const dosageSequenceList = document.querySelectorAll(".dosageSequence");
  const vaccineBrandList = document.querySelectorAll(".vaccineBrand");
  const vaccinatorList = document.querySelectorAll(".vaccinator");
  const dateAdministeredList = document.querySelectorAll(".dateAdministered");

  const vaccineInfos = [];

  for (let i = 0; i < dateAdministeredList.length; i++) {
    let dict = {};

    // TODO: use
    // const dosages = document.querySelectorAll(".dosageSequence");
    // const brands = document.querySelectorAll(".vaccineBrand");
    // const dosages = document.querySelectorAll(".vaccinator");
    // const dosages = document.querySelectorAll(".dateAdministered");
    // then loop using dosages.length then put inside dict{} using dict["dosage_sequence"] = dosages[i]; etc...

    dict["dosage_sequence"] = dosageSequenceList[i].value;
    dict["vaccine_brand"] = vaccineBrandList[i].value;
    dict["vaccinator"] = vaccinatorList[i].value;
    dict["date_administered"] = dateAdministeredList[i].value;

    vaccineInfos.push(dict);

    console.log("dict", dict);
    console.log("vaccineInfos", vaccineInfos);
  }

  const vacInfos = {};
  vacInfos["vaccine_infos"] = JSON.stringify(vaccineInfos);
  console.log("vacInfos", vacInfos);

  // TODO: add csrf token
  try {
    const response = await fetch(`http://127.0.0.1:8000/add_record`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
      },
      body: JSON.stringify({
        // first_name: `${firstName}`,
        // last_name: `${lastName}`,
        // address: `${address}`,
        // zip_code: `${zipCode}`,
        // birthdate: `${birthdate}`,
        // contact_number: `${contactNumber}`,
        // gender: `${gender}`,
        // vaccine_infos: `${vacInfos}`,
        ...keys,
        ...vacInfos,
      }),
    });
    const json = await response.json();
    console.log(json);

    if (json.message === "success") {
      get_records();
    }
  } catch (error) {
    console.log("error", error);
  }

  console.log("vacc-input", document.querySelectorAll(".vacc-input"));
  console.log("dosageSequence class", document.querySelectorAll(".dosageSequence"));
}

// TODO: properly format dates to example: Sep. 03, 2024
async function get_records() {
  document.querySelector("#create-view").style.display = "none";
  document.querySelector("#vaccine-record").style.display = "none";
  document.querySelector("#about-view").style.display = "none";
  document.querySelector("#vaccine-records").style.display = "block";
  document.querySelector("#vaccine-records").innerHTML = "";

  const recordsView = document.querySelector("#vaccine-records");
  recordsView.style.display = "block";

  const main_container = document.createElement("div");
  main_container.id = "main_container";

  const response = await fetch(`http://127.0.0.1:8000/get_records`);
  const json = await response.json();

  const container = document.createElement("div");
  container.className = "container";

  if (json.length === 0) {
    const notice = document.createElement("p");
    notice.innerHTML = "No records found, go to 'Create new record' to submit vaccination information";
    container.append(notice);
    recordsView.append(container);
  } else {
    let vaccineRecordsContainer = document.createElement("div");
    vaccineRecordsContainer.className = "vaccine-records__wrapper";

    let vaccineRecordsWrapper = document.createElement("div");
    vaccineRecordsWrapper.className = "vaccine-records__container";

    let vaccineRecordsTitle = document.createElement("h2");
    vaccineRecordsTitle.className = "vaccine-records__title";
    vaccineRecordsTitle.innerHTML = "Vaccination Records";

    vaccineRecordsContainer.append(vaccineRecordsTitle);

    let dosageSequence = document.createElement("p");
    let gender = document.createElement("p");
    let vaccineBrand = document.createElement("p");
    let latestVaccine = document.createElement("p");

    dosageSequence.innerHTML = "name";
    gender.innerHTML = "gender";
    latestVaccine.innerHTML = "last vaccinated";
    vaccineBrand.innerHTML = "date created";

    const headersName = [dosageSequence, gender, latestVaccine, vaccineBrand];

    for (let i = 0; i < headersName.length; i++) {
      let headerWrapper = document.createElement("div");
      headerWrapper.className = "vaccine-records__header";
      // headersName[i].className = "vaccine-records__header";
      headerWrapper.append(headersName[i]);
      vaccineRecordsWrapper.append(headerWrapper);
    }

    json.map((record) => {
      let name = document.createElement("p");
      name.className = "vaccine-records__name";
      let gender = document.createElement("p");
      gender.className = "vaccine-records__gender";
      let latestVac = document.createElement("p");
      latestVac.className = "vaccine-records__last-vaccine";
      let date = document.createElement("p");
      date.className = "vaccine-records__date";

      // console.log("name", record.name);
      name.innerHTML = `${record.name}`;
      gender.innerHTML = `${record.gender}`;
      date.innerHTML = `${record.date_created.slice(0, 11)}`;

      record.vaccine_infos.map((info) => {
        if (info.date_administered === undefined) {
          return;
        } else {
          let dateStr = new Date(`${info.date_administered}`);
          latestVac.innerHTML = dateStr.toDateString().split(" ").slice(1).join(" ");
        }
      });

      vaccineRecordsWrapper.append(name);
      vaccineRecordsWrapper.append(gender);
      vaccineRecordsWrapper.append(latestVac);
      vaccineRecordsWrapper.append(date);
      name.addEventListener("click", () => get_record(record.id));
      gender.addEventListener("click", () => get_record(record.id));
      latestVac.addEventListener("click", () => get_record(record.id));
      date.addEventListener("click", () => get_record(record.id));
    });

    vaccineRecordsContainer.append(vaccineRecordsWrapper);

    recordsView.append(vaccineRecordsContainer);
  }
}

async function get_record(recordID) {
  document.querySelector("#create-view").style.display = "none";
  document.querySelector("#vaccine-records").style.display = "none";
  document.querySelector("#about-view").style.display = "none";
  document.querySelector("#vaccine-record").style.display = "block";
  document.querySelector("#vaccine-record").innerHTML = "";

  const response = await fetch(`http://127.0.0.1:8000/get_record/${recordID}`);
  const record = await response.json();

  keys = ["name", "address", "contact_number", "gender", "birthday", "date_created"];
  names = ["Name", "Address", "Contact number", "Gender", "Birthday", "Date created"];

  const container = document.createElement("div");
  container.className = "vaccine-record__container";
  let personalInfoHeader = document.createElement("h3");
  personalInfoHeader.innerHTML = "Personal Information";
  personalInfoHeader.className = "vaccine-record__personal-title";

  const vaccineRecordContainer = document.createElement("div");
  vaccineRecordContainer.className = "vaccine-record__personal-container";
  container.append(personalInfoHeader);

  for (let i = 0; i < 6; i++) {
    let p1 = document.createElement("p");
    let p2 = document.createElement("p");
    let personInfoWrapper = document.createElement("div");

    p1.className = "vaccine-record__personal-header";
    p2.className = "vaccine-record__personal-value";
    personInfoWrapper.className = "vaccine-record__personal-wrapper";
    p1.innerHTML = names[i];
    personInfoWrapper.append(p1);

    if (keys[i] === "birthday") {
      let dateStr = new Date(`${record[keys[i]]}`);
      p2.innerHTML = dateStr.toDateString().split(" ").slice(1).join(" ");
      personInfoWrapper.appendChild(p2);
    } else if (keys[i] === "date_created") {
      p2.innerHTML = record[keys[i]].slice(0, 11);
      personInfoWrapper.appendChild(p2);
    } else {
      p2.innerHTML = record[keys[i]];
      personInfoWrapper.appendChild(p2);
    }

    vaccineRecordContainer.appendChild(personInfoWrapper);
  }

  container.append(vaccineRecordContainer);
  let vaccineInfoHeader = document.createElement("h3");
  vaccineInfoHeader.innerHTML = "Vaccine Information";
  vaccineInfoHeader.className = "vaccine-record__info-title";

  let vaccineInfoContainer = document.createElement("div");
  vaccineInfoContainer.className = "vaccine-record__info-container";

  let cont = document.createElement("div");
  cont.className = "vaccine-record__info";

  let dosageSequence = document.createElement("p");
  let gender = document.createElement("p");
  let vaccineBrand = document.createElement("p");
  let vaccinator = document.createElement("p");

  dosageSequence.innerHTML = "Dosage Sequence";
  gender.innerHTML = "Date";
  vaccineBrand.innerHTML = "Vaccine Brand";
  vaccinator.innerHTML = "Name of Vaccinator";

  cont.append(vaccineInfoHeader);

  const headers = [dosageSequence, gender, vaccineBrand, vaccinator];

  for (let i = 0; i < headers.length; i++) {
    let div = document.createElement("div");
    div.className = "vaccine-record__info-header";
    div.append(headers[i]);
    vaccineInfoContainer.append(div);
  }

  record.vaccine_infos.map((record) => {
    let name = document.createElement("p");
    let gender = document.createElement("p");
    let date = document.createElement("p");
    let vaccinator = document.createElement("p");

    name.className = "vaccine-record__info-value";
    gender.className = "vaccine-record__info-value";
    date.className = "vaccine-record__info-value";
    vaccinator.className = "vaccine-record__info-value";

    name.innerHTML = `${record.dosage_sequence}`;
    gender.innerHTML = new Date(`${record.date_administered}`).toDateString().split(" ").slice(1).join(" ");
    date.innerHTML = `${record.vaccine_brand}`;
    vaccinator.innerHTML = `${record.vaccinator}`;

    vaccineInfoContainer.append(name);
    vaccineInfoContainer.append(gender);
    vaccineInfoContainer.append(date);
    vaccineInfoContainer.append(vaccinator);
  });

  cont.append(vaccineInfoContainer);
  container.append(cont);

  document.querySelector("#vaccine-record").append(container);
}

function updateInputs() {
  const inputs = document.querySelectorAll(".google-input");

  inputs.forEach((input) => {
    input.addEventListener("focus", (event) => {
      console.log("event", event.target.classList[0]);

      event.target.parentNode.querySelector("#google-label").className =
        "google-label google-label--transform google-label--active";
      event.target.parentNode.classList.add("google-container--active");
      console.log("google-label--transform added...");
    });
  });

  inputs.forEach((input) => {
    input.addEventListener("blur", (event) => {
      if (event.target.parentNode.querySelector(".google-input")?.value === "") {
        event.target.parentNode.querySelector("#google-label").className = "google-label";
      } else {
        event.target.parentNode
          .querySelector("#google-label")
          .classList.replace("google-label--active", "google-label--inactive");
      }

      event.target.parentNode.className = "google-container";
    });
  });
}

function datePicker() {
  const datePick = document.querySelectorAll(".dateAdministered");
  pick = datePick[datePick.length - 1];
  // console.log("latest", pick);

  new Pikaday({
    field: pick,
    toString(date, format = "YYYY-MM-DD") {
      const day = date.toLocaleString("en-US", {day: "2-digit"});
      const month = date.toLocaleString("en-US", {month: "2-digit"});
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    },
    yearRange: [2020, new Date().getFullYear()],
  });
}

function addVacInfo() {
  // TODO: create check if previous inputs still empty;

  console.log("addVacInfo was called");
  names = ["dosageSequence", "vaccineBrand", "vaccinator", "dateAdministered"];
  dataKeys = ["dosage_sequence", "vaccine_brand", "vaccinator", "date_administered"];
  labels = ["Dosage Sequence", "Vaccine Brand", "Vaccinator", "Date Administered"];

  // NOTE: check for a better solution about handling and displaying warnings;

  const dosageSequence = document.querySelectorAll(".dosageSequence");
  const num = dosageSequence.length + 1;
  console.log("first value of dosageSequence", dosageSequence);

  // if (dosageSequence.length !== 0) {
  //   const dosageSequence = document.querySelectorAll(".dosageSequence");
  //   const vaccinator = document.querySelectorAll(".vaccinator");
  //   const vaccineBrand = document.querySelectorAll(".vaccineBrand");
  //   console.log("dosageSequence is not equal to undefined", dosageSequence);

  //   if (
  //     dosageSequence[dosageSequence.length - 1].value === "" ||
  //     vaccinator[vaccinator.length - 1].value === "" ||
  //     vaccineBrand[vaccineBrand.length - 1].value === "" ||
  //     dateAdministered[dateAdministered.length - 1].value === ""
  //   ) {
  //     alert("Please fill out all fields before adding another vaccine information.");
  //     return;
  //   }
  //   console.log(dosageSequence);
  // }

  // console.log("dateAdminstered.length", document.querySelectorAll(".dateAdministered"));

  for (let i = 0; i < 4; i++) {
    const dosageSequenceContainer = document.createElement("div");
    dosageSequenceContainer.className = "google-container";
    dosageSequenceContainer.setAttribute("id", "google-container");

    const inputDosageSequence = document.createElement("input");
    inputDosageSequence.setAttribute("id", `${names[i]}${num}`);
    inputDosageSequence.className = `google-input vacc-input ${names[i]}`;
    inputDosageSequence.setAttribute("data-key", `${dataKeys[i]}`);
    inputDosageSequence.setAttribute("type", "text");

    if (names[i] === "dosageSequence") {
      inputDosageSequence.setAttribute("placeholder", "ex. First Dose");
    } else {
      inputDosageSequence.setAttribute("placeholder", "");
    }

    inputDosageSequence.setAttribute("required", "");
    inputDosageSequence.setAttribute("name", `${names[i]}`);
    inputDosageSequence.setAttribute("aria-label", `${labels[i]}`);

    const googleLabel = document.createElement("div");
    googleLabel.className = "google-label";
    googleLabel.setAttribute("id", "google-label");
    googleLabel.setAttribute("aria-hidden", "true");
    googleLabel.innerHTML = `${labels[i]}`;

    dosageSequenceContainer.append(inputDosageSequence);
    dosageSequenceContainer.append(googleLabel);

    document.querySelector("#new-record__wrapper2").append(dosageSequenceContainer);
  }

  console.log(`num, ${num}`);
}

function newRecord_form() {
  document.querySelector("#new-record__wrapper2").innerHTML = "";
  // document.querySelector("#add-more__container").innerHTML = "";
  document.querySelector("#vaccine-records").style.display = "none";
  document.querySelector("#vaccine-record").style.display = "none";
  document.querySelector("#about-view").style.display = "none";
  document.querySelector("#create-view").style.display = "block";

  document.querySelectorAll(".google-input").forEach((input) => {
    input.parentNode.querySelector("#google-label").className = "google-label";
    input.value = "";
  });

  addVacInfo();
  updateInputs();
  datePicker();

  // TODO: refresh button after newRecord_form() is invoked
  // const btnContainer = document.createElement("div");
  // btnContainer.className = "btnContainer";
  // const btnLabel = document.createElement("p");
  // btnLabel.className = "btnLabel";
  // btnLabel.innerHTML = "add more";
  // btnContainer.append(btnLabel);

  // TODO: dont trigger addVacInfo() if previous inputs are still empty

  // document.querySelector("#add-more__container").append(btnContainer);
  // // btnContainer.append(btnLabel);
}
