import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { ErrorBoundary } from "./components/ErrorBoundary";
import 'draft-js/dist/Draft.css';
import { BrowserRouter } from "react-router-dom";
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <ErrorBoundary>
    <BrowserRouter>
    <App />
    </BrowserRouter>
    </ErrorBoundary>
  </Provider>
);