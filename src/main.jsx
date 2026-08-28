import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "@fontsource/noto-naskh-arabic/400.css";
import "@fontsource/noto-naskh-arabic/600.css";
import "@fontsource/noto-sans-bengali/400.css";
import "@fontsource/noto-sans-bengali/600.css";
import "./styles.css";
import { AppProviders } from "./providers/AppProviders";
import { router } from "./routes/router";
import { APP_NAME } from "./config/app";

document.title = APP_NAME;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppProviders><RouterProvider router={router} /></AppProviders>
  </StrictMode>,
);
