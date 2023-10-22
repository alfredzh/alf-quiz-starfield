import React from "react";
import ReactDOM from "react-dom";
import App from "./components/layout/app";
import "rodal/lib/rodal.css";
import "./styles/fonts.scss";
import "./styles/style.scss";

// const socket = new WebSocket("ws://localhost:3100");
// socket.onopen = () => {
//   console.log("WebSocket is connected");
// };
// socket.onmessage = (e) => {
//   myEmitter.emit(e.data);
// };

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
