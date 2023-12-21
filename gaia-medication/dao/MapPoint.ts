import data from "./pharmacies.json";

const points = JSON.parse(JSON.stringify(data));

export function getAllPoints() {
  try {
    return points;
  } catch (error) {
    console.error("Error reading JSON file", error);
  }
}

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
    return points.slice(0, 25);
  } catch (error) {
    console.error("Error reading JSON file", error);
  }
}
