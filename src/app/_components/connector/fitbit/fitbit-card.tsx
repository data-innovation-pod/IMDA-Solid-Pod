import { FitbitConnectButton } from "./fitbit-connect-button";

import styles from "./fitbit-styles.module.css";

export interface CardProps {
  desc: string;
  logo: JSX.Element;
  title: string;
}

export default function FitbitCard({ desc, logo, title }: CardProps) {
  return (
    <div className={styles.cardContainer}>
      <div className={styles.logoContainer}>{logo}</div>
      <div className={styles.contentContainer}>
        <p className={styles.title}>{title}</p>
        <p className={styles.desc}>{desc}</p>
        <div className={styles.divider} />
        <FitbitConnectButton />
      </div>
    </div>
  );
}
