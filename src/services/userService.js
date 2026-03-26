import api from "./api";

// GET  /api/user/profile
// PUT  /api/user/profile
// PUT  /api/user/change-password
export const userService = {
  getProfile:     ()     => api.get("/user/profile"),
  updateProfile:  (data) => api.put("/user/profile",         data),
  changePassword: (data) => api.put("/user/change-password", data),
};