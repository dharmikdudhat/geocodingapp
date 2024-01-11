const axios = require('axios');

const BING_MAPS_API_KEY = 'AohqVCq4LU6rtnhY1dBFm9WrSy-eflaP63J-bDmhCbPEgb9kqF50WtfaNojmYVNa';

async function geocodeAddress(address) {
  try {
    const response = await axios.get(`https://dev.virtualearth.net/REST/v1/Locations?q=${encodeURIComponent(address)}&key=${BING_MAPS_API_KEY}`);
    
    if (response.data &&
        response.data.resourceSets &&
        response.data.resourceSets.length > 0 &&
        response.data.resourceSets[0].resources &&
        response.data.resourceSets[0].resources.length > 0) {
      
      const location = response.data.resourceSets[0].resources[0].point.coordinates;
      console.log(` ${address} coordinates Latitude: ${location[0]}, Longitude: ${location[1]}`);
      return { latitude: location[0], longitude: location[1] };
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
   // console.log(`Distance between ${city1} and ${city2}: ${distance} km`);
  } else {
    console.log('Unable to calculate distance.');
  }
}



async function calculateDistanceUsingAPI(location1, location2) {
    try {
        const response = await axios.get(
            'https://dev.virtualearth.net/REST/v1/Routes/Driving',
            {
                params: {
                    'o': 'json',
                    'wp.0': `${location1.latitude},${location1.longitude}`,
                    'wp.1': `${location2.latitude},${location2.longitude}`,
                    'key': BING_MAPS_API_KEY,
                    'maxSolutions': 3, // Specify the number of routes you want (adjust as needed)
                }
            }
        );

        if (
            response.data &&
            response.data.resourceSets &&
            response.data.resourceSets.length > 0 &&
            response.data.resourceSets[0].resources &&
            response.data.resourceSets[0].resources.length > 0
        ) {
            const routes = response.data.resourceSets[0].resources;
            routes.forEach((route, index) => {
                const totalDistance = route.travelDistance;
                const totalDuration = route.travelDuration;
                const totladurationinhours = totalDuration/3600;
                
                console.log(`Route ${index + 1} Distance: ${totalDistance} km`);
                console.log(`Route ${index + 1} Duration: ${totladurationinhours} hr`);
            });

            

            return routes;
        } else {
            console.log('Routes calculation failed.');
            return null;
        }
    } catch (error) {
        console.error('Error:', error.message);
        return null;
    }
}


  

// Example usage



// Replace 'City1' and 'City2' with the cities you want to find the distance between.
getDistance('Bangalore', 'Surat');


