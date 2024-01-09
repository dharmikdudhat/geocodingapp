let nodeGeocoder = require('node-geocoder');
let options = {
    provider: 'openstreetmap'
  };
   
  let geoCoder = nodeGeocoder(options);

  geoCoder.geocode('ahmedabad')
  .then((geocodingRes) => {
    console.log('geocoding results');
    console.log('Latitude:', geocodingRes[0].latitude);
    console.log('Longitude:', geocodingRes[0].longitude);

    //reverse geocoding
    const latitude = geocodingRes[0].latitude;
    const longitude = geocodingRes[0].longitude;

    geoCoder.reverse({lat:latitude,lon:longitude})
    .then((reverseRes)=>{
        console.log(`Reverse geocoding results`);
        console.log(JSON.stringify(reverseRes));
        console.log("address", reverseRes[0].formattedAddress);
    })
    .catch((reverseErr) => {
        console.error('error while finding the results', reverseErr);
    });
  })

  .catch((err)=> {
    console.log(err);
  });