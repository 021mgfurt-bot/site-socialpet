import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "../components/layout/MainLayout";
import { Home } from "../pages/Home";
import { Planos } from "../pages/Planos";
import { Privacidade } from "../pages/legal/Privacidade";
import { Cookies } from "../pages/legal/Cookies";
import { Termos } from "../pages/legal/Termos";
import { Contato } from "../pages/legal/Contato";
import { NotFound } from "../pages/NotFound";
import { ScrollToTop } from "./ScrollToTop";

export function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="planos" element={<Planos />} />
        </Route>
        <Route path="privacidade" element={<Privacidade />} />
        <Route path="cookies" element={<Cookies />} />
        <Route path="termos" element={<Termos />} />
        <Route path="contato" element={<Contato />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
