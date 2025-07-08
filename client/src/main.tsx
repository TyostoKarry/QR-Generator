import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "./contexts/AuthProvider.tsx";
import { QRProvider } from "./contexts/QRProvider.tsx";
import { Layout } from "./Layout.tsx";
import { QRGenerator } from "./pages/QrGenerator.tsx";
import { QrStorage } from "./pages/QrStorage.tsx";
import "./index.css";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "/", element: <QRGenerator /> },
        { path: "/storage", element: <QrStorage /> },
        { path: "*", element: <Navigate to="/" /> }, // Fallback to root for unmatched routes
      ],
    },
  ],
  { basename: import.meta.env.VITE_BASE_URL || "/" },
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <QRProvider>
        <RouterProvider router={router} />
        <Toaster richColors />
      </QRProvider>
    </AuthProvider>
  </StrictMode>,
);
