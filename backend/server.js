const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");

dotenv.config();

const NODE_ENV = process.env.NODE_ENV || "development";
if (NODE_ENV === "production" && !process.env.JWT_SECRET) {
  console.error("JWT_SECRET is required in production environment.");
  process.exit(1);
}

connectDB();

const app = express();
const corsOptions = {};
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim()).filter(Boolean)
  : [];

if (allowedOrigins.length) {
  corsOptions.origin = (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  };
}

app.use(cors(corsOptions));
app.use(express.json());

// Serve static files from frontend dist folder
const frontendDistPath = path.join(__dirname, "../frontend/dist");
app.use(express.static(frontendDistPath));

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/jobs", require("./routes/jobRoutes"));
app.use("/api/schemes", require("./routes/schemeRoutes"));
app.use("/api/complaints", require("./routes/complaintRoutes"));
app.use("/api/external", require("./routes/externalRoutes"));

app.get("/", (req, res) => {
  res.send("VillageConnect Backend Running");
});

// Fallback for SPA routing: serve index.html for non-API routes
app.use((req, res) => {
  res.sendFile(path.join(frontendDistPath, "index.html"));
});

if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
}

module.exports = app;