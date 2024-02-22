import data from "./personnel.json";

const doctors = JSON.parse(JSON.stringify(data));

export function getAllDoctor(){   
    try {
      return doctors
    } catch (error) {
      console.error('Error reading JSON file', error);
    }
}