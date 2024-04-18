import styles from "./home-styles.module.css";

export default function Page404() {
  return (
    <div className={styles.errorPage}>
      <p>404 Page not found!</p>
    </div>
  );
}
