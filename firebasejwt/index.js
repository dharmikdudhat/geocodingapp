const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

// Initialize Firebase Admin SDK
const admin = require("./services/firebase-admin");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const authRoutes = require("./routes/authRoutes");
const protectedRoutes = require("./routes/protectedRoutes");

app.use("/", authRoutes);
app.use("/", protectedRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
