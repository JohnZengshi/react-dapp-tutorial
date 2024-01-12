/*
 * @LastEditors: John
 * @Date: 2023-12-29 10:31:13
 * @LastEditTime: 2024-01-12 14:40:36
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
// import "amfe-flexible";
import VConsole from "vconsole";
import flexible from "./utils/flexible";
import { getUrlQueryParam } from "./utils";
import store from "@/store/store";
import { Provider } from "react-redux";
import { HashRouter } from "react-router-dom";
// 打开控制台
if (getUrlQueryParam("vconsole") === "1") {
  new VConsole();
}
flexible(window, document);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Provider store={store}>
    <HashRouter>
      <App />
    </HashRouter>
  </Provider>
);
