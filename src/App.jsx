import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";

import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>

        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3200,
            className: "maiven-toast",
            success: { icon: <CheckCircle2 size={17} color="#1E9E5C" /> },
            error: { icon: <AlertCircle size={17} color="#E23B5A" /> },
            icon: <Info size={17} color="#7C4DFF" />,
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  );
}
