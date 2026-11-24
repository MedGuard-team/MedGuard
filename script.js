
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
// Replace these values with your Firebase Web App config
const firebaseConfig = {
 apiKey: "AIzaSyClZdtRpn13k0UchKriBF10rGUx91z5-8k",
    authDomain: "med-card-a9e64.firebaseapp.com",
    projectId: "med-card-a9e64",
    storageBucket: "med-card-a9e64.firebasestorage.app",
    messagingSenderId: "38449568085",
    appId: "1:38449568085:web:a801920b50eafcc753b7dc",
    measurementId: "G-XYM6NM7RW5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const loginSection = document.getElementById("introSection");
const patientSection = document.getElementById("patientSection");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const loginMessage = document.getElementById("loginMessage");

loginBtn.addEventListener("click", async () => {
  loginMessage.textContent = "Logging in...";

  try {
    await signInWithEmailAndPassword(
      auth,
      emailInput.value.trim(),
      passwordInput.value
    );
        loginSection.hidden = true;
    introSection.hidden = true;
    patientSection.hidden = false;
  } catch (error) {
    loginMessage.textContent = "Login failed: " + error.message;
  }
});

 

const searchBtn = document.getElementById("searchBtn");
const patientInput = document.getElementById("patientId");
const result = document.getElementById("result");

searchBtn.addEventListener("click", async () => {
  const patientId = patientInput.value.trim();

  if (!patientId) {
    result.textContent = "Please enter a Patient ID.";
    return;
  }

  result.textContent = "Searching...";

  try {
    const patientsRef = collection(db, "patient");
    const patientQuery = query(
      patientsRef,
      where("patientId", "==", patientId)
    );

    const snapshot = await getDocs(patientQuery);

    if (snapshot.empty) {
      result.textContent = "Patient not found.";
      return;
    }

    const patient = snapshot.docs[0].data();
    const patientDocRef = snapshot.docs[0].ref;


    result.replaceChildren();

const dashboard = document.createElement("div");
dashboard.className = "patient-dashboard";

const heading = document.createElement("h2");
heading.textContent = "Patient Health Dashboard";

const name = document.createElement("p");
name.textContent = "Patient Name: " + patient.name;

const id = document.createElement("p");
id.textContent = "Patient ID: " + patient.patientId;

const status = document.createElement("p");
status.textContent = "Record Status: Registered";

dashboard.append(heading, name, id, status);
const departmentsTitle = document.createElement("h3");
departmentsTitle.textContent = "Medical Departments";
departmentsTitle.style.marginTop = "25px";

const departments = [
  "Neurology",
  "Cardiology",
  "Dermatology",
  "Nephrology",
  "Urology",
  "Gynecology",
  "Hematology",
  "Immunology",
  "Rheumatology",
  "Oncology",
  "General Medicine"
];

const departmentList = document.createElement("div");
departmentList.className = "department-list";

departments.forEach((department) => {
  const item = document.createElement("div");
  item.className = "department-item";
  item.textContent = department;
  item.style.cursor = "pointer";

item.addEventListener("click", async () => {
  const departmentDetails = document.getElementById("departmentDetails");
  departmentDetails.replaceChildren();

  const title = document.createElement("h2");
  title.textContent = department;

  const loading = document.createElement("p");
  loading.textContent = "Loading department records...";

  departmentDetails.append(title, loading);

  try {
    const bodySystemsRef = collection(patientDocRef, "body_systems");
    const recordsSnapshot = await getDocs(bodySystemsRef);

    const searchName = String(department).trim().toLowerCase();

    const records = recordsSnapshot.docs.map((document) => ({
      id: document.id,
      data: document.data()
    }));
    console.log("Department clicked:", department);
console.log("Firebase records:", records);

    const preferredId = searchName.replace(/\s+/g, "_") + "_001";

    const record =
     records.find((item) => {
  const data = item.data;

 const departmentValue = String(
  data.Specialty || data.specialty || data.speciality || data.specality || ""
).trim().toLowerCase();

return departmentValue === searchName;
});

    departmentDetails.replaceChildren(title);

    if (!record) {
      const message = document.createElement("p");
      message.textContent = "No separate record found for this department.";
      departmentDetails.append(message);
      return;
    }

    Object.entries(record.data).forEach(([field, value]) => {
      const line = document.createElement("p");
      line.textContent = field + ": " + String(value);
      departmentDetails.append(line);
    });

  } catch (error) {
    console.error(error);

    const message = document.createElement("p");
    message.textContent = "Unable to load department records.";
    departmentDetails.append(message);
  }
});
  departmentList.appendChild(item);
});

dashboard.append(departmentsTitle, departmentList);
const labReportsButton = document.createElement("button");
labReportsButton.textContent = "View Lab Reports";

labReportsButton.addEventListener("click", async () => {
  const departmentDetails = document.getElementById("departmentDetails");
  departmentDetails.replaceChildren();

  const title = document.createElement("h2");
  title.textContent = "Lab Reports";

  departmentDetails.append(title);

  try {
    const reportsRef = collection(patientDocRef, "lab_reports");
    const reportsSnapshot = await getDocs(reportsRef);

    if (reportsSnapshot.empty) {
      const message = document.createElement("p");
      message.textContent = "No lab reports found.";
      departmentDetails.append(message);
      return;
    }

    reportsSnapshot.forEach((reportDoc) => {
      const data = reportDoc.data();

      const report = document.createElement("div");
      report.className = "department-item";

      const details = [
        ["Test Name", data["test Name"]],
        ["Test Category", data["test Category"]],
        ["Report Status", data["report Status"]],
        ["Notes", data.notes],
        ["Result", data.result]
      ];

      details.forEach(([label, value]) => {
        const line = document.createElement("p");
        line.textContent = label + ": " + (value ?? "Not available");
        report.append(line);
      });

      departmentDetails.append(report);
    });

  } catch (error) {
    console.error(error);
    departmentDetails.textContent = "Unable to load lab reports.";
  }
});

dashboard.append(labReportsButton);
const allergiesButton = document.createElement("button");
allergiesButton.textContent = "View Allergies";

allergiesButton.addEventListener("click", async () => {
  const departmentDetails = document.getElementById("departmentDetails");
  departmentDetails.replaceChildren();

  const title = document.createElement("h2");
  title.textContent = "Allergy Records";
  departmentDetails.append(title);

  try {
    const allergiesRef = collection(patientDocRef, "allergies");
    const allergiesSnapshot = await getDocs(allergiesRef);

    if (allergiesSnapshot.empty) {
      departmentDetails.append("No allergy records found.");
      return;
    }

    allergiesSnapshot.forEach((allergyDoc) => {
      const data = allergyDoc.data();
      const details = [
        ["Allergen", data.allergen],
        ["Allergy Type", data["allergy Type"]],
        ["Severity", data.severity],
        ["Notes", data.notes]
      ];

      details.forEach(([label, value]) => {
        const line = document.createElement("p");
        line.textContent = label + ": " + (value ?? "Not available");
        departmentDetails.append(line);
      });
    });

  } catch (error) {
    console.error(error);
    departmentDetails.textContent = "Unable to load allergy records.";
  }
});

dashboard.append(allergiesButton);

const medicationsButton = document.createElement("button");
medicationsButton.textContent = "View Medications";

medicationsButton.addEventListener("click", async () => {
  const departmentDetails = document.getElementById("departmentDetails");
  departmentDetails.replaceChildren();

  const title = document.createElement("h2");
  title.textContent = "Medication Records";
  departmentDetails.append(title);

  try {
    const medicationsRef = collection(patientDocRef, "Medicationss");
    const medicationsSnapshot = await getDocs(medicationsRef);

    if (medicationsSnapshot.empty) {
      departmentDetails.append("No medication records found.");
      return;
    }

    medicationsSnapshot.forEach((medicationDoc) => {
      const data = medicationDoc.data();

      const details = [
        ["Medication Name", data["Medicine Name"]],
        ["Dosage", data.dosage],
        ["Frequency", data.frequency],
        ["Medication Status", data["Medication Status"]],
        ["Notes", data.Notes]
      ];

      details.forEach(([label, value]) => {
        const line = document.createElement("p");
        line.textContent = label + ": " + (value ?? "Not available");
        departmentDetails.append(line);
      });
    });

  } catch (error) {
    console.error(error);
    departmentDetails.textContent = "Unable to load medication records.";
  }
});

dashboard.append(medicationsButton);

const historyButton = document.createElement("button");
historyButton.textContent = "View Medical History";

historyButton.addEventListener("click", async () => {
  const departmentDetails = document.getElementById("departmentDetails");
  departmentDetails.replaceChildren();

  const title = document.createElement("h2");
  title.textContent = "Medical History";
  departmentDetails.append(title);

  try {
    const historyRef = collection(patientDocRef, "medical_history");
    const historySnapshot = await getDocs(historyRef);

    if (historySnapshot.empty) {
      departmentDetails.append("No medical history records found.");
      return;
    }

    historySnapshot.forEach((historyDoc) => {
      const data = historyDoc.data();

      const details = [
        ["History Type", data.historyType],
        ["Notes", data.notes],
        ["Record Date", data.recordDate]
      ];

      details.forEach(([label, value]) => {
        const line = document.createElement("p");
        line.textContent = label + ": " + (value ?? "Not available");
        departmentDetails.append(line);
      });
    });

  } catch (error) {
    console.error(error);
    departmentDetails.textContent = "Unable to load medical history records.";
  }
});

dashboard.append(historyButton);

const measurementsButton = document.createElement("button");
measurementsButton.textContent = "View Health Measurements";

measurementsButton.addEventListener("click", async () => {
  const departmentDetails = document.getElementById("departmentDetails");
  departmentDetails.replaceChildren();

  const title = document.createElement("h2");
  title.textContent = "Health Measurements";
  departmentDetails.append(title);

  try {
    const measurementsRef = collection(patientDocRef, "Health_Mesurement");
    const measurementsSnapshot = await getDocs(measurementsRef);

    if (measurementsSnapshot.empty) {
      departmentDetails.append("No health measurement records found.");
      return;
    }

    measurementsSnapshot.forEach((measurementDoc) => {
      const data = measurementDoc.data();

      const details = [
        ["Measurement Type", data["measurement Type"]],
        ["Value", data.value],
        ["Unit", data.unit],
        ["Record Date", data["record date"]],
        ["Notes", data.notes]
      ];

      details.forEach(([label, value]) => {
        const line = document.createElement("p");
        line.textContent = label + ": " + (value ?? "Not available");
        departmentDetails.append(line);
      });
    });

  } catch (error) {
    console.error(error);
    departmentDetails.textContent =
      "Unable to load health measurement records.";
  }
});

dashboard.append(measurementsButton);

const vaccinationsButton = document.createElement("button");
vaccinationsButton.textContent = "View Vaccinations";

vaccinationsButton.addEventListener("click", async () => {
  const departmentDetails = document.getElementById("departmentDetails");
  departmentDetails.replaceChildren();

  const title = document.createElement("h2");
  title.textContent = "Vaccination Records";
  departmentDetails.append(title);

  try {
    const vaccinationsRef = collection(patientDocRef, "vaccations");
    const vaccinationsSnapshot = await getDocs(vaccinationsRef);

    if (vaccinationsSnapshot.empty) {
      departmentDetails.append("No vaccination records found.");
      return;
    }

    vaccinationsSnapshot.forEach((vaccinationDoc) => {
      const data = vaccinationDoc.data();

      const details = [
        ["Vaccination Name", data["vaccination name"]],
        ["Dose Number", data["Dose Number"]],
        ["Vaccination Date", data["Vaccination Date"]],
        ["Notes", data.Notes]
      ];

      details.forEach(([label, value]) => {
        const line = document.createElement("p");
        line.textContent = label + ": " + (value ?? "Not available");
        departmentDetails.append(line);
      });
    });

  } catch (error) {
    console.error(error);
    departmentDetails.textContent = "Unable to load vaccination records.";
  }
});

dashboard.append(vaccinationsButton);

const nutritionButton = document.createElement("button");
nutritionButton.textContent = "View Nutrition Records";

nutritionButton.addEventListener("click", async () => {
  const departmentDetails = document.getElementById("departmentDetails");
  departmentDetails.replaceChildren();

  const title = document.createElement("h2");
  title.textContent = "Nutrition Records";
  departmentDetails.append(title);

  try {
    const nutritionRef = collection(patientDocRef, "Nutrition Records");
    const nutritionSnapshot = await getDocs(nutritionRef);

    if (nutritionSnapshot.empty) {
      departmentDetails.append("No nutrition records found.");
      return;
    }

    nutritionSnapshot.forEach((nutritionDoc) => {
      const data = nutritionDoc.data();

      const details = [
        ["Food Items", data["Food Items"]],
        ["Meal Type", data["Meal Type"]],
        ["Record Type", data["Record Type"]],
        ["Notes", data.notes],
        ["Record Date", data["record date"]]
      ];

      details.forEach(([label, value]) => {
        const line = document.createElement("p");
        line.textContent = label + ": " + (value ?? "Not available");
        departmentDetails.append(line);
      });
    });

  } catch (error) {
    console.error(error);
    departmentDetails.textContent = "Unable to load nutrition records.";
  }
});

dashboard.append(nutritionButton);
result.append(dashboard);

  } catch (error) {
    console.error(error);
    result.textContent =
      "Unable to connect. Check Firebase configuration and permissions.";
  }
});

const qrParams = new URLSearchParams(window.location.search);
const qrPatientId = qrParams.get("patientId");

if (qrPatientId) {
  patientInput.value = qrPatientId;
}