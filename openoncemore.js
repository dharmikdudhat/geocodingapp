const axios = require('axios');

// OpenStreetMap Nominatim API for geocoding
async function geocodeAddress(address) {
  try {
    const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
    
    if (response.data && response.data.length > 0) {
      const location = response.data[0];
      console.log(`${address} coordinates Latitude: ${location.lat}, Longitude: ${location.lon}`);
      return { latitude: parseFloat(location.lat), longitude: parseFloat(location.lon) };
    } else {
      console.log('No results found.');
      return null;
    }
  } catch (error) {
    console.error('Error:', error.message);
    return null;
  }
}

// OpenRouteService API for distance calculation
async function calculateDistanceUsingAPI(location1, location2) {
  try {
    const response = await axios.post(
      'https://api.openrouteservice.org/v2/directions/driving-car',
      {
        coordinates: [[location1.longitude, location1.latitude], [location2.longitude, location2.latitude]],
        format: 'geojson',
      },
      {
        headers: {
          'Authorization': 'YOUR_OPENROUTESERVICE_API_KEY',
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (response.data &&
      response.data.features &&
      response.data.features.length > 0) {
      return response.data.features[0].properties.segments[0].distance / 1000; // Distance in kilometers
    } else {
      console.log('Distance calculation failed.');
      return null;
    }
  } catch (error) {
    console.error('Error:', error.message);
    return null;
  }
}

async function getDistance(city1, city2) {
  const location1 = await geocodeAddress(city1);
  const location2 = await geocodeAddress(city2);

  if (location1 && location2) {
    const distance = await calculateDistanceUsingAPI(location1, location2);
    console.log(`Distance between ${city1} and ${city2}: ${distance} km`);
  } else {
    console.log('Unable to calculate distance.');
  }
}

// Replace 'City1' and 'City2' with the cities you want to find the distance between.
getDistance('Bangalore', 'Surat');
