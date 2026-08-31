import { Component, type ReactNode } from "react";

interface Props {
  fallback: ReactNode;
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Se a cena 3D falhar em tempo de execução (driver de GPU instável,
 * contexto WebGL perdido etc.), cai no mesmo fallback estático usado para
 * dispositivos sem suporte — nunca quebra o Hero.
 */
export class ThreeErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // eslint-disable-next-line no-console
    console.warn("HeroScene (Three.js) falhou, usando fallback estático.", error);
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}
