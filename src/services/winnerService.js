import api from "./api";

// POST /api/winner/calculate
// POST /api/winner/prize
// POST /api/winner/upload-proof
// POST /api/winner/verify
export const winnerService = {
    calculate: (data) => api.post("/winner/calculate", data),
    prize: (data) => api.post("/winner/prize", data),
    uploadProof: (formData) => api.post("/winner/upload-proof", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    }),
    verify: (data) => api.post("/winner/verify", data),
};