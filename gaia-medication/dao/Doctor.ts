import data from "./personnel.json";

const doctors = JSON.parse(JSON.stringify(data));

export function getAllDoctors(){   
    try {
      return doctors
    } catch (error) {
      console.error('Error reading JSON file', error);
    }
}

export function getDoctorbyPP(PP){   
  try {
    const doctor = doctors.find(doc => doc.PP === PP);
    return doctor || null;
  } catch (error) {
    console.error('Error reading JSON file', error);
  }
}