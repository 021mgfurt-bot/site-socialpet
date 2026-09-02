import { LegalPageLayout } from "./LegalPageLayout";

const TOC = [
  { id: "estado-atual", label: "Estado atual" },
  { id: "categorias", label: "Categorias de cookies" },
  { id: "preferencias", label: "Gerenciar preferências" },
];

export function Cookies() {
  return (
    <LegalPageLayout
      title="Política de Cookies"
      summary="Explicamos aqui quais cookies este site usa hoje. Se isso mudar, você vai encontrar a atualização nesta mesma página."
      path="/cookies"
      toc={TOC}
    >
      <section id="estado-atual">
        <h2>Estado atual</h2>
        <p>
          Neste momento, este site não usa cookies de análise, publicidade ou rastreamento de
          terceiros. Nenhum banner de consentimento aparece porque não há, hoje, nada além do que é
          estritamente necessário para a página funcionar.
        </p>
      </section>
      <section id="categorias">
        <h2>Categorias de cookies</h2>
        <p>
          Se o site passar a usar cookies de análise ou de marketing no futuro, esta página vai
          listar cada categoria separadamente, com a opção de aceitar ou recusar cada uma.
        </p>
      </section>
      <section id="preferencias">
        <h2>Gerenciar preferências</h2>
        <p>Texto em preparação. O painel de preferências entra em operação quando houver, de fato, alguma categoria opcional para gerenciar.</p>
      </section>
    </LegalPageLayout>
  );
}
