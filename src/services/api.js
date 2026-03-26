import axios from "axios";
import { tokenStorage } from "../utils/tokenStorage";

const BASE = import.meta.env.VITE_API_BASE_URL;
console.log("[api] Base URL:", BASE);

const api = axios.create({
    baseURL: BASE,
    timeout: 20000,
    headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
    (config) => {
        const token = tokenStorage.get();
        if (token) config.headers.Authorization = `Bearer ${token}`;
        if (import.meta.env.DEV) {
            console.log(`[api] ➡️  ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => {
        if (import.meta.env.DEV) {
            console.log(`[api] ✅ ${response.status} ${response.config.url}`);
        }
        return response.data;
    },
    (error) => {
        const status = error.response?.status;
        const url = error.config?.url;
        if (import.meta.env.DEV) {
            console.error(`[api] ❌ ${status || "ERR"} ${url}`, error.response?.data);
        }
        if (status === 401 && !url?.includes("/auth/")) {
            tokenStorage.clear();
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default api;