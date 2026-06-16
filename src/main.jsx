import React from "react";
import { createRoot } from "react-dom/client";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { App } from "./App.jsx";
import "./styles.css";

const convexUrl = import.meta.env.VITE_CONVEX_URL;
const convexClient = convexUrl ? new ConvexReactClient(convexUrl) : null;

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {convexClient ? (
      <ConvexProvider client={convexClient}>
        <App backendEnabled />
      </ConvexProvider>
    ) : (
      <App backendEnabled={false} />
    )}
  </React.StrictMode>,
);
