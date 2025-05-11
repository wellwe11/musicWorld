import { StrictMode } from "react";
import { scan } from "react-scan";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import routes from "./routes.jsx";

const router = createBrowserRouter(routes);

scan({
  enabled: true,
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
