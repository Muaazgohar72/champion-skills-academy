import { createRoot } from "react-dom/client";
import { setBaseUrl } from "@workspace/api-client-react";
import App from "./App";
import "./index.css";

// Points API calls at the deployed backend (e.g. your Render service).
// Set VITE_API_URL in Netlify's environment variables, e.g.
// https://your-api.onrender.com — no trailing slash.
const apiUrl = import.meta.env.VITE_API_URL;
if (apiUrl) {
  setBaseUrl(apiUrl);
} else if (import.meta.env.PROD) {
  console.warn(
    "VITE_API_URL is not set. Registration and admin login will fail because API requests have no backend to reach.",
  );
}

createRoot(document.getElementById("root")!).render(<App />);
