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
