import React from "react";
import api from "../services/api";
import { getExternalSchemes } from "../services/externalApi";
import Card from "../components/Card";

const SCHEME_CITIES = ["Pune", "Mumbai", "Bangalore", "Delhi", "Nashik", "Chennai"];
const SCHEME_STATES = ["Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "Gujarat"];
const SCHEME_FIELDS = ["Agriculture", "Health", "Education", "Entrepreneurship", "Social Welfare"];

const Schemes = () => {
  const [schemes, setSchemes] = React.useState([]);
  const [externalSchemes, setExternalSchemes] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [externalLoading, setExternalLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [externalError, setExternalError] = React.useState("");
  const [city, setCity] = React.useState("");
  const [stateFilter, setStateFilter] = React.useState("");
  const [field, setField] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [locationLoading, setLocationLoading] = React.useState(false);

  const loadSchemes = async (filters = {}) => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/schemes", { params: filters });
      setSchemes(response.data);
    } catch (err) {
      setError("Unable to load schemes.");
    } finally {
      setLoading(false);
    }
  };

  const loadExternal = async (filters = {}) => {
    setExternalLoading(true);
    setExternalError("");

    try {
      const response = await getExternalSchemes(filters);
      setExternalSchemes(response.data);
    } catch (err) {
      setExternalError("Unable to load external schemes.");
    } finally {
      setExternalLoading(false);
    }
  };

  React.useEffect(() => {
    loadSchemes();
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    loadSchemes({ city, state: stateFilter, field, search });
  };

  const handleReset = () => {
    setCity("");
    setStateFilter("");
    setField("");
    setSearch("");
    loadSchemes();
  };

  const handleExternalLoad = () => {
    loadExternal({ city, state: stateFilter, field, search });
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
            loadSchemes({ city: foundCity, state: stateFilter, field, search });
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
      <Card title="Search Schemes">
        <form onSubmit={handleSearch}>
          <div className="form-field">
            <label>City</label>
            <select value={city} onChange={(e) => setCity(e.target.value)}>
              <option value="">All cities</option>
              {SCHEME_CITIES.map((cityOption) => (
                <option key={cityOption} value={cityOption}>
                  {cityOption}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label>State</label>
            <select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)}>
              <option value="">All states</option>
              {SCHEME_STATES.map((stateOption) => (
                <option key={stateOption} value={stateOption}>
                  {stateOption}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label>Field</label>
            <select value={field} onChange={(e) => setField(e.target.value)}>
              <option value="">All fields</option>
              {SCHEME_FIELDS.map((fieldOption) => (
                <option key={fieldOption} value={fieldOption}>
                  {fieldOption}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label>Keyword</label>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="e.g. farmers" />
          </div>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
            <button className="button" type="submit">Search</button>
            <button className="button secondary" type="button" onClick={handleReset}>Reset</button>
            <button className="button secondary" type="button" onClick={handleUseMyLocation}>
              {locationLoading ? "Finding city..." : "Use my location"}
            </button>
            <button className="button secondary" type="button" onClick={handleExternalLoad}>
              Load external schemes
            </button>
          </div>
        </form>
        {error && <div className="alert">{error}</div>}
      </Card>

      <Card title="Government Schemes">
        {loading && <p>Loading schemes...</p>}
        {error && <div className="alert">{error}</div>}
        {!loading && !schemes.length && <p>No schemes are available right now.</p>}
        {schemes.map((scheme) => (
          <div key={scheme._id} className="card job-card">
            <div className="job-meta">
              <span className="detail-pill">{scheme.city || "All"}</span>
              <span className="detail-pill">{scheme.state || "Any"}</span>
              <span className="detail-pill">{scheme.field || "General"}</span>
            </div>
            <h3>{scheme.title}</h3>
            <p>{scheme.description}</p>
            <p>
              <strong className="text-accent">Eligibility:</strong> {scheme.eligibility || "Not specified"}
            </p>
          </div>
        ))}
      </Card>

      <Card title="External Schemes">
        {externalLoading && <p>Loading external schemes...</p>}
        {externalError && <div className="alert">{externalError}</div>}
        {!externalLoading && !externalSchemes.length && <p>No external schemes loaded.</p>}
        {externalSchemes.map((scheme, index) => (
          <div key={`${scheme.title}-${index}`} className="card job-card">
            <div className="job-meta">
              <span className="detail-pill">{scheme.city || "All"}</span>
              <span className="detail-pill">{scheme.state || "Any"}</span>
              <span className="detail-pill">{scheme.field || "General"}</span>
            </div>
            <h3>{scheme.title}</h3>
            <p>{scheme.description}</p>
            <p>
              <strong className="text-accent">Eligibility:</strong> {scheme.eligibility || "Not specified"}
            </p>
          </div>
        ))}
      </Card>
    </div>
  );
};

export default Schemes;
