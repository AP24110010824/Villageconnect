import api from "./api";

export const getExternalJobs = (filters) => {
  return api.get("/external/jobs", { params: filters });
};

export const getExternalSchemes = (filters) => {
  return api.get("/external/schemes", { params: filters });
};
