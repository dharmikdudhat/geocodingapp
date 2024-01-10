const axios = require('axios');

const BING_MAPS_API_KEY = 'AohqVCq4LU6rtnhY1dBFm9WrSy-eflaP63J-bDmhCbPEgb9kqF50WtfaNojmYVNa';

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

function shortestRoute(){

}

// Example usage
calculateDistanceUsingAPI({ latitude: 12.97674656, longitude: 77.57527924 }, { latitude: 21.20350838, longitude: 72.83922577 });
