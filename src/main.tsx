import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";
import "./index.css";
import App from "./App.tsx";
import { QRProvider } from "./contexts/QRProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QRProvider>
      <App />
      <Toaster richColors />
    </QRProvider>
  </StrictMode>,
);
