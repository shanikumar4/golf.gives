import api from "./api";

// GET  /api/charity
// POST /api/charity/select
export const charityService = {
    getAll: () => api.get("/charity"),
    select: (data) => api.post("/charity/select", data),
};