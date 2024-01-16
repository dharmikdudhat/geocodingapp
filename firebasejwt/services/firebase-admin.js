const admin = require('firebase-admin');
const serviceAccount = require('../fir-jwt-56d4e-firebase-adminsdk-bm76o-7b758db657.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://fir-jwt-56d4e-default-rtdb.firebaseio.com'
});

module.exports = admin;
