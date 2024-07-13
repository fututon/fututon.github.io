import { Route, Routes } from "react-router-dom";



import IndexPage from "@/pages/index";
import DocsPage from "@/pages/docs";
import PricingPage from "@/pages/pricing";
import BlogPage from "@/pages/blog";
import AboutPage from "@/pages/about";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/futu-web" />
      <Route element={<DocsPage />} path="/futu-web/docs" />
      <Route element={<PricingPage />} path="/futu-web/pricing" />
      <Route element={<BlogPage />} path="/futu-web/blog" />
      <Route element={<AboutPage />} path="/futu-web/about" />
    </Routes>
  );
}

export default App;
