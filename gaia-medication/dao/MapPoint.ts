import data from "./pharmacies.json";

const points = JSON.parse(JSON.stringify(data));


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
    return points.slice(0, 120);
  } catch (error) {
    console.error("Error reading CSV file", error);
  }
}
