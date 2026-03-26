import { Toaster }  from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { AppProvider }  from "./context/AppContext";
import { AppRouter }    from "./router/AppRouter";

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppRouter />
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: "#161b27", color: "#fff", border: "1px solid #1e2535", borderRadius: "12px" },
            success: { iconTheme: { primary: "#22c55e", secondary: "#fff" } },
          }}
        />
      </AppProvider>
    </AuthProvider>
  );
}