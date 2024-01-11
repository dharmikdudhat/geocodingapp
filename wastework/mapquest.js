const axios = require('axios');

const MAPQUEST_API_KEY = 'YOUR_MAPQUEST_API_KEY';

async function geocodeAddress(address) {
  try {
    const response = await axios.get(`http://www.mapquestapi.com/geocoding/v1/address?key=${MAPQUEST_API_KEY}&location=${encodeURIComponent(address)}`);
    
    if (response.data &&
        response.data.results &&
        response.data.results.length > 0) {
      
      const location = response.data.results[0].locations[0].latLng;
      console.log(`${address} coordinates Latitude: ${location.lat}, Longitude: ${location.lng}`);
      return { latitude: location.lat, longitude: location.lng };
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
    const response = await axios.get(`http://www.mapquestapi.com/directions/v2/route?key=${MAPQUEST_API_KEY}&from=${location1.latitude},${location1.longitude}&to=${location2.latitude},${location2.longitude}`);
    
    if (response.data &&
      response.data.route &&
      response.data.route.distance) {
      return response.data.route.distance * 1.60934; // Distance in kilometers
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
