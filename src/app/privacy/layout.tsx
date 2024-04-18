import { Header, Footer, Sidebar } from "../_components/layout";

import styles from "~/styles/global-styles.module.css";

export default function HelpLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header variant="empty" />
      <div className={styles.pageContainer}>
        <Sidebar variant="empty" />
        <main className={styles.mainContainer}>{children}</main>
      </div>
      <Footer />
    </>
  );
}
