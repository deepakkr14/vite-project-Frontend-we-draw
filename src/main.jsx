import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Pe from '../src/components/peer.jsx'
import "./index.css";
// import { ContextProvider } from "./components/ConnectionStore.jsx";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* <ContextProvider> */}
      <App />
      {/* <Pe/> */}
    {/* // </ContextProvider> */}
   </React.StrictMode>
);
