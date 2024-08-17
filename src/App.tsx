import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import MyBetsPage from "@/pages/my-bets";
import {useSwipeBehavior, useSwipeBehaviorRaw, useViewport} from "@telegram-apps/sdk-react";
import {useEffect} from "react";

function App() {
  const swapBehavior = useSwipeBehavior();
  const viewport = useViewport()

  useEffect(() => {
    console.log("swapBehavior")
    try {
      console.log("swapBehavior disableVerticalSwipe")
      swapBehavior?.disableVerticalSwipe();
    } catch (e) {}
  }, [swapBehavior])

  useEffect(() => {
    console.log("viewport")
    try {
      console.log("viewport expand")
      viewport.expand()
    } catch (e) {}
  }, [viewport])

  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<MyBetsPage />} path="/my-bets" />
    </Routes>
  );
}

export default App;
