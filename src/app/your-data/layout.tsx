import { Header, Footer, Sidebar } from "../_components/layout";

import styles from "~/styles/global-styles.module.css";

export default function YourDataLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className={styles.pageContainer}>
        <Sidebar />
        {children}
      </div>
      <Footer />
    </>
  );
}
