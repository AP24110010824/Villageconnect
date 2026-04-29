import React from "react";
import api from "../services/api";
import Card from "../components/Card";

const ManageSchemes = () => {
  const [schemes, setSchemes] = React.useState([]);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const [form, setForm] = React.useState({
    title: "",
    description: "",
    city: "",
    state: "",
    field: "",
    benefits: "",
    eligibility: "",
  });

  const loadSchemes = async () => {
    try {
      const response = await api.get("/schemes");
      setSchemes(response.data);
    } catch (err) {
      setError("Unable to load schemes.");
    }
  };

  React.useEffect(() => {
    loadSchemes();
  }, []);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleAddScheme = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    try {
      await api.post("/schemes", form);
      setSuccess("Scheme added successfully.");
      setForm({ title: "", description: "", city: "", state: "", field: "", benefits: "", eligibility: "" });
      loadSchemes();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to add scheme.");
    }
  };

  const handleImportExternal = async () => {
    setError("");
    setSuccess("");
    try {
      const response = await api.post("/schemes/import", { city: form.city, state: form.state, field: form.field, search: form.title });
      setSuccess(`${response.data.imported} schemes imported from the external API.`);
      loadSchemes();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to import external schemes.");
    }
  };

  const handleUploadJson = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setError("");
    setSuccess("");

    try {
      const text = await file.text();
      const json = JSON.parse(text);
      const response = await api.post("/schemes/import-json", { schemes: json });
      setSuccess(`${response.data.imported} schemes imported from file.`);
      loadSchemes();
    } catch (err) {
      setError(err.message || "Unable to import JSON file.");
    }
  };

  return (
    <div className="admin-panel">
      <Card title="Manage Schemes">
        {error && <div className="alert">{error}</div>}
        {success && <div className="alert success">{success}</div>}

        <form onSubmit={handleAddScheme} className="admin-form">
          <div className="form-grid">
            <div className="form-field">
              <label>Title</label>
              <input name="title" value={form.title} onChange={handleChange} required />
            </div>
            <div className="form-field">
              <label>Field</label>
              <input name="field" value={form.field} onChange={handleChange} />
            </div>
            <div className="form-field">
              <label>City</label>
              <input name="city" value={form.city} onChange={handleChange} />
            </div>
            <div className="form-field">
              <label>State</label>
              <input name="state" value={form.state} onChange={handleChange} />
            </div>
            <div className="form-field full-width">
              <label>Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows="3" required />
            </div>
            <div className="form-field">
              <label>Benefits</label>
              <input name="benefits" value={form.benefits} onChange={handleChange} />
            </div>
            <div className="form-field">
              <label>Eligibility</label>
              <input name="eligibility" value={form.eligibility} onChange={handleChange} />
            </div>
          </div>

          <div className="admin-actions">
            <button className="button" type="submit">Add Scheme</button>
            <button className="button secondary" type="button" onClick={handleImportExternal}>Import External Schemes</button>
            <label className="button secondary file-upload">
              Upload JSON
              <input type="file" accept="application/json" onChange={handleUploadJson} hidden />
            </label>
          </div>
        </form>
      </Card>

      <Card title="Existing Schemes">
        <div className="card-grid">
          {schemes.map((scheme) => (
            <div key={scheme._id} className="card card-small">
              <h4>{scheme.title}</h4>
              <p>{scheme.description}</p>
              <p><strong>Location:</strong> {scheme.city || "Any"}, {scheme.state || "Any"}</p>
              <p><strong>Field:</strong> {scheme.field || "General"}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ManageSchemes;
