import React from "react";
import api from "../services/api";
import { getExternalJobs } from "../services/externalApi";
import Card from "../components/Card";

const JOB_CITIES = ["Pune", "Mumbai", "Bangalore", "Delhi", "Nashik", "Chennai"];
const JOB_CATEGORIES = ["Agriculture", "Health", "Education", "IT", "Government", "Business"];

const Jobs = () => {
  const [jobs, setJobs] = React.useState([]);
  const [externalJobs, setExternalJobs] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [externalLoading, setExternalLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [externalError, setExternalError] = React.useState("");
  const [city, setCity] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [locationLoading, setLocationLoading] = React.useState(false);

  const loadJobs = async (filters = {}) => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/jobs", { params: filters });
      setJobs(response.data);
    } catch (err) {
      setError("Unable to load jobs.");
    } finally {
      setLoading(false);
    }
  };

  const loadExternal = async (filters = {}) => {
    setExternalLoading(true);
    setExternalError("");

    try {
      const response = await getExternalJobs(filters);
      setExternalJobs(response.data);
    } catch (err) {
      setExternalError("Unable to load external jobs.");
    } finally {
      setExternalLoading(false);
    }
  };

  React.useEffect(() => {
    loadJobs();
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    loadJobs({ city, category, search });
  };

  const handleReset = () => {
    setCity("");
    setCategory("");
    setSearch("");
    loadJobs();
  };

  const handleExternalLoad = () => {
    loadExternal({ location: city, category, search });
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          const foundCity =
            data.address?.city || data.address?.town || data.address?.village || data.address?.county || "";

          if (foundCity) {
            setCity(foundCity);
            loadJobs({ city: foundCity, category, search });
          } else {
            setError("Unable to detect your city from location.");
          }
        } catch (err) {
          setError("Location lookup failed.");
        } finally {
          setLocationLoading(false);
        }
      },
      () => {
        setError("Location permission denied.");
        setLocationLoading(false);
      }
    );
  };

  return (
    <div>
      <Card title="Search Jobs">
        <form onSubmit={handleSearch}>
          <div className="form-field">
            <label>City</label>
            <select value={city} onChange={(e) => setCity(e.target.value)}>
              <option value="">All cities</option>
              {JOB_CITIES.map((cityOption) => (
                <option key={cityOption} value={cityOption}>
                  {cityOption}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">All categories</option>
              {JOB_CATEGORIES.map((categoryOption) => (
                <option key={categoryOption} value={categoryOption}>
                  {categoryOption}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label>Keyword</label>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="e.g. health" />
          </div>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
            <button className="button" type="submit">Search</button>
            <button className="button secondary" type="button" onClick={handleReset}>Reset</button>
            <button className="button secondary" type="button" onClick={handleUseMyLocation}>
              {locationLoading ? "Finding city..." : "Use my location"}
            </button>
            <button className="button secondary" type="button" onClick={handleExternalLoad}>
              Load external jobs
            </button>
          </div>
        </form>
        {error && <div className="alert">{error}</div>}
      </Card>

      <Card title="Available Jobs">
        {loading && <p>Loading jobs...</p>}
        {error && <div className="alert">{error}</div>}
        {!loading && !jobs.length && <p>No jobs are available right now.</p>}
        {jobs.map((job) => (
          <div key={job._id} className="card job-card">
            <div className="job-meta">
              {job.salary && <span className="detail-pill salary-pill">Salary: {job.salary}</span>}
              <span className="detail-pill keyword-pill">{job.city || job.location}</span>
              <span className="detail-pill keyword-pill">{job.category || "General"}</span>
            </div>
            <h3>{job.title}</h3>
            <p>
              <strong className="text-accent">Company:</strong> {job.company}
            </p>
            <p>{job.description}</p>
          </div>
        ))}
      </Card>

      <Card title="External Jobs">
        {externalLoading && <p>Loading external jobs...</p>}
        {externalError && <div className="alert">{externalError}</div>}
        {!externalLoading && !externalJobs.length && <p>No external jobs loaded.</p>}
        {externalJobs.map((job, index) => (
          <div key={`${job.title}-${index}`} className="card job-card">
            <div className="job-meta">
              {job.salary ? (
                <span className="detail-pill salary-pill">Salary: {job.salary}</span>
              ) : (
                <span className="detail-pill salary-pill">Competitive pay</span>
              )}
              <span className="detail-pill keyword-pill">{job.city || job.location || "Location unknown"}</span>
              <span className="detail-pill keyword-pill">{job.category || "General"}</span>
            </div>
            <h3>{job.title}</h3>
            <p>
              <strong className="text-accent">Company:</strong> {job.company}
            </p>
            <p>{job.description}</p>
            {job.sourceUrl && (
              <p>
                <a href={job.sourceUrl} target="_blank" rel="noreferrer">View job</a>
              </p>
            )}
          </div>
        ))}
      </Card>
    </div>
  );
};

export default Jobs;
