import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import BlogPage from "@/pages/blog";
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
      <Route element={<BlogPage />} path="/blog" />
    </Routes>
  );
}

export default App;
