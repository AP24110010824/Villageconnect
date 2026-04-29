const Scheme = require("../models/scheme");

const parseExternalSchemes = (data) => {
  const entries = data.records || data.results || data.data || data;
  if (!Array.isArray(entries)) {
    return [];
  }

  return entries.map((item) => ({
    title:
      item.title || item.name || item.scheme_name || item.scheme || item.scheme_title || "Untitled scheme",
    description:
      item.description || item.objective || item.details || item.purpose || "",
    city: item.city || item.district || item.town || item.area || "",
    state: item.state || item.state_name || "",
    field: item.field || item.sector || item.category || "",
    benefits:
      item.benefits || item.benefit || item.assistance || item.support || "",
    eligibility:
      item.eligibility || item.eligible || item.target_group || item.eligibility_criteria || "",
    startDate: item.startDate || item.start_date || item.launch_date || undefined,
    endDate: item.endDate || item.end_date || item.closure_date || undefined,
  }));
};

const createScheme = async (req, res) => {
  try {
    const { title, description, city, state, field, benefits, eligibility, startDate, endDate } = req.body;

    const scheme = await Scheme.create({
      title,
      description,
      city,
      state,
      field,
      benefits,
      eligibility,
      startDate,
      endDate,
    });

    res.status(201).json(scheme);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const importExternalSchemes = async (req, res) => {
  try {
    const schemeApiUrl = process.env.SCHEME_API_URL;
    if (!schemeApiUrl) {
      return res.status(400).json({ message: "SCHEME_API_URL is not configured in backend .env" });
    }

    const params = new URLSearchParams();
    const { city, state, field, search } = req.body;
    if (city) params.set("city", city);
    if (state) params.set("state", state);
    if (field) params.set("field", field);
    if (search) params.set("search", search);
    const url = `${schemeApiUrl}${schemeApiUrl.includes("?") ? "&" : "?"}${params.toString()}`;

    const response = await fetch(url, {
      headers: {
        ...(process.env.SCHEME_API_KEY ? { Authorization: `Bearer ${process.env.SCHEME_API_KEY}` } : {}),
      },
    });

    if (!response.ok) {
      throw new Error(`External scheme API returned ${response.status}`);
    }

    const data = await response.json();
    const parsed = parseExternalSchemes(data);
    const filtered = parsed.filter((item) => item.title && item.description);

    if (!filtered.length) {
      return res.status(400).json({ message: "External API returned no valid scheme records." });
    }

    const inserted = await Scheme.insertMany(filtered);
    res.json({ imported: inserted.length, records: inserted });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const importSchemesJson = async (req, res) => {
  try {
    const items = Array.isArray(req.body.schemes) ? req.body.schemes : [];

    if (!items.length) {
      return res.status(400).json({ message: "Invalid JSON body. Expected an array of schemes." });
    }

    const prepared = items.map((item) => ({
      title: item.title || item.name || "Untitled scheme",
      description: item.description || item.objective || "",
      city: item.city || "",
      state: item.state || "",
      field: item.field || item.sector || item.category || "",
      benefits: item.benefits || item.benefit || "",
      eligibility: item.eligibility || item.eligible || "",
      startDate: item.startDate || item.start_date,
      endDate: item.endDate || item.end_date,
    }));

    const inserted = await Scheme.insertMany(prepared);
    res.json({ imported: inserted.length, records: inserted });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSchemes = async (req, res) => {
  try {
    const { city, state, field, search } = req.query;
    const filter = {};

    if (city) {
      filter.city = { $regex: city.trim(), $options: "i" };
    }
    if (state) {
      filter.state = { $regex: state.trim(), $options: "i" };
    }
    if (field) {
      filter.field = { $regex: field.trim(), $options: "i" };
    }
    if (search) {
      const term = search.trim();
      filter.$or = [
        { title: { $regex: term, $options: "i" } },
        { description: { $regex: term, $options: "i" } },
        { benefits: { $regex: term, $options: "i" } },
      ];
    }

    const schemes = await Scheme.find(filter);
    res.json(schemes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSchemeById = async (req, res) => {
  try {
    const scheme = await Scheme.findById(req.params.id);

    if (!scheme) {
      return res.status(404).json({ message: "Scheme not found" });
    }

    res.json(scheme);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateScheme = async (req, res) => {
  try {
    const scheme = await Scheme.findById(req.params.id);

    if (!scheme) {
      return res.status(404).json({ message: "Scheme not found" });
    }

    ["title", "description", "city", "state", "field", "benefits", "eligibility", "startDate", "endDate"].forEach((field) => {
      if (req.body[field] !== undefined) {
        scheme[field] = req.body[field];
      }
    });

    const updatedScheme = await scheme.save();
    res.json(updatedScheme);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteScheme = async (req, res) => {
  try {
    const scheme = await Scheme.findById(req.params.id);

    if (!scheme) {
      return res.status(404).json({ message: "Scheme not found" });
    }

    await scheme.remove();
    res.json({ message: "Scheme removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createScheme, importExternalSchemes, importSchemesJson, getSchemes, getSchemeById, updateScheme, deleteScheme };
