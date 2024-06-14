"use client";

import { PodLogo } from "./_assets/svg";
import { LoginForm } from "./_components/home";
import { Footer } from "./_components/layout";
import { useEffect, useState } from "react";
import styles from "./home-styles.module.css";

export default function Login() {
  const [currentSession, setCurrentSession] = useState<string>("");

  useEffect(() => {
    const session = localStorage.getItem("solidClientAuthn:currentSession") ?? "";
    setCurrentSession(session);
  }, []);

  if (currentSession.length > 0) {
    return (
      <div className={styles.loaderContainer}>
        <div className={styles.loader} />
        <p>Redirecting...</p>
      </div>
    );
  }

  return (
    <div
      data-testid="cy-home"
      className={styles.homeContainer}>
      <main className={styles.mainContainer}>
        <div
          className={styles.imageContainer}
          style={{ backgroundImage: "url('/images/login-bg-image.png')" }}
        />
        <div className={styles.formBackground}>
          <div className={styles.formContainer}>
            <div className={styles.logoContainer}>
              <PodLogo />
            </div>
            <h1 className={styles.formTitle}>IMDA Solid PODS (Proof-of-Concept)</h1>
            <p className={styles.formSubtitle}>My Pod, my data, my choice</p>
            <LoginForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
