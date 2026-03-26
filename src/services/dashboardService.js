import api from "./api";

// GET /api/dashboard
// GET /api/dashboard/winnings
export const dashboardService = {
    getDashboard: () => api.get("/dashboard"),
    getWinnings: () => api.get("/dashboard/winnings"),
};