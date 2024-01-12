/*
 * @LastEditors: John
 * @Date: 2024-01-03 08:51:29
 * @LastEditTime: 2024-01-12 13:46:13
 * @Author: John
 */
// import "./App.css";
import {
  Route,
  RouterProvider,
  Routes,
  createHashRouter,
} from "react-router-dom";
import Home from "./pages/Home";
import Participate from "./pages/Participate";
import { Toaster } from "@/components/ui/toaster";
import { useEffect, useRef } from "react";
import Profile from "./pages/Profile";
import Nav from "./components/common/Nav";
import ConnectWallet, {
  ConnectWallet_handleType,
} from "./components/common/ConnectWallet";
import { useAppDispatch } from "./store/hooks";
import { SET_WALLET_REF } from "./store/reducer";

// const router = createHashRouter([
//   {
//     path: "/",
//     element: <Home />,
//   },
//   {
//     path: "/participate",
//     element: <Participate />,
//   },
//   {
//     path: "/profile",
//     element: <Profile />,
//   },
// ]);
const App = () => {
  const connectWalletRef = useRef<ConnectWallet_handleType>(null);
  const dispatch = useAppDispatch();
  useEffect(() => {
    // dispatch(SET_WALLET_REF(connectWalletRef.current));
    return () => {};
  }, [connectWalletRef]);

  useEffect(() => {
    console.log("render");
  }, []);
  return (
    <div className="App">
      {/* <MetaMask/> */}
      {/* <UniSat /> */}
      {/* <Okx /> */}
      {/* <ConnectWallet className="mt-10" /> */}
      <Nav
        connectBtn={
          <ConnectWallet
            ref={connectWalletRef}
            onUpdate={(i, c, a) => {
              console.log(a);
            }}
          />
        }
      />
      {/* <RouterProvider router={router} /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/participate" element={<Participate />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
