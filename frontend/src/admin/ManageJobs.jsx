import React from "react";
import api from "../services/api";
import Card from "../components/Card";

const ManageJobs = () => {
  const [jobs, setJobs] = React.useState([]);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const [form, setForm] = React.useState({
    title: "",
    company: "",
    description: "",
    city: "",
    location: "",
    category: "",
    salary: "",
  });

  const loadJobs = async () => {
    try {
      const response = await api.get("/jobs");
      setJobs(response.data);
    } catch (err) {
      setError("Unable to load jobs.");
    }
  };

  React.useEffect(() => {
    loadJobs();
  }, []);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleAddJob = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    try {
      await api.post("/jobs", form);
      setSuccess("Job added successfully.");
      setForm({ title: "", company: "", description: "", city: "", location: "", category: "", salary: "" });
      loadJobs();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to add job.");
    }
  };

  return (
    <div className="admin-panel">
      <Card title="Manage Jobs">
        {error && <div className="alert">{error}</div>}
        {success && <div className="alert success">{success}</div>}

        <form onSubmit={handleAddJob} className="admin-form">
          <div className="form-grid">
            <div className="form-field">
              <label>Title</label>
              <input name="title" value={form.title} onChange={handleChange} required />
            </div>
            <div className="form-field">
              <label>Company</label>
              <input name="company" value={form.company} onChange={handleChange} />
            </div>
            <div className="form-field">
              <label>City</label>
              <input name="city" value={form.city} onChange={handleChange} />
            </div>
            <div className="form-field">
              <label>Location</label>
              <input name="location" value={form.location} onChange={handleChange} />
            </div>
            <div className="form-field">
              <label>Category</label>
              <input name="category" value={form.category} onChange={handleChange} />
            </div>
            <div className="form-field">
              <label>Salary</label>
              <input name="salary" value={form.salary} onChange={handleChange} />
            </div>
            <div className="form-field full-width">
              <label>Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows="3" required />
            </div>
          </div>
          <div className="admin-actions">
            <button className="button" type="submit">Add Job</button>
          </div>
        </form>
      </Card>

      <Card title="Existing Jobs">
        <div className="card-grid">
          {jobs.map((job) => (
            <div key={job._id} className="card card-small">
              <h4>{job.title}</h4>
              <p><strong>{job.company}</strong></p>
              <p>{job.city || job.location}</p>
              <p><strong>Category:</strong> {job.category || "General"}</p>
              <p>{job.description}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ManageJobs;
