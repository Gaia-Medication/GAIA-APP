import data from "./pharmacies.json";
import Papa from 'papaparse';

const points = JSON.parse(JSON.stringify(data));

// async function GetData() {
//   const data  = Papa.parse(await fetchCsv());
//   console.log(data);
//   return data;
// }
// GetData()

// async function fetchCsv() {
//   return fetch('. /pharmacies.csv').then(function (response) {
//       let reader = response.body.getReader();
//       let decoder = new TextDecoder('utf-8');
//       return reader.read().then(function (result) {
//           return decoder.decode(result.value);
//       });
//   }).catch(function(error) {
//     console.log('There has been a problem with your fetch operation: ' + error.message);
//      // ADD THIS THROW error
//       throw error;
//     });;
// }

//Renvoie le tableau de toutes les établissements avec coord & informations 
export function getAllPoints() {
  try {
    return points;
  } catch (error) {
    console.error("Error reading CSV file", error);
  }
}

//Renvoie les 50 établissements les plus proches de la région visée sur la Carte
export function getPointsbyRegion(region) {
  try {
    points.forEach((point) => {
      if (point.latitude && point.longitude) {
        const latDiff = region.latitude - point.latitude;
        const lonDiff = region.longitude - point.longitude;
        point.distance = Math.sqrt(latDiff * latDiff + lonDiff * lonDiff);
      } else {
        point.distance = Infinity; // Si le point n'a pas de latitude/longitude, on le met à une distance infinie.
      }
    });
    points.sort((a, b) => a.distance - b.distance);
    return points.slice(0, 50);
  } catch (error) {
    console.error("Error reading CSV file", error);
  }
}
