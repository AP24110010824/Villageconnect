const getExternalJobs = async (req, res) => {
  const sampleJobs = [
    {
      title: "Agriculture Extension Officer",
      company: "State Agriculture Department",
      description: "Support farmers with crop planning, pest management and soil health advisory services.",
      location: "Pune, Maharashtra",
      city: "Pune",
      category: "Agriculture",
      sourceUrl: "https://www.themuse.com/jobs/agriculture-extension-officer",
    },
    {
      title: "Farm Manager",
      company: "GreenHarvest Farms",
      description: "Manage crop production, irrigation schedules and farm labour to improve yields.",
      location: "Bangalore, Karnataka",
      city: "Bangalore",
      category: "Agriculture",
      sourceUrl: "https://www.themuse.com/jobs/farm-manager",
    },
    {
      title: "Agritech Product Specialist",
      company: "AgriTech Solutions",
      description: "Help farmers adopt digital tools for farm monitoring, precision agriculture and market access.",
      location: "Hyderabad, Telangana",
      city: "Hyderabad",
      category: "Agriculture",
      sourceUrl: "https://www.themuse.com/jobs/agritech-product-specialist",
    },
  ];

  try {
    const { location, category, search } = req.query;
    const params = new URLSearchParams({ page: "1" });

    if (location) {
      params.set("location", location);
    }
    if (category) {
      params.set("category", category);
    }
    if (search) {
      params.set("search", search);
    }

    const url = `https://www.themuse.com/api/public/jobs?${params.toString()}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`External jobs request failed with status ${response.status}`);
    }

    const data = await response.json();
    const jobs = (data.results || []).map((item) => ({
      title: item.name,
      company: item.company?.name || "",
      description: item.contents ? item.contents.replace(/<[^>]*>/g, "").substring(0, 250) : "",
      location: item.locations?.map((loc) => loc.name).join(", ") || "",
      city: item.locations?.[0]?.name || "",
      category: item.categories?.[0]?.name || "",
      sourceUrl: item.refs?.landing_page || item.refs?.api || "",
    }));

    res.json(jobs.length ? jobs : sampleJobs);
  } catch (error) {
    res.json(sampleJobs);
  }
};

const getExternalSchemes = async (req, res) => {
  try {
    const schemeApiUrl = process.env.SCHEME_API_URL;
    const schemeApiKey = process.env.SCHEME_API_KEY;
    const { city, state, field, search } = req.query;

    const filterResults = (schemes) => {
      let filtered = schemes;

      if (city) {
        filtered = filtered.filter((scheme) =>
          scheme.city.toLowerCase().includes(city.toString().trim().toLowerCase())
        );
      }
      if (state) {
        filtered = filtered.filter((scheme) =>
          scheme.state.toLowerCase().includes(state.toString().trim().toLowerCase())
        );
      }
      if (field) {
        filtered = filtered.filter((scheme) =>
          scheme.field.toLowerCase().includes(field.toString().trim().toLowerCase())
        );
      }
      if (search) {
        const term = search.toString().trim().toLowerCase();
        filtered = filtered.filter(
          (scheme) =>
            scheme.title.toLowerCase().includes(term) ||
            scheme.description.toLowerCase().includes(term) ||
            scheme.benefits.toLowerCase().includes(term)
        );
      }

      return filtered;
    };

    const sampleSchemes = [
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
        description: "Weather-based crop insurance to protect farmers from crop loss.",
        city: "Lucknow",
        state: "Uttar Pradesh",
        field: "Agriculture",
        benefits: "Low premium crop insurance and fast claim settlement.",
        eligibility: "All farmers growing notified crops in notified areas.",
      },
      {
        title: "Pradhan Mantri Krishi Sinchai Yojana",
        description: "Expanding irrigation coverage and improving water use efficiency.",
        city: "Indore",
        state: "Madhya Pradesh",
        field: "Agriculture",
        benefits: "Support for micro-irrigation systems and field channels.",
        eligibility: "Farmer groups, farmer-producer organisations, and rural communities.",
      },
      {
        title: "Soil Health Card Scheme",
        description: "Soil testing, nutrient advice, and support for balanced fertilizer use.",
        city: "Bangalore",
        state: "Karnataka",
        field: "Agriculture",
        benefits: "Free soil testing reports and crop-specific recommendations.",
        eligibility: "All farmers seeking soil health improvements.",
      },
      {
        title: "National Agriculture Market (e-NAM)",
        description: "Digital trading platform for farmers to access better price discovery.",
        city: "Gurgaon",
        state: "Haryana",
        field: "Agriculture",
        benefits: "Market linkage, transparent pricing, and easier sale of produce.",
        eligibility: "Registered farmers and traders at e-NAM marketplaces.",
      },
      {
        title: "Paramparagat Krishi Vikas Yojana",
        description: "Support for organic farming clusters and sustainable agriculture.",
        city: "Patna",
        state: "Bihar",
        field: "Agriculture",
        benefits: "Subsidies for organic inputs and certification support.",
        eligibility: "Groups of farmers forming organic farming clusters.",
      },
      {
        title: "Agriculture Infrastructure Fund",
        description: "Loans and grants for farm storage, processing, and logistics projects.",
        city: "Chennai",
        state: "Tamil Nadu",
        field: "Agriculture",
        benefits: "Financial support for cold storage, warehouses, and value-addition.",
        eligibility: "Farmers, FPOs, agri-entrepreneurs, and cooperatives.",
      },
    ];

    const placeholderApiKeys = [
      "your_api_key_from_data_gov_in",
      "YOUR_API_KEY",
      "replace_me",
      "your_api_key",
      "data.gov"
    ];

    const isValidApiKey =
      typeof schemeApiKey === "string" &&
      schemeApiKey.trim() !== "" &&
      !placeholderApiKeys.some((placeholder) =>
        schemeApiKey.trim().toLowerCase().includes(placeholder.toLowerCase())
      );

    if (schemeApiUrl && isValidApiKey) {
      const params = new URLSearchParams();
      params.set("api-key", schemeApiKey.trim());
      params.set("format", "json");
      params.set("limit", "100");

      if (city) params.set("filters[city]", city);
      if (state) params.set("filters[state]", state);
      if (field) params.set("filters[field]", field);
      if (search) params.set("filters[title]", search);

      const url = `${schemeApiUrl}?${params.toString()}`;
      const response = await fetch(url);

      if (!response.ok) {
        console.warn(`External scheme API returned ${response.status}; returning sample schemes instead.`);
        return res.json(filterResults(sampleSchemes));
      }

      const data = await response.json();
      const schemes = data.records || [];
      if (!Array.isArray(schemes)) {
        console.warn("External scheme API returned unexpected data format; returning sample schemes instead.");
        return res.json(filterResults(sampleSchemes));
      }

      const parsedSchemes = schemes.map((item) => ({
        title: item.scheme_name || item.title || item.name || "Untitled scheme",
        description: item.objective || item.description || item.details || "",
        city: item.city || item.district || "",
        state: item.state || item.state_name || "",
        field: item.sector || item.field || item.category || "Agriculture",
        benefits: item.benefits || item.benefit || item.assistance || "",
        eligibility: item.eligibility || item.eligible || item.target_group || "",
      }));

      return res.json(filterResults(parsedSchemes));
    }

    console.warn("External scheme API key invalid or missing; returning sample schemes.");
    return res.json(filterResults(sampleSchemes));
  } catch (error) {
    console.warn("External scheme fetch failed, returning sample schemes.", error.message);
    return res.json(filterResults(sampleSchemes));
  }
};

module.exports = { getExternalJobs, getExternalSchemes };
