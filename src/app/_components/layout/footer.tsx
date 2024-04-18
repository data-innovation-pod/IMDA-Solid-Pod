import ImdaLogo from "~/app/_assets/svg/imda-logo";
import styles from "./layout-styles.module.css";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <div className={styles.footer}>
      <ImdaLogo />
      <p>
        {`© ${currentYear}, Infocomm Media Development Authority. `}
        <Link
          className="underline"
          href="/privacy"
          target="_blank">
          Privacy Statement
        </Link>
      </p>{" "}
    </div>
  );
}
