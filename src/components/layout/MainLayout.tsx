import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function MainLayout() {
  return (
    <>
      <Header variant="full" />
      {/* tabIndex={-1}: torna o alvo do skip link programaticamente
          focável, sem entrar na ordem normal de Tab — sem isso, ativar o
          skip link movia a rolagem mas não o foco de verdade (achado no
          teste de teclado automatizado deste prompt). */}
      <main id="main-content" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
