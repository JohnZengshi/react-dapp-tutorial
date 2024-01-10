/*
 * @LastEditors: John
 * @Date: 2024-01-03 08:51:29
 * @LastEditTime: 2024-01-10 10:11:30
 * @Author: John
 */
// import "./App.css";
import { RouterProvider, createHashRouter } from "react-router-dom";
import Home from "./pages/Home";
import Participate from "./pages/Participate";
import { Toaster } from "@/components/ui/toaster";
import { useEffect } from "react";
const router = createHashRouter([
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
