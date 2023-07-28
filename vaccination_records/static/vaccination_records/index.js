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
    "Name": "Rodvic Agustino",
    "City": "Kalibo",
    "Country": "Philippines"
  }

  let key = "";

  for (let i = 0; i < 4; i++) {
    let tableHead = document.createElement("th");
    let tableRow = document.createElement("tr");
    let tableData = document.createElement("td");
    
    key = Object.keys(dict)[i]
    tableHead.innerHTML = Object.keys(dict)[i]
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

  for (let i = 0; i < 4; i++) {
    dosageSequence = dosageSequence.slice(0, -1) + `${i + 1}`;
    vaccineBrand = vaccineBrand.slice(0, -1) + `${i + 1}`;
    vaccinator = vaccinator.slice(0, -1) + `${i + 1}`;
    dateAdministered = dateAdministered.slice(0, -1) + `${i + 1}`;
    let dict = {};

    dict["dosage_sequence"] = document.querySelector(
      `#${dosageSequence}`
    ).value;
    dict["vaccine_brand"] = document.querySelector(`#${vaccineBrand}`).value;
    dict["vaccinator"] = document.querySelector(`#${vaccinator}`).value;
    dict["date_administered"] = document.querySelector(
      `#${dateAdministered}`
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
  // Show the records-view and hide other views
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
    // console.log("empty json", json);
    const notice = document.createElement("p");
    notice.innerHTML =
      "No records found, go to 'Create new record' to submit vaccination information";
    container.append(notice);
    recordsView.append(container);
  } else {
    //create table
    let table = document.createElement("table");
    table.className = "table";
    //create table header
    let tableHead = document.createElement("thead");
    let tableRow = document.createElement("tr");
    let dosageSequence = document.createElement("th");
    let gender = document.createElement("th");
    let vaccineBrand = document.createElement("th");
    let latestVaccine = document.createElement("th");

    dosageSequence.scope = "col";
    gender.scope = "col";
    vaccineBrand.scope = "col";
    latestVaccine.scope = "col";

    dosageSequence.innerHTML = "Name";
    gender.innerHTML = "Gender";
    latestVaccine.innerHTML = "Last vaccinated";
    vaccineBrand.innerHTML = "Created";

    tableRow.appendChild(dosageSequence);
    tableRow.appendChild(gender);
    tableRow.appendChild(latestVaccine);
    tableRow.appendChild(vaccineBrand);
    tableHead.appendChild(tableRow);
    table.appendChild(tableHead);

    let tableBody = document.createElement("tbody");

    json.map((record) => {
      let tr = document.createElement("tr");
      tableBody.appendChild(tr);

      let name = document.createElement("td");
      let gender = document.createElement("td");
      let latestVac = document.createElement("td");
      let date = document.createElement("td");
      name.innerHTML = `${record.name}`;
      gender.innerHTML = `${record.gender}`;
      date.innerHTML = `${record.date_created}`;

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

      tr.appendChild(name);
      tr.appendChild(gender);
      tr.appendChild(latestVac);
      tr.appendChild(date);

      table.appendChild(tableBody);
      container.append(table);
      recordsView.innerHTML = "";
      recordsView.append(container);

      tr.addEventListener("click", () => get_record(record.id));
    });
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
  container.className = "container";
  let personalInfoHeader = document.createElement("h3");
  personalInfoHeader.innerHTML = `<h3>Personal Information</h3>`;
  container.append(personalInfoHeader);
  let table1 = document.createElement("table");
  table1.className = "table";
  let tableBody = document.createElement("tbody");

  for (let i = 0; i < 6; i++) {
    let tableHead = document.createElement("th");
    let tableRow = document.createElement("tr");
    let tableData = document.createElement("td");

    tableHead.innerHTML = names[i];
    tableRow.appendChild(tableHead);

    if (keys[i] === "birthday") {
      let dateStr = new Date(`${record[keys[i]]}`);
      tableData.innerHTML = dateStr
        .toDateString()
        .split(" ")
        .slice(1)
        .join(" ");
      tableRow.appendChild(tableData);
    } else {
      tableData.innerHTML = record[keys[i]];
      tableRow.appendChild(tableData);
    }

    tableBody.appendChild(tableRow);
  }

  table1.appendChild(tableBody);
  container.append(table1);
  let br1 = document.createElement("br");
  let hr = document.createElement("hr");
  container.append(br1);
  container.append(hr);
  let vaccineInfoHeader = document.createElement("h3");
  vaccineInfoHeader.innerHTML = `<h3>Vaccine Information</h3>`;
  container.append(vaccineInfoHeader);
  let table2 = document.createElement("table");
  table2.className = "table";

  //create table header
  let tableHead = document.createElement("thead");
  let tableRow = document.createElement("tr");
  let dosageSequence = document.createElement("th");
  let gender = document.createElement("th");
  let vaccineBrand = document.createElement("th");
  let vaccinator = document.createElement("th");
  tableHead.className = "thead-dark";
  dosageSequence.scope = "col";
  gender.scope = "col";
  vaccineBrand.scope = "col";
  vaccinator.scope = "col";
  dosageSequence.innerHTML = "Dosage Sequence";
  gender.innerHTML = "Date";
  vaccineBrand.innerHTML = "Vaccine Brand";
  vaccinator.innerHTML = "Name of vaccinator";

  tableRow.appendChild(dosageSequence);
  tableRow.appendChild(gender);
  tableRow.appendChild(vaccineBrand);
  tableRow.appendChild(vaccinator);
  tableHead.appendChild(tableRow);
  table2.appendChild(tableHead);

  let tBody = document.createElement("tbody");

  record.vaccine_infos.map((record) => {
    let tr = document.createElement("tr");
    tBody.appendChild(tr);

    let name = document.createElement("td");
    let gender = document.createElement("td");
    let date = document.createElement("td");
    let vaccinator = document.createElement("td");

    name.innerHTML = `${record.dosage_sequence}`;
    gender.innerHTML = new Date(`${record.date_administered}`)
      .toDateString()
      .split(" ")
      .slice(1)
      .join(" ");
    date.innerHTML = `${record.vaccine_brand}`;
    vaccinator.innerHTML = `${record.vaccinator}`;

    tr.appendChild(name);
    tr.appendChild(gender);
    tr.appendChild(date);
    tr.appendChild(vaccinator);

    table2.appendChild(tBody);
  });

  container.append(table2);

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
  for (let i = 0; i < 4; i++) {
    vaccineBrand = vaccineBrand.slice(0, -1) + `${i + 1}`;
    vaccinator = vaccinator.slice(0, -1) + `${i + 1}`;
    dateAdministered = dateAdministered.slice(0, -1) + `${i + 1}`;

    document.querySelector(`#${vaccineBrand}`).value = "";
    document.querySelector(`#${vaccinator}`).value = "";
    document.querySelector(`#${dateAdministered}`).value = "";
  }

  document.querySelector(`#inlineRadio1`).checked = "checked";
}
