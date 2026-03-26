import { createContext, useCallback, useMemo, useReducer } from "react";
import { dashboardService } from "../services/dashboardService";

export const AppContext = createContext(null);

const initialState = {
    dashboard: null,
    winnings: null,
    isLoadingDash: false,
    isLoadingWin: false,
    dashError: null,
};

function appReducer(state, action) {
    switch (action.type) {
        case "DASH_LOADING": return { ...state, isLoadingDash: true, dashError: null };
        case "DASH_SUCCESS": return { ...state, isLoadingDash: false, dashboard: action.data };
        case "DASH_ERROR": return { ...state, isLoadingDash: false, dashError: action.error };
        case "WIN_LOADING": return { ...state, isLoadingWin: true };
        case "WIN_SUCCESS": return { ...state, isLoadingWin: false, winnings: action.data };
        case "WIN_ERROR": return { ...state, isLoadingWin: false };
        case "RESET": return initialState;
        default: return state;
    }
}

export function AppProvider({ children }) {
    const [state, dispatch] = useReducer(appReducer, initialState);

    const fetchDashboard = useCallback(async () => {
        dispatch({ type: "DASH_LOADING" });
        try {
            const data = await dashboardService.getDashboard();
            dispatch({ type: "DASH_SUCCESS", data });
        } catch (err) {
            dispatch({ type: "DASH_ERROR", error: err.response?.data?.message || "Failed to load dashboard" });
        }
    }, []);

    const fetchWinnings = useCallback(async () => {
        dispatch({ type: "WIN_LOADING" });
        try {
            const data = await dashboardService.getWinnings();
            dispatch({ type: "WIN_SUCCESS", data });
        } catch {
            dispatch({ type: "WIN_ERROR" });
        }
    }, []);

    const resetApp = useCallback(() => dispatch({ type: "RESET" }), []);

    const value = useMemo(() => ({
        ...state,
        fetchDashboard,
        fetchWinnings,
        resetApp,
    }), [state, fetchDashboard, fetchWinnings, resetApp]);

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}