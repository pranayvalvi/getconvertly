const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const rateLimit = require("express-rate-limit");

dotenv.config();

const app = express();
app.set("trust proxy", 1);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:3000",
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use("/api/", rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30,
  message: { error: "Too many requests, please try again later." },
}));
app.use("/uploads", express.static(path.join(__dirname, "uploads"), {
  setHeaders: (res, path, stat) => {
    res.set("Content-Disposition", "attachment");
  }
}));

// Routes
app.use("/api/image", require("./routes/image"));
app.use("/api/pdf", require("./routes/pdf"));
// app.use("/api/text", require("./routes/text")); // TODO

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
