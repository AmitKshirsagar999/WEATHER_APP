import React from "react";
import ReactDOM from "react-dom/client"; // Updated import
import { StrictMode } from "react";

import App from "./App";

const rootElement = document.getElementById("root");
ReactDOM.createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
