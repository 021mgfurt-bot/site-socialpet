/**
 * Configuração central da URL da aplicação SocialPet.
 *
 * Nenhum componente deve montar essa URL na mão — sempre importar
 * `socialPetAppUrl` (ou `loginUrl`/`signUpUrl`) daqui.
 *
 * A aplicação real (legacy/) é uma SPA de arquivo único: a tela de
 * autenticação alterna entre cadastro, login e desbloqueio rápido por
 * classe CSS no cliente, não por rota própria (`?view=` só existe para
 * telas internas pós-login, ver legacy/app.js:1908). Não há, portanto,
 * uma rota pública distinta e confirmada para "/login" ou "/cadastro" —
 * os dois CTAs apontam para a raiz da aplicação até que essa distinção
 * exista de fato no produto.
 */

const FALLBACK_DEV_URL = "https://socialpethomologacao.ngrok.app/";

function readAppUrl(): string {
  const configured = import.meta.env.VITE_SOCIALPET_APP_URL;
  if (configured && configured.trim().length > 0) {
    return configured.trim();
  }

  if (import.meta.env.DEV) {
    return FALLBACK_DEV_URL;
  }

  throw new Error(
    "VITE_SOCIALPET_APP_URL não definida. Configure .env.local a partir de .env.example.",
  );
}

export const socialPetAppUrl = readAppUrl();

/** CTA "Entrar" — hoje, mesma raiz da aplicação (ver nota acima). */
export const loginUrl = socialPetAppUrl;

/** CTA "Criar minha conta" — hoje, mesma raiz da aplicação (ver nota acima). */
export const signUpUrl = socialPetAppUrl;
