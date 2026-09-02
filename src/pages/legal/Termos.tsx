import { LegalPageLayout } from "./LegalPageLayout";

const TOC = [
  { id: "sobre-o-site", label: "Sobre este site" },
  { id: "sobre-a-aplicacao", label: "Sobre o aplicativo SocialPet" },
  { id: "limitacoes", label: "Limitações" },
  { id: "contato", label: "Contato" },
];

export function Termos() {
  return (
    <LegalPageLayout
      title="Termos de Uso"
      summary="As regras de uso deste site institucional, e a diferença entre navegar aqui e usar o aplicativo SocialPet."
      path="/termos"
      toc={TOC}
    >
      <section id="sobre-o-site">
        <h2>Sobre este site</h2>
        <p>Texto em preparação. Esta seção ainda não tem a versão final.</p>
      </section>
      <section id="sobre-a-aplicacao">
        <h2>Sobre o aplicativo SocialPet</h2>
        <p>
          Este site é institucional: ele apresenta o SocialPet, mas o cadastro, o login e o uso do
          produto acontecem no aplicativo, fora deste domínio.
        </p>
      </section>
      <section id="limitacoes">
        <h2>Limitações</h2>
        <p>Texto em preparação. Esta seção ainda não tem a versão final.</p>
      </section>
      <section id="contato">
        <h2>Contato</h2>
        <p>Texto em preparação. Esta seção ainda não tem a versão final.</p>
      </section>
    </LegalPageLayout>
  );
}
