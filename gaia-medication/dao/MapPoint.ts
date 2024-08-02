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
    const zoomPoints = points.filter((point) => {
      if (region.latitudeDelta > 2.5 && region.longitudeDelta > 2.5) {
        return false
      } else if (region.latitudeDelta > 1 && region.longitudeDelta > 1) {
        return point.type.split(" ")[0] === "Centre";
      } else if (region.latitudeDelta > 0.14 && region.longitudeDelta > 0.14) {
        return (
          point.type.split(" ")[0] === "Maison" ||
          point.type.split(" ")[0] === "Centre"
        );
      } else {
        return true;
      }
    });
    zoomPoints.forEach((point) => {
      if (point.latitude && point.longitude) {
        const latDiff = region.latitude - point.latitude;
        const lonDiff = region.longitude - point.longitude;
        point.distance = Math.sqrt(latDiff * latDiff + lonDiff * lonDiff);
      } else {
        point.distance = Infinity; // Si le point n'a pas de latitude/longitude, on le met à une distance infinie.
      }
    });
    zoomPoints.sort((a, b) => a.distance - b.distance);
    return zoomPoints.slice(0, 150);
  } catch (error) {
    console.error("Error reading CSV file", error);
  }
}
