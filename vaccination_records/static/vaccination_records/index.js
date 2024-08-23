document.addEventListener("DOMContentLoaded", function () {
  document.querySelector("#records").addEventListener("click", () => {
    get_records();
    document.querySelector("#records").blur();
  });

  // handle submit form button
  document.querySelector("#recordsForm").onsubmit = () => {
    add_record();
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

  get_records();
});

function aboutPage() {
  document.querySelector("#create-view").style.display = "none";
  document.querySelector("#record-view").style.display = "none";
  document.querySelector("#records-view").style.display = "none";
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

async function add_record() {
  // personal information
  const firstName = document.querySelector("#firstName").value;
  const lastName = document.querySelector("#lastName").value;
  const address = document.querySelector("#address").value;
  const zipCode = document.querySelector("#zipCode").value;
  const birthdate = document.querySelector("#birthdate").value;
  const contactNumber = document.querySelector("#contactNumber").value;
  let gender = "";

  let ele = document.getElementsByName("gender");

  for (i = 0; i < ele.length; i++) {
    if (ele[i].checked) gender = ele[i].value;
  }

  const vaccineInfos = [];

  let dosageSequence = "dosageSequence0";
  let vaccineBrand = "vaccineBrand0";
  let vaccinator = "vaccinator0";
  let dateAdministered = "dateAdministered0";

  // TODO: change to dynamic array length
  for (let i = 0; i < 1; i++) {
    dosageSequence = dosageSequence.slice(0, -1) + `${i + 1}`;
    vaccineBrand = vaccineBrand.slice(0, -1) + `${i + 1}`;
    vaccinator = vaccinator.slice(0, -1) + `${i + 1}`;
    dateAdministered = dateAdministered.slice(0, -1) + `${i + 1}`;
    let dict = {};

    // console.log("dosageSequence current value: ", dosageSequence);
    // console.log("dosage value: ", document.querySelector(dosageSequence).value);

    dict["dosage_sequence"] = document.querySelector(
      `#${dosageSequence}`,
    ).value;
    dict["vaccine_brand"] = document.querySelector(`#${vaccineBrand}`).value;
    dict["vaccinator"] = document.querySelector(`#${vaccinator}`).value;
    dict["date_administered"] = document.querySelector(
      `#${dateAdministered}`,
    ).value;
    vaccineInfos.push(dict);
  }
  vacInfos = JSON.stringify(vaccineInfos);

  try {
    const response = await fetch(`http://127.0.0.1:8000/add_record`, {
      method: "POST",
      body: JSON.stringify({
        first_name: `${firstName}`,
        last_name: `${lastName}`,
        address: `${address}`,
        zip_code: `${zipCode}`,
        birthdate: `${birthdate}`,
        contact_number: `${contactNumber}`,
        gender: `${gender}`,
        vaccine_infos: `${vacInfos}`,
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
}

async function get_records() {
  document.querySelector("#create-view").style.display = "none";
  document.querySelector("#record-view").style.display = "none";
  document.querySelector("#about-view").style.display = "none";
  document.querySelector("#records-view").style.display = "block";
  document.querySelector("#records-view").innerHTML = "";

  const recordsView = document.querySelector("#records-view");
  recordsView.style.display = "block";

  const main_container = document.createElement("div");
  main_container.id = "main_container";

  const response = await fetch(`http://127.0.0.1:8000/get_records`);
  const json = await response.json();

  const container = document.createElement("div");
  container.className = "container";

  if (json.length === 0) {
    const notice = document.createElement("p");
    notice.innerHTML =
      "No records found, go to 'Create new record' to submit vaccination information";
    container.append(notice);
    recordsView.append(container);
  } else {
    let vaccineRecordsContainer = document.createElement("div");

    // vaccineRecordsContainer.setAttribute(
    //   "class",
    //   "grid-container vaccine-records__container",
    // );

    vaccineRecordsContainer.className = "grid-container vaccine-records__container";

    let vaccineRecordsWrapper = document.createElement("div");
    vaccineRecordsWrapper.className = "vaccine-records__wrapper";

    let vaccineRecordsTitle = document.createElement("p");
    vaccineRecordsTitle.innerHTML = "Vaccination Records";
    vaccineRecordsTitle.className = "vaccine-info__title";

    vaccineRecordsWrapper.append(vaccineRecordsTitle);

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
      headerWrapper.className = "vaccine-records__headers";
      headersName[i].className = "vaccine-records__header";
      headerWrapper.append(headersName[i]);
      vaccineRecordsWrapper.append(headerWrapper);
    }

    json.map((record) => {
      console.log("record", record);

      let hr1 = document.createElement("hr");
      hr1.className = "grid__hr";

      let name = document.createElement("p");
      let gender = document.createElement("p");
      let latestVac = document.createElement("p");
      let date = document.createElement("p");

      name.innerHTML = `${record.name}`;
      gender.innerHTML = `${record.gender}`;
      date.innerHTML = `${record.date_created.slice(0, 11)}`;

      record.vaccine_infos.map((info) => {
        if (info.date_administered === undefined) {
          return;
        } else {
          let dateStr = new Date(`${info.date_administered}`);
          latestVac.innerHTML = dateStr
            .toDateString()
            .split(" ")
            .slice(1)
            .join(" ");
        }
      });

      vaccineRecordsWrapper.append(name);
      vaccineRecordsWrapper.append(gender);
      vaccineRecordsWrapper.append(latestVac);
      vaccineRecordsWrapper.append(date);
      vaccineRecordsWrapper.append(hr1);

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
  document.querySelector("#records-view").style.display = "none";
  document.querySelector("#about-view").style.display = "none";
  document.querySelector("#record-view").style.display = "block";
  document.querySelector("#record-view").innerHTML = "";

  const response = await fetch(`http://127.0.0.1:8000/get_record/${recordID}`);
  const record = await response.json();

  keys = [
    "name",
    "address",
    "contact_number",
    "gender",
    "birthday",
    "date_created",
  ];

  names = [
    "Name",
    "Address",
    "Contact number",
    "Gender",
    "Birthday",
    "Date created",
  ];

  const container = document.createElement("div");
  // container.className = "record__container";
  container.setAttribute("class", "grid-container record__container");
  let personalInfoHeader = document.createElement("h3");
  personalInfoHeader.innerHTML = "Personal Information";
  personalInfoHeader.className = "grid__header";
  // container.append(personalInfoHeader);

  const grid__container = document.createElement("div");
  grid__container.className = "grid__container";
  grid__container.append(personalInfoHeader);
  let hr = document.createElement("hr");

  for (let i = 0; i < 6; i++) {
    let p1 = document.createElement("p");
    let p2 = document.createElement("p");
    let grid__item = document.createElement("div");
    // let hr = document.createElement("hr");
    // hr.className = "grid__hr"

    p1.className = "grid__title";
    p2.className = "grid__content";
    grid__item.className = "grid__item";
    p1.innerHTML = names[i];
    grid__item.append(p1);

    if (keys[i] === "birthday") {
      let dateStr = new Date(`${record[keys[i]]}`);
      p2.innerHTML = dateStr.toDateString().split(" ").slice(1).join(" ");
      grid__item.appendChild(p2);
    } else if (keys[i] === "date_created") {
      // p2.innerHTML = `${record.date_created.slice(0, 11)}`;
      p2.innerHTML = record[keys[i]].slice(0, 11);
      grid__item.appendChild(p2);
    } else {
      p2.innerHTML = record[keys[i]];
      grid__item.appendChild(p2);
    }

    grid__container.appendChild(grid__item);

    // add hr after every 3 grid__item
    // if ((i + 1) % 3 === 0) {
    //   grid__container.append(hr);
    // }
  }

  container.append(grid__container);
  let br1 = document.createElement("br");
  container.append(br1);
  container.append(hr);
  let vaccineInfoHeader = document.createElement("h3");
  vaccineInfoHeader.innerHTML = "Vaccine Information";
  vaccineInfoHeader.className = "vaccine-info__title";

  let vaccineInfoContainer = document.createElement("div");
  vaccineInfoContainer.className = "vaccine-info__container";

  let dosageSequence = document.createElement("p");
  let gender = document.createElement("p");
  let vaccineBrand = document.createElement("p");
  let vaccinator = document.createElement("p");

  // dosageSequence.className = "vaccine-info__header vaccine-info__header-1";
  // gender.className = "vaccine-info__header vaccine-info__header-2";
  // vaccineBrand.className = "vaccine-info__header vaccine-info__header-3";
  // vaccinator.className = "vaccine-info__header vaccine-info__header-4";

  dosageSequence.innerHTML = "Dosage Sequence";
  gender.innerHTML = "Date";
  vaccineBrand.innerHTML = "Vaccine Brand";
  vaccinator.innerHTML = "Name of Vaccinator";

  vaccineInfoContainer.append(vaccineInfoHeader);

  const headers = [dosageSequence, gender, vaccineBrand, vaccinator];

  for (let i = 0; i < headers.length; i++) {
    let div = document.createElement("div");
    div.className = "vaccine-info__header-wrapper";
    div.append(headers[i]);
    vaccineInfoContainer.append(div);
  }

  // headers.map((header) => {
  //   let div = document.createElement("div");
  //   div.className = "vaccine-info__header-wrapper";
  //   div.append(header);
  //   vaccineInfoContainer.append(div);
  // });

  // vaccineInfoContainer.append(dosageSequence);
  // vaccineInfoContainer.append(gender);
  // vaccineInfoContainer.append(vaccineBrand);
  // vaccineInfoContainer.append(vaccinator);

  record.vaccine_infos.map((record) => {
    let name = document.createElement("p");
    let gender = document.createElement("p");
    let date = document.createElement("p");
    let vaccinator = document.createElement("p");
    let hr1 = document.createElement("hr");

    name.className = "vaccine-info__values";
    gender.className = "vaccine-info__values";
    date.className = "vaccine-info__values";
    vaccinator.className = "vaccine-info__values";

    hr1.className = "grid__hr";
    name.innerHTML = `${record.dosage_sequence}`;
    gender.innerHTML = new Date(`${record.date_administered}`)
      .toDateString()
      .split(" ")
      .slice(1)
      .join(" ");
    date.innerHTML = `${record.vaccine_brand}`;
    vaccinator.innerHTML = `${record.vaccinator}`;

    vaccineInfoContainer.append(name);
    vaccineInfoContainer.append(gender);
    vaccineInfoContainer.append(date);
    vaccineInfoContainer.append(vaccinator);
    vaccineInfoContainer.append(hr1);
  });

  container.append(vaccineInfoContainer);

  document.querySelector("#record-view").append(container);
}

function newRecord_form() {
  // Show compose view and hide other views
  document.querySelector("#records-view").style.display = "none";
  document.querySelector("#record-view").style.display = "none";
  document.querySelector("#about-view").style.display = "none";
  document.querySelector("#create-view").style.display = "block";

  ids = [
    "firstName",
    "lastName",
    "address",
    "zipCode",
    "birthdate",
    "contactNumber",
  ];

  ids.map((id) => {
    document.querySelector(`#${id}`).value = "";
  });

  let vaccineBrand = "vaccineBrand0";
  let vaccinator = "vaccinator0";
  let dateAdministered = "dateAdministered0";

  // future reference: change to vaccine_Infos.length to make it dynamic
  // for (let i = 0; i < 4; i++) {
  for (let i = 0; i < 1; i++) {
    vaccineBrand = vaccineBrand.slice(0, -1) + `${i + 1}`;
    vaccinator = vaccinator.slice(0, -1) + `${i + 1}`;
    dateAdministered = dateAdministered.slice(0, -1) + `${i + 1}`;

    // console.log("vaccineBrand current value: ", vaccineBrand);
    // console.log("vaccine value: ", document.querySelector(`#${vaccineBrand}`).value);

    document.querySelector(`#${vaccineBrand}`).value = "";
    document.querySelector(`#${vaccinator}`).value = "";
    document.querySelector(`#${dateAdministered}`).value = "";
  }

  document.querySelector(`#inlineRadio1`).checked = "checked";
}
