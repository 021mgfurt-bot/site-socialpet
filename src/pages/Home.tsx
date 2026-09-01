import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Hero } from "../sections/Hero";
import { InstallSpotlight } from "../sections/InstallSpotlight";
import { ProblemToSocialPet } from "../sections/ProblemToSocialPet";
import { Vaccination } from "../sections/Vaccination";
import { Expenses } from "../sections/Expenses";
import { Agenda } from "../sections/Agenda";
import { PlaceholderSection } from "../sections/PlaceholderSection";
import { HOME_SECTIONS } from "../data/homeSections";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { scrollToSection } from "../lib/scrollToSection";

export function Home() {
  const location = useLocation();
  const reducedMotion = useReducedMotion();

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
      {HOME_SECTIONS.map((section) => (
        <PlaceholderSection key={section.id} id={section.id} title={section.title} tone={section.tone} />
      ))}
    </>
  );
}
