const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

// Initialize Firebase Admin SDK
const serviceAccount = require('./fir-jwt-56d4e-firebase-adminsdk-bm76o-7b758db657.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://fir-jwt-56d4e-default-rtdb.firebaseio.com'
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Register a new user
app.post('/register', async (req, res) => {
  try {
    const { email, password, displayName } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    // Register user in Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName
    });

    // Save additional user data to Firebase Realtime Database
    await admin.database().ref(`/users/${userRecord.uid}`).set({
      email,
      displayName,
      hashedPassword
    });

    res.status(200).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login and generate JWT token
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Authenticate user using Firebase Authentication
    const userRecord = await admin.auth().getUserByEmail(email);

    // Verify user's password
    //await admin.auth().signInWithEmailAndPassword(email, password);

    // Generate JWT token
    const token = jwt.sign({ uid: userRecord.uid, email: userRecord.email }, 'Abcd@#$%123466', { expiresIn: '1h' });

    res.status(200).json({ message: 'User login successfully' , token: token});
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Middleware to authenticate requests using JWT token
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  jwt.verify(token, 'Abcd@#$%123466', (err, user) => {
    if (err) return res.status(403).json({ error: 'Forbidden' });

    req.user = user;
    next();
  });
};


app.get('/protected', authenticateToken, (req, res) => {
  res.status(200).json({ message: 'This is a protected route', user: req.user });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});