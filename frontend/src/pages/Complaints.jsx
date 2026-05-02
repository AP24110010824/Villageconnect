import React from "react";
import api from "../services/api";
import Card from "../components/Card";

const Complaints = ({ user }) => {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [complaints, setComplaints] = React.useState([]);
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState("");
  const [selectedComplaint, setSelectedComplaint] = React.useState(null);
  const [response, setResponse] = React.useState("");

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

  // Admin resolve complaint handler
  const handleResolveComplaint = async (complaintId) => {
    if (!response.trim()) {
      setError("Please enter a response.");
      return;
    }

    try {
      await api.put(`/complaints/${complaintId}`, {
        status: "resolved",
        response: response,
      });
      setResponse("");
      setSelectedComplaint(null);
      setMessage("Complaint resolved successfully.");
      loadComplaints();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to resolve complaint.");
    }
  };

  return (
    <div>
      {/* Users can file complaints */}
      {user?.role !== "admin" && (
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
      )}

      {/* Admins can resolve complaints */}
      {user?.role === "admin" && (
        <Card title="Resolve Complaints">
          {message && <div className="alert" style={{ background: "#d1fae5", color: "#065f46" }}>{message}</div>}
          {error && <div className="alert">{error}</div>}
          
          {!selectedComplaint ? (
            <div>
              <h4>Open Complaints</h4>
              {complaints.filter(c => c.status !== "resolved").map((complaint) => (
                <div key={complaint._id} className="card" style={{ marginBottom: "10px", padding: "10px", border: "1px solid #ddd" }}>
                  <h5>{complaint.title}</h5>
                  <p>{complaint.description}</p>
                  <p><strong>Filed by:</strong> {complaint.user?.name || "Unknown"}</p>
                  <p><strong>Status:</strong> {complaint.status}</p>
                  <button 
                    className="button" 
                    onClick={() => setSelectedComplaint(complaint)}
                  >
                    Resolve
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <h4>Resolving: {selectedComplaint.title}</h4>
              <p>{selectedComplaint.description}</p>
              <div className="form-field">
                <label>Your Response</label>
                <textarea 
                  value={response} 
                  onChange={(e) => setResponse(e.target.value)} 
                  rows="4" 
                  placeholder="Enter your resolution response..."
                  required 
                />
              </div>
              <button 
                className="button" 
                onClick={() => handleResolveComplaint(selectedComplaint._id)}
              >
                Submit Resolution
              </button>
              <button 
                className="button" 
                style={{ marginLeft: "10px", background: "#ccc" }}
                onClick={() => {
                  setSelectedComplaint(null);
                  setResponse("");
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </Card>
      )}

      {/* All users can view complaints */}
      <Card title="Recent Complaints">
        {complaints.map((complaint) => (
          <div key={complaint._id} className="card" style={{ marginBottom: "10px" }}>
            <h3>{complaint.title}</h3>
            <p>{complaint.description}</p>
            <p><strong>Status:</strong> {complaint.status}</p>
            {complaint.response && (
              <p><strong>Admin Response:</strong> {complaint.response}</p>
            )}
          </div>
        ))}
      </Card>
    </div>
  );
};

export default Complaints;