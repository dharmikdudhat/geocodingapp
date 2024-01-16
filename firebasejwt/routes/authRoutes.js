const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const admin = require("../services/firebase-admin");
const jwt = require("jsonwebtoken");

// ... (other imports)

router.post("/register", async (req, res) => {
  try {
    const { email, password, displayName } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    // Register user in Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName,
    });

    // Save additional user data to Firebase Realtime Database
    await admin.database().ref(`/users/${userRecord.uid}`).set({
      email,
      displayName,
      hashedPassword,
    });

    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Authenticate user using Firebase Authentication
    const userRecord = await admin.auth().getUserByEmail(email);

    // Verify user's password
    //await admin.auth().signInWithEmailAndPassword(email, password);

    // Generate JWT token
    const token = jwt.sign(
      { uid: userRecord.uid, email: userRecord.email},
      "Abcd@#$%123466",
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "User login successfully", token: token });
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "Invalid credentials" });
  }
});

// router.post("/update", async(req , res) => {

// })

module.exports = router;
