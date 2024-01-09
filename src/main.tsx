/*
 * @LastEditors: John
 * @Date: 2023-12-29 10:31:13
 * @LastEditTime: 2024-01-09 14:06:09
 * @Author: John
 */
/*
 * @LastEditors: John
 * @Date: 2023-12-29 10:31:13
 * @LastEditTime: 2023-12-29 11:46:05
 * @Author: John
 */
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "../app/globals.css";
import { HashRouter } from "react-router-dom";
// import "amfe-flexible";
import VConsole from "vconsole";
import flexible from "./utils/flexible";

flexible(window, document);
const vConsole = new VConsole();
// or init with options
// const vConsole = new VConsole({ theme: 'dark' });

// call `console` methods as usual
console.log("Hello world");

// // remove it when you finish debugging
// vConsole.destroy();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
