import { createContext, useCallback, useEffect, useMemo, useReducer } from "react";
import { tokenStorage } from "../utils/tokenStorage";
import { authService } from "../services/authService";

export const AuthContext = createContext(null);

const initialState = {
    user: tokenStorage.getUser(),
    token: tokenStorage.get(),
    isLoading: false,
    isInitialized: false,
    error: null,
};

function authReducer(state, action) {
    switch (action.type) {
        case "LOADING": return { ...state, isLoading: true, error: null };
        case "AUTH_SUCCESS": return { ...state, isLoading: false, user: action.user, token: action.token, error: null, isInitialized: true };
        case "AUTH_ERROR": return { ...state, isLoading: false, error: action.error, isInitialized: true };
        case "LOGOUT": return { ...initialState, user: null, token: null, isInitialized: true };
        case "INITIALIZED": return { ...state, isInitialized: true };
        default: return state;
    }
}

export function AuthProvider({ children }) {
    const [state, dispatch] = useReducer(authReducer, initialState);

    useEffect(() => {
        // Validate stored token on mount
        const token = tokenStorage.get();
        const user = tokenStorage.getUser();
        if (token && user) {
            dispatch({ type: "AUTH_SUCCESS", user, token });
        } else {
            dispatch({ type: "INITIALIZED" });
        }
    }, []);

    const login = useCallback(async (credentials) => {
        dispatch({ type: "LOADING" });
        try {
            const response = await authService.login(credentials);
            
            // 👇 YAHAN CHANGE HAI: Token alag nikala, aur baaki saari details ko 'user' object mein daal diya
            const { token, ...user } = response; 

            tokenStorage.set(token);
            tokenStorage.setUser(user);
            dispatch({ type: "AUTH_SUCCESS", user, token });
            return { success: true };
        } catch (err) {
            const error = err.response?.data?.message || "Login failed";
            dispatch({ type: "AUTH_ERROR", error });
            return { success: false, error };
        }
    }, []);

    const register = useCallback(async (data) => {
        dispatch({ type: "LOADING" });
        try {
            const response = await authService.register(data);
            
            // 👇 YAHAN BHI SAME CHANGE HAI
            const { token, ...user } = response;

            tokenStorage.set(token);
            tokenStorage.setUser(user);
            dispatch({ type: "AUTH_SUCCESS", user, token });
            return { success: true };
        } catch (err) {
            const error = err.response?.data?.message || "Registration failed";
            dispatch({ type: "AUTH_ERROR", error });
            return { success: false, error };
        }
    }, []);

    const logout = useCallback(() => {
        tokenStorage.clear();
        dispatch({ type: "LOGOUT" });
    }, []);

    const value = useMemo(() => ({
        ...state,
        isAuthenticated: !!state.token && !!state.user,
        isAdmin: state.user?.role === "admin",
        login,
        register,
        logout,
    }), [state, login, register, logout]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}