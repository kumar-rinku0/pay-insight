export default function haversine(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the Earth in kilometers

  // Convert degrees to radians
  lat1 = degToRad(lat1);
  lon1 = degToRad(lon1);
  lat2 = degToRad(lat2);
  lon2 = degToRad(lon2);

  // Haversine formula
  const dlat = lat2 - lat1;
  const dlon = lon2 - lon1;
  const a =
    Math.sin(dlat / 2) * Math.sin(dlat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) * Math.sin(dlon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Distance in kilometers
  const distanceKm = R * c;

  // Convert to meters
  const distanceM = distanceKm * 1000;

  return distanceM;
}

// Function to convert degrees to radians
function degToRad(deg: number) {
  return deg * (Math.PI / 180);
}

// Coordinates of the target point (latitude, longitude)
const targetLat = 26.8271616;
const targetLon = 75.8185984;

// Coordinates of the user (latitude, longitude)
const userLat = 26.8275; // Example user coordinates
const userLon = 75.8189;

// Calculate the distance
const distance = haversine(targetLat, targetLon, userLat, userLon);

// Check if the user is within 50 meters
if (distance <= 50) {
  console.log("User is within 50 meters of the target location.");
} else {
  console.log("User is outside of the 50-meter radius.");
}
