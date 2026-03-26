import api from "./api";

// POST /api/draw
// GET /api/draw/latest
export const drawService = {
    run: (data) => api.post("/draw", data),
    getLatest: () => api.get(`/draw/latest?t=${Date.now()}`),
};