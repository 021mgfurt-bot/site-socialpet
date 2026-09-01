/**
 * Estrutura de dados dos planos comerciais do SocialPet (Prompt 12).
 *
 * Nenhum plano real existe ainda — preço, nome, período e limites não
 * foram decididos. Esta estrutura só define o formato que os planos vão
 * ter quando essa decisão acontecer, pra não precisar redesenhar
 * `Planos.tsx` do zero quando isso for implementado. `PLANS` fica vazio
 * de propósito: nenhum dado comercial inventado, nem escondido, nem "só
 * pra facilitar depois" (Prompt 12 §46).
 *
 * `PRICING_STATUS` é uma configuração interna, nunca um termo exposto ao
 * usuário — `Planos.tsx` usa esse valor só para decidir qual bloco de
 * conteúdo renderizar (hoje só existe o estado "ainda não lançado";
 * quando os planos existirem, um novo estado entra aqui e a página troca
 * de branch sem precisar de outra rota nem de outro componente).
 */

export type PricingStatus = "not-launched";

export const PRICING_STATUS: PricingStatus = "not-launched";

export type BillingPeriod = "monthly" | "yearly";

export interface PlanFeature {
  label: string;
}

export interface Plan {
  id: string;
  name: string | null;
  description: string | null;
  /** Em reais, ou `null` enquanto não houver preço decidido. */
  price: number | null;
  billingPeriod: BillingPeriod | null;
  features: PlanFeature[];
  /** Ex.: `{ pets: 3 }`. `null` enquanto não houver limite decidido. */
  limits: Record<string, number | null> | null;
  highlighted: boolean;
  cta: { label: string; href: string } | null;
  available: boolean;
}

export const PLANS: Plan[] = [];
