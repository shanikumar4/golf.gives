import api from "./api";

export const configService = {
    get: () => api.get("/config").then(res => res.data),
    setPool: (amount) => api.post("/config/pool", { amount }).then(res => res.data)
};
