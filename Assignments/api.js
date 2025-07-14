require("dotenv").config();
const express = require("express");
const multer = require("multer");
const axios = require("axios");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// ✅ Home route — Fixes "Cannot GET /"
app.get("/", (req, res) => {
  res.send("✅ Server is running! Use /upload to upload files or /weather/{city} to get weather.");
});

// ✅ File upload route
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  res.json({ message: "File uploaded successfully", file: req.file });
});

// ✅ Weather API route
app.get("/weather/:city", async (req, res, next) => {
  try {
    const city = req.params.city;
    const apiKey = process.env.OPENWEATHER_API_KEY;

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );

    res.json({
      city: response.data.name,
      temperature: response.data.main.temp,
      description: response.data.weather[0].description,
    });
  } catch (err) {
    next(err); // pass error to global handler
  }
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Something went wrong",
    message: err.message,
  });
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
