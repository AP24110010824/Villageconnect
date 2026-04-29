const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/jobs", require("./routes/jobRoutes"));
app.use("/api/schemes", require("./routes/schemeRoutes"));
app.use("/api/complaints", require("./routes/complaintRoutes"));
app.use("/api/external", require("./routes/externalRoutes"));

app.get("/", (req, res) => {
  res.send("VillageConnect Backend Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});