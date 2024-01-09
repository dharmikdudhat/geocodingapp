const API_KEY = "AIzaSyC4zjO9yD1_48p8OR2yV1Hz82eaemau7_I";

const axios = require("axios");

async function getCoordsforGivenAddress (address){
//  return {
//     lat : 40.7484474,
//     lng : -73.9871516
//  };
  const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`);

  const data = response.data;

  if(!data || data.status === 'ZERO_RESULTS'){
    console.log('Could not find the location', 459);
    throw error;
  }

//   const latitude = data.results[0].geometry.location.lat;
//   const longitude = data.results[0].geometry.location.lng;
// console.log('latitude is',latitude,'longitude is ',longitude);
console.log(data);
  return;
}

getCoordsforGivenAddress("ahmedabad india")
    .then(coordinates => console.log(coordinates))
    .catch(error => console.error(error));