const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const app = express();
const port = 3000;

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDOPSVVghE48aRq1thD5jJ6TwENq6Ivi-4",
  authDomain: "fir-jwt-56d4e.firebaseapp.com",
  projectId: "fir-jwt-56d4e",
  storageBucket: "fir-jwt-56d4e.appspot.com",
  messagingSenderId: "338112565137",
  appId: "1:338112565137:web:ded21b720ae421facb5430",
  measurementId: "G-C8Y8WD437W"
};

// Initialize Firebase
const app1 = initializeApp(firebaseConfig);
const analytics = getAnalytics(app1);

// Use middleware to parse JSON
app.use(bodyParser.json());

// Initialize Firebase Admin
const serviceAccount = require('./fir-jwt-56d4e-firebase-adminsdk-bm76o-7b758db657.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://fir-jwt-56d4e-default-rtdb.firebaseio.com',
});

// Firebase RTDB reference
const db = admin.database();
const usersRef = db.ref('users');

// JWT Secret Key
const JWT_SECRET = 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcwNDg3ODMwMSwiaWF0IjoxNzA0ODc4MzAxfQ.GiOgnomYSWxcwPu6M7MINEjzi0Za-0mI8pm_RQsX6Uc';

// Registration Endpoint
app.post('/register', async (req, res) => {
    const { email, password } = req.body;
  
    // Check if the user already exists
    const snapshot = await usersRef.orderByChild('email').equalTo(email).once('value');
    if (snapshot.exists()) {
      return res.status(400).json({ message: 'User already exists' });
    }
  
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
  
    // Create a new user
    const newUserRef = usersRef.push();
    const newUser = { email, password: hashedPassword, userId: newUserRef.key };
    newUserRef.set(newUser);
  
    res.status(201).json({ message: 'User registered successfully' });
  });
// Login Endpoint
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    // Find the user by email
    const snapshot = await usersRef.orderByChild('email').equalTo(email).once('value');
  
    if (!snapshot.exists()) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  
    const userData = Object.values(snapshot.val())[0];
  
    // Validate password using bcrypt
    const passwordMatch = await bcrypt.compare(password, userData.password);
  
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  
    // Generate JWT token
    const token = jwt.sign({ userId: userData.userId, email: userData.email }, JWT_SECRET);
  
    res.json({ token });
  });

  // Generate JWT token
  

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});