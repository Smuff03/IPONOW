import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { Home } from "@/pages/Home";
import { IPODashboard } from "@/pages/IPODashboard";
import { IPODetail } from "@/pages/IPODetail";
import { Allotment } from "@/pages/Allotment";
import { Reviews } from "@/pages/Reviews";
import { Articles } from "@/pages/Articles";
import { ArticleDetail } from "@/pages/ArticleDetail";
import { About } from "@/pages/About";
import { Contact } from "@/pages/Contact";
import { Disclaimer, Privacy, Terms } from "@/pages/Legal";
import { NotFound } from "@/pages/NotFound";
import { Admin } from "@/pages/Admin";
import { ScrollToTop } from "@/components/ScrollToTop";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="admin" element={<Admin />} />
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="ipos" element={<IPODashboard />} />
          <Route path="ipo/:slug" element={<IPODetail />} />
          <Route path="allotment" element={<Allotment />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="articles" element={<Articles />} />
          <Route path="articles/:slug" element={<ArticleDetail />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="disclaimer" element={<Disclaimer />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="terms" element={<Terms />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
