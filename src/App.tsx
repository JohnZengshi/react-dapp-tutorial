/*
 * @LastEditors: John
 * @Date: 2024-01-03 08:51:29
 * @LastEditTime: 2024-01-03 17:22:51
 * @Author: John
 */
import "./App.css";
import ConnectWallet from "@/components/common/ConnectWallet";
import MetaMask from "./wallet/MetaMask";
import Okx from "./wallet/Okx";
import UniSat from "./wallet/UniSat";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Participate from "./pages/Participate";
import { Toaster } from "@/components/ui/toaster";
import { useEffect } from "react";
import Nav from "./components/common/Nav";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/participate",
    element: <Participate />,
  },
]);
const App = () => {
  useEffect(() => {
    console.log("render");
  }, []);
  return (
    <div className="App">
      {/* <MetaMask/> */}
      {/* <UniSat /> */}
      {/* <Okx /> */}
      {/* <ConnectWallet className="mt-10" /> */}
      <RouterProvider router={router} />
      <Toaster />
    </div>
  );
};

export default App;
