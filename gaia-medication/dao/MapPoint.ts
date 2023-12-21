import data from './medication.json';

const points=JSON.parse(JSON.stringify(data))

export function getAllPoints(){   
  try {
    return points
  } catch (error) {
    console.error('Error reading JSON file', error);
  }
}

export function getPointsbyRegion(CIS){   
  try {
    const medicament = points.find(med => med.CIS === CIS);
    return medicament || null;
  } catch (error) {
    console.error('Error reading JSON file', error);
  }
}