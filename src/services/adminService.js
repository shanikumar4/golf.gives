import api from "./api";

// POST   /api/admin/charity
// GET    /api/admin/users
// DELETE /api/admin/user/:id
export const adminService = {
    addCharity: (data) => api.post("/admin/charity", data),
    getUsers: () => api.get("/admin/users"),
    deleteUser: (id) => api.delete(`/admin/user/${id}`),
    getDashboardStats: () => api.get("/admin/dashboard"),
};