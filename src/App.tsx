/*
 * @LastEditors: John
 * @Date: 2024-01-03 08:51:29
 * @LastEditTime: 2024-01-16 10:37:47
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
import CustomDialog from "./components/common/CustomDialog";
import flexible from "./utils/flexible";
import { SET_IS_SMALL_SCREEN } from "./store/sys";

const App = () => {
  const connectWalletRef = useRef<ConnectWallet_handleType>(null);
  const dispatch = useAppDispatch();
  useEffect(() => {
    // dispatch(SET_WALLET_REF(connectWalletRef.current));
    return () => {};
  }, [connectWalletRef]);

  useEffect(() => {
    flexible(window, document, (isSmall) => {
      // console.log("is small", isSmall);
      dispatch(SET_IS_SMALL_SCREEN(isSmall));
    });
    console.log("VITE_BASE_URL", import.meta.env.VITE_BASE_URL);
    console.log("render");
  }, []);
  return (
    <div className="App">
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
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/participate" element={<Participate />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <Toaster />
      <CustomDialog />
    </div>
  );
};

export default App;
