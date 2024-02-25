import data from "./personnel.json";

const doctors = JSON.parse(JSON.stringify(data));

export function getAllDoctors(){   
    try {
      return doctors
    } catch (error) {
      console.error('Error reading JSON file', error);
    }
}

export function getDoctorbyPP(IDPP){   
  try {
    const doctor = doctors.find(doc => doc.IDPP === IDPP);
    return doctor || null;
  } catch (error) {
    console.error('Error reading JSON file', error);
  }
}

export function getDoctorbyRegion(points){   
  try {
    var codePostals = new Set()
    points.forEach(element => {
      codePostals.add(element.city.split(" ")[0])
    });
    const doctorsLoc = doctors.filter(doctor => codePostals.has(doctor.CodePostal));
    return doctorsLoc
  } catch (error) {
    console.error('Error reading JSON file', error);
  }
}