import React from "react";
import ReactDOM from "react-dom/client";
import Approuter from "./Routes/Approuter";

// Import Bootstrap and other styles
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
import "@fortawesome/fontawesome-free/css/fontawesome.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./assets/css/line-awesome.min.css";
import "./assets/scss/main.scss";
import "./assets/css/material.css";

// Find the root element in the HTML
const rootElement = document.getElementById("root");

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <Approuter />
    </React.StrictMode>
  );
} else {
  console.error("Root element not found");
}
