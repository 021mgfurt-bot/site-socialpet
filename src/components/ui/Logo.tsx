import { Link } from "react-router-dom";
import pawIcon from "../../assets/brand/icon-192.png";
import styles from "./Logo.module.css";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <Link to="/" className={`${styles.logo} ${className ?? ""}`} aria-label="SocialPet, ir para a página inicial">
      <img src={pawIcon} alt="" className={styles.icon} width={28} height={28} />
      <span className={styles.wordmark}>SocialPet</span>
    </Link>
  );
}
