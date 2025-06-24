import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./contexts/AuthProvider.tsx";
import { QRProvider } from "./contexts/QRProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <QRProvider>
        <App />
        <Toaster richColors />
      </QRProvider>
    </AuthProvider>
  </StrictMode>,
);
