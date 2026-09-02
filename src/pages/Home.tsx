import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Hero } from "../sections/Hero";
import { InstallSpotlight } from "../sections/InstallSpotlight";
import { ProblemToSocialPet } from "../sections/ProblemToSocialPet";
import { Vaccination } from "../sections/Vaccination";
import { Expenses } from "../sections/Expenses";
import { Agenda } from "../sections/Agenda";
import { Album } from "../sections/Album";
import { Privacy } from "../sections/Privacy";
import { Plans } from "../sections/Plans";
import { Faq } from "../sections/Faq";
import { CtaFinal } from "../sections/CtaFinal";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useDocumentHead } from "../hooks/useDocumentHead";
import { scrollToSection } from "../lib/scrollToSection";

export function Home() {
  const location = useLocation();
  const reducedMotion = useReducedMotion();

  useDocumentHead({
    title: "SocialPet — a vida do seu pet, organizada com cuidado",
    description: "Vacinas, despesas, agenda e memórias de cada pet reunidas em um só lugar. Conheça o SocialPet.",
    path: "/",
  });

  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.replace("#", "");
    // Espera o layout assentar antes de rolar (evita mirar num offset errado
    // enquanto fontes/imagens ainda estão carregando).
    const timeoutId = window.setTimeout(() => scrollToSection(id, reducedMotion), 80);
    return () => window.clearTimeout(timeoutId);
  }, [location.hash, reducedMotion]);

  return (
    <>
      <Hero />
      <InstallSpotlight />
      <ProblemToSocialPet />
      <Vaccination />
      <Expenses />
      <Agenda />
      <Album />
      <Privacy />
      <Plans />
      <Faq />
      <CtaFinal />
    </>
  );
}
