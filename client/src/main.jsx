import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import {SocketProvider} from "./assets/component/SocketProvider";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  
    <BrowserRouter>
      <SocketProvider>
        <App />
      </SocketProvider>
    </BrowserRouter>
);
