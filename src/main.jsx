import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
import { PublicRoute } from "./components/PublicRoute.jsx";
import { Toaster } from "react-hot-toast";
import { SleepProvider } from "./contexts/SleepContext.jsx";
import { MantineProvider } from "@mantine/core";
import AuthPages from "./pages/AuthPages.jsx";

export const router = createBrowserRouter([
  {
    path: "/auth",
    element: <PublicRoute />,
    children: [
      {
        path: "/login",
        element: <AuthPages />,
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <App />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MantineProvider>
      <AuthProvider>
        <SleepProvider>
          <Toaster position="top-right" />
          <RouterProvider router={router} />
        </SleepProvider>
      </AuthProvider>
    </MantineProvider>
  </StrictMode>,
);
