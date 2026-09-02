import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { Container } from "../components/ui/Container";
import { Button } from "../components/ui/Button";
import { TextLink } from "../components/ui/TextLink";
import { useRobotsMeta } from "../hooks/useRobotsMeta";
import { useDocumentHead } from "../hooks/useDocumentHead";
import styles from "./NotFound.module.css";

/**
 * Rota catch-all (Prompt 14 §16) — sem isso, uma URL inexistente em
 * produção (Vercel, SPA) renderizava a Home vazia por baixo da rota do
 * React Router não bater com nada, sem nenhuma explicação pro visitante.
 * `noindex` sempre, independente de `VITE_SITE_URL`: uma 404 nunca deve
 * ser indexada nem aparecer no sitemap (confirmado que não aparece —
 * `vite.seo.plugin.ts` só lista as rotas reais).
 */
export function NotFound() {
  useRobotsMeta("noindex, nofollow");
  useDocumentHead({
    title: "Página não encontrada | SocialPet",
    description: "Essa página não existe no site do SocialPet.",
    path: "/404",
  });

  return (
    <>
      <Header variant="reduced" />
      <main id="main-content" tabIndex={-1}>
        <Container>
          <div className={styles.page}>
            <span className={styles.eyebrow}>Erro 404</span>
            <h1 className={styles.title}>Essa página não existe.</h1>
            <p className={styles.copy}>
              O endereço que você tentou abrir não corresponde a nenhuma página do site do SocialPet.
            </p>
            <div className={styles.actions}>
              <Button href="/" variant="primary">
                Voltar para a Home
              </Button>
              <TextLink to="/contato" withArrow>
                Ficou com alguma dúvida?
              </TextLink>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
