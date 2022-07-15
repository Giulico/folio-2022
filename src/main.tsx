// Scroll top on page load
import "intersection-observer"; // polyfills the native IntersectionObserver (i.e. Safari 12)

import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

// Global styles
import "styles/index.css";

// Store
import store from "store";

// Components
import App from "components/App";

const rootElement = document.getElementById("root");

if (!rootElement) throw new Error("Failed to find the root element");

const root = ReactDOM.createRoot(rootElement);
root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <App />
  </Provider>
  // </React.StrictMode>
);
