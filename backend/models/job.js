const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      default: "",
    },
    salary: {
      type: String,
      default: "",
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
