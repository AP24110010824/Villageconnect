import React from "react";
import api from "../services/api";
import { getExternalSchemes } from "../services/externalApi";
import Card from "../components/Card";

const Agriculture = () => {
  const [schemes, setSchemes] = React.useState([]);
  const [externalSchemes, setExternalSchemes] = React.useState([]);
  const [jobs, setJobs] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [externalLoading, setExternalLoading] = React.useState(true);
  const [jobLoading, setJobLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [externalError, setExternalError] = React.useState("");

  const loadSchemes = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/schemes", { params: { field: "Agriculture" } });
      setSchemes(response.data);
    } catch (err) {
      setError("Unable to load agriculture schemes.");
    } finally {
      setLoading(false);
    }
  };

  const loadExternalSchemes = async () => {
    setExternalLoading(true);
    setExternalError("");
    try {
      const response = await getExternalSchemes({ field: "Agriculture" });
      setExternalSchemes(response.data);
    } catch (err) {
      setExternalError("Unable to load external agriculture schemes.");
    } finally {
      setExternalLoading(false);
    }
  };

  const loadJobs = async () => {
    setJobLoading(true);
    try {
      const response = await api.get("/jobs", { params: { category: "Agriculture" } });
      setJobs(response.data);
    } catch (err) {
      setError((prev) => prev || "Unable to load agriculture jobs.");
    } finally {
      setJobLoading(false);
    }
  };

  React.useEffect(() => {
    loadSchemes();
    loadExternalSchemes();
    loadJobs();
  }, []);

  return (
    <div>
      <Card title="Agriculture Support for Villages">
        <p>VillageConnect now connects you to actual farming schemes, crop insurance support, and agriculture jobs.</p>
        <ul>
          <li>Get details on farmer-focused government schemes like PM Kisan and PMFBY.</li>
          <li>See support for irrigation, organic farming, market access, and soil health.</li>
          <li>Explore local agriculture jobs and outreach roles for rural communities.</li>
        </ul>
      </Card>

      <Card title="Agriculture Schemes in the Database">
        {loading && <p>Loading agriculture schemes...</p>}
        {error && <div className="alert">{error}</div>}
        {!loading && !schemes.length && <p>No agriculture schemes found yet.</p>}
        {schemes.map((scheme) => (
          <div key={scheme._id} className="card">
            <h3>{scheme.title}</h3>
            <p><strong>Location:</strong> {scheme.city || "Nationwide"}, {scheme.state || "Any"}</p>
            <p>{scheme.description}</p>
            <p><strong>Benefits:</strong> {scheme.benefits || "Not specified"}</p>
            <p><strong>Eligibility:</strong> {scheme.eligibility || "Not specified"}</p>
          </div>
        ))}
      </Card>

      <Card title="External Agriculture Schemes">
        {externalLoading && <p>Loading external agriculture schemes...</p>}
        {externalError && <div className="alert">{externalError}</div>}
        {!externalLoading && !externalSchemes.length && <p>No external agriculture schemes available.</p>}
        {externalSchemes.map((scheme, index) => (
          <div key={`${scheme.title}-${index}`} className="card">
            <h3>{scheme.title}</h3>
            <p><strong>Location:</strong> {scheme.city || "Nationwide"}, {scheme.state || "Any"}</p>
            <p>{scheme.description}</p>
            <p><strong>Benefits:</strong> {scheme.benefits || "Not specified"}</p>
            <p><strong>Eligibility:</strong> {scheme.eligibility || "Not specified"}</p>
          </div>
        ))}
      </Card>

      <Card title="Agriculture Jobs">
        {jobLoading && <p>Loading agriculture jobs...</p>}
        {!jobLoading && !jobs.length && <p>No agriculture jobs are posted yet.</p>}
        {jobs.map((job) => (
          <div key={job._id} className="card">
            <h3>{job.title}</h3>
            <p><strong>Employer:</strong> {job.company}</p>
            <p><strong>Location:</strong> {job.city || "Local"}</p>
            <p>{job.description}</p>
            <p><strong>Salary:</strong> {job.salary || "Not specified"}</p>
          </div>
        ))}
      </Card>
    </div>
  );
};

export default Agriculture;
