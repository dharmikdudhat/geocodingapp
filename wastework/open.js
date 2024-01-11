const axios = require('axios');

const OPENROUTESERVICE_API_KEY = '5b3ce3597851110001cf624830e80573730a4fe18a8ebe596a7ac277';

async function geocodeAddress(address) {
  try {
    const response = await axios.get(`https://api.openrouteservice.org/geocode/search?api_key=${OPENROUTESERVICE_API_KEY}&text=${encodeURIComponent(address)}`);
    
    if (response.data &&
        response.data.features &&
        response.data.features.length > 0) {
      
      const location = response.data.features[0].geometry.coordinates;
      console.log(`${address} coordinates Longitude: ${location[0]}, Latitude: ${location[1]}`);
      return { longitude: location[0], latitude: location[1] };
    } else {
      console.log('No results found.');
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

async function calculateDistanceUsingAPI(location1, location2) {
  try {
    const response = await axios.post(
      `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${OPENROUTESERVICE_API_KEY}`,
      {
        coordinates: [[location1.longitude, location1.latitude], [location2.longitude, location2.latitude]],
        format: 'geojson',
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

// Replace 'City1' and 'City2' with the cities you want to find the distance between.
getDistance('Bangalore', 'Surat');
