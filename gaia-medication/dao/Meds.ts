import data from './medication.json';

export function getAllMed(){   
  try {
    const medicaments=JSON.parse(JSON.stringify(data))
    return medicaments
  } catch (error) {
    console.error('Error reading JSON file', error);
  }
}

export function getMedbyCIS(CIS){   
  try {
    const medicaments=JSON.parse(JSON.stringify(data))
    const medicament = medicaments.find(med => med.CIS === CIS);
    return medicament || null;
  } catch (error) {
    console.error('Error reading JSON file', error);
  }
}