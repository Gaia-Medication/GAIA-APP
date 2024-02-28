import data from "./personnel.json";

const doctors = JSON.parse(JSON.stringify(data));

export function getAllDoctors() {
  try {
    return doctors;
  } catch (error) {
    console.error("Error reading JSON file", error);
  }
}

export function getDoctorbyPP(IDPP) {
  try {
    const doctor = doctors.find((doc) => doc.IDPP === IDPP);
    return doctor || null;
  } catch (error) {
    console.error("Error reading JSON file", error);
  }
}

export function getDoctorbyRegion(points) {
  try {
    var codePostals = new Set();
    points.forEach((element) => {
      if (codePostals.size < 2) {
        codePostals.add(element.city.split(" ")[0]);
      }
    });
    const doctorsLoc = doctors
      .filter((doctor) => codePostals.has(doctor.CodePostal))
      .sort((a, b) => a.Nom.localeCompare(b.Nom));
    return doctorsLoc;
  } catch (error) {
    console.error("Error reading JSON file", error);
  }
}

export function searchDoctor(text) {
  try {
    const filteredtext = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    console.log(filteredtext)
    const search =  doctors.filter(
      (doctor) =>
        (doctor.Prenom.normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()+" "+doctor.Nom.normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase())
          .includes(filteredtext) ||
        (doctor.Nom.normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()+" "+doctor.Prenom.normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase())
          .includes(filteredtext)
          
    ).slice(0,50);
   
    return search;
  } catch (error) {
    console.error("Error reading JSON file", error);
  }
}
