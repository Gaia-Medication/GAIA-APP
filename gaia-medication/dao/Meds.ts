import data from './medication.json';

const medicaments=JSON.parse(JSON.stringify(data))
export function getAllMed(){   
  try {
    return medicaments
  } catch (error) {
    console.error('Error reading JSON file', error);
  }
}

export function getMedbyCIS(CIS){   
  try {
    const medicament = medicaments.find(med => med.CIS === CIS);
    return medicament || null;
  } catch (error) {
    console.error('Error reading JSON file', error);
  }
}

export function getAllGenOfCIS(CIS){   
  try {
    const medicament = medicaments.find(med => med.CIS === CIS);
    const gens = medicaments.find(med => med.Generique === medicament.Generique && med.CIS != CIS);
    return gens
  } catch (error) {
    console.error('Error reading JSON file', error);
  }
}