const Complaint = require("../models/complaint");

const createComplaint = async (req, res) => {
  try {
    const { title, description } = req.body;
    const complaint = await Complaint.create({
      title,
      description,
      user: req.user._id,
    });

    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().populate("user", "name email");
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate("user", "name email");

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    if (req.user.role !== "admin" && complaint.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this complaint" });
    }

    ["title", "description", "status", "response"].forEach((field) => {
      if (req.body[field] !== undefined) {
        complaint[field] = req.body[field];
      }
    });

    const updatedComplaint = await complaint.save();
    res.json(updatedComplaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    if (req.user.role !== "admin" && complaint.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this complaint" });
    }

    await complaint.remove();
    res.json({ message: "Complaint removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createComplaint, getComplaints, getComplaintById, updateComplaint, deleteComplaint };
