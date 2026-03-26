import api from "./api";

// POST /api/subscription/activate
// GET  /api/subscription/status
export const subscriptionService = {
  activate:  (data) => api.post("/subscription/activate", data),
  getStatus: ()     => api.get("/subscription/status"),
};