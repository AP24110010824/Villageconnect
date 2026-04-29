const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const User = require("./models/user");
const Job = require("./models/job");
const Scheme = require("./models/scheme");

dotenv.config();

const importData = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Job.deleteMany();
    await Scheme.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash("Admin1234", salt);
    const userPassword = await bcrypt.hash("User1234", salt);

    const adminUser = await User.create({
      name: "Admin User",
      email: "admin@villageconnect.com",
      password: adminPassword,
      role: "admin",
    });

    const normalUser = await User.create({
      name: "Village User",
      email: "user@villageconnect.com",
      password: userPassword,
      role: "user",
    });

    const jobs = [
      {
        title: "Agriculture Extension Officer",
        company: "Rural Development Board",
        description: "Support farmers with crop planning, soil health advice, and subsidy applications.",
        city: "Pune",
        location: "Village Panchayat Office",
        category: "Agriculture",
        salary: "₹25,000 per month",
        postedBy: adminUser._id,
      },
      {
        title: "Soil Health Card Coordinator",
        company: "State Agriculture Department",
        description: "Coordinate soil testing camps and help farmers understand soil recommendations.",
        city: "Bangalore",
        location: "Block Agriculture Office",
        category: "Agriculture",
        salary: "₹24,000 per month",
        postedBy: adminUser._id,
      },
      {
        title: "Community Health Worker",
        company: "District Health Society",
        description: "Work locally to improve health awareness and track vaccination status.",
        city: "Nashik",
        location: "Local Health Centre",
        category: "Health",
        salary: "₹22,000 per month",
        postedBy: adminUser._id,
      },
      {
        title: "Farmers Market Coordinator",
        company: "Local Cooperative Union",
        description: "Help farmers access markets, use e-NAM, and improve pricing transparency.",
        city: "Gurgaon",
        location: "Agriculture Market Yard",
        category: "Agriculture",
        salary: "₹23,500 per month",
        postedBy: adminUser._id,
      },
    ];

    const schemes = [
      {
        title: "PM Kisan Samman Nidhi Yojana",
        description: "Direct income support for small and marginal farmers with annual installments.",
        city: "Pune",
        state: "Maharashtra",
        field: "Agriculture",
        benefits: "Up to ₹6,000 per year for eligible farmers.",
        eligibility: "Small and marginal landholder farmers with valid Aadhaar and bank account.",
      },
      {
        title: "Pradhan Mantri Fasal Bima Yojana",
        description: "Crop insurance to protect farmers from natural disasters and pest losses.",
        city: "Lucknow",
        state: "Uttar Pradesh",
        field: "Agriculture",
        benefits: "Low premium insurance and fast claim processing.",
        eligibility: "Registered farmers with notified crops.",
      },
      {
        title: "Paramparagat Krishi Vikas Yojana",
        description: "Support for cluster-based organic farming and sustainable agriculture practices.",
        city: "Patna",
        state: "Bihar",
        field: "Agriculture",
        benefits: "Subsidies for organic inputs and certification support.",
        eligibility: "Farmer groups forming organic farming clusters.",
      },
      {
        title: "Local Health Infrastructure Grant",
        description: "Funds for upgrading rural health facilities and equipment.",
        city: "Satara",
        state: "Maharashtra",
        field: "Health",
        benefits: "Support for clinics, medicines, and staff training.",
        eligibility: "Local health centres and community health NGOs.",
      },
      {
        title: "Rural Women Entrepreneurship Scheme",
        description: "Support women in starting local businesses and self-help groups.",
        city: "Nashik",
        state: "Maharashtra",
        field: "Entrepreneurship",
        benefits: "Grant funding plus training and mentoring.",
        eligibility: "Women residents aged 18+ with a business plan.",
      },
    ];

    await Job.insertMany(jobs);
    await Scheme.insertMany(schemes);

    console.log("Data imported successfully.");
    process.exit();
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

importData();
