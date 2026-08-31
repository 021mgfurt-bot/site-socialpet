import { LegalPageLayout } from "./LegalPageLayout";

const TOC = [
  { id: "quais-dados", label: "Quais dados pedimos" },
  { id: "como-usamos", label: "Como usamos esses dados" },
  { id: "suas-escolhas", label: "Suas escolhas" },
  { id: "contato", label: "Contato" },
];

export function Privacidade() {
  return (
    <LegalPageLayout
      title="Política de Privacidade"
      summary="Aqui vai explicar, em português simples, o que o SocialPet coleta sobre você e sobre seus pets, para que serve e como você pode saber mais."
      toc={TOC}
    >
      <section id="quais-dados">
        <h2>Quais dados pedimos</h2>
        <p>Texto em preparação. Esta seção ainda não tem a versão final.</p>
      </section>
      <section id="como-usamos">
        <h2>Como usamos esses dados</h2>
        <p>Texto em preparação. Esta seção ainda não tem a versão final.</p>
      </section>
      <section id="suas-escolhas">
        <h2>Suas escolhas</h2>
        <p>Texto em preparação. Esta seção ainda não tem a versão final.</p>
      </section>
      <section id="contato">
        <h2>Contato</h2>
        <p>Texto em preparação. Esta seção ainda não tem a versão final.</p>
      </section>
    </LegalPageLayout>
  );
}
