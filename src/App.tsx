import { Route, Routes } from "react-router-dom";



import IndexPage from "@/pages/index";
import DocsPage from "@/pages/docs";
import PricingPage from "@/pages/pricing";
import BlogPage from "@/pages/blog";
import AboutPage from "@/pages/about";
import {useSwipeBehavior, useSwipeBehaviorRaw} from "@telegram-apps/sdk-react";
import {useEffect} from "react";

function App() {
  const swapBehavior = useSwipeBehavior();

  useEffect(() => {
    try {
      swapBehavior?.disableVerticalSwipe();
    } catch (e) {}
  }, [swapBehavior])

  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<DocsPage />} path="/docs" />
      <Route element={<PricingPage />} path="/pricing" />
      <Route element={<BlogPage />} path="/blog" />
      <Route element={<AboutPage />} path="/about" />
    </Routes>
  );
}

export default App;
