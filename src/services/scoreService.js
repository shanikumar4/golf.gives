import api from "./api";

// POST /api/score
// GET  /api/score
export const scoreService = {
    submit: (data) => api.post("/score", data),
    get: () => api.get("/score"),
};