import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./Main";
import "./index.css";

const CONTAINER: HTMLElement | null = document.getElementById("root");

if (!CONTAINER) {
  throw new Error("root not found");
}

const ROOT = createRoot(CONTAINER);
ROOT.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
