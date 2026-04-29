import React from "react";
import api from "../services/api";
import Card from "../components/Card";

const Complaints = ({ user }) => {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [complaints, setComplaints] = React.useState([]);
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState("");

  const loadComplaints = async () => {
    if (!user) {
      setComplaints([]);
      return;
    }

    try {
      const response = await api.get("/complaints");
      setComplaints(response.data);
    } catch (err) {
      setError("Unable to load complaints.");
    }
  };

  React.useEffect(() => {
    loadComplaints();
  }, [user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!user) {
      setError("Please log in before filing a complaint.");
      return;
    }

    try {
      await api.post("/complaints", { title, description });
      setTitle("");
      setDescription("");
      setMessage("Complaint submitted successfully.");
      loadComplaints();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to submit complaint.");
    }
  };

  return (
    <div>
      <Card title="File a Complaint">
        {message && <div className="alert" style={{ background: "#d1fae5", color: "#065f46" }}>{message}</div>}
        {error && <div className="alert">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label>Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="form-field">
            <label>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="5" required />
          </div>
          <button className="button" type="submit">Submit Complaint</button>
        </form>
      </Card>
      <Card title="Recent Complaints">
        {complaints.map((complaint) => (
          <div key={complaint._id} className="card">
            <h3>{complaint.title}</h3>
            <p>{complaint.description}</p>
            <p><strong>Status:</strong> {complaint.status}</p>
          </div>
        ))}
      </Card>
    </div>
  );
};

export default Complaints;
