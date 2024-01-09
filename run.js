const axios = require('axios');

const BING_MAPS_API_KEY = 'AohqVCq4LU6rtnhY1dBFm9WrSy-eflaP63J-bDmhCbPEgb9kqF50WtfaNojmYVNa';

async function geocodeAddress(address) {
  try {
    const response = await axios.get(`https://dev.virtualearth.net/REST/v1/Locations?q=${encodeURIComponent(address)}&key=${BING_MAPS_API_KEY}`);
    
    if (
      response.data &&
      response.data.resourceSets &&
      response.data.resourceSets.length > 0 &&
      response.data.resourceSets[0].resources &&
      response.data.resourceSets[0].resources.length > 0
    ) {
      const location = response.data.resourceSets[0].resources[0].point.coordinates;
      return { latitude: location[0], longitude: location[1] };
    } else {
      console.log('No results found for:', address);
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
    const distance = calculateDistance(location1, location2);
    console.log(`Distance between ${city1} and ${city2}: ${distance} km`);
  } else {
    console.log('Unable to calculate distance.');
  }
}

function calculateDistance(location1, location2) {
  const lat1 = location1.latitude;
  const lon1 = location1.longitude;
  const lat2 = location2.latitude;
  const lon2 = location2.longitude;

  // Haversine formula for calculating distance
  const R = 6371; // Earth's radius in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

// Replace 'City1' and 'City2' with the cities you want to find the distance between.
getDistance('ahmedabad', 'surat');
