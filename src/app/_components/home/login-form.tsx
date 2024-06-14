"use client";

import { useEffect, useState } from "react";
import Select from "./select";
import { logIn } from "~/app/_utils";
import { env } from "~/env.mjs";

import styles from "./home-styles.module.css";
import Link from "next/link";

interface Provider {
  label: string;
  oidcIssuer: string;
  value: string;
}

const PROVIDERS = [
  {
    label: "Community Solid Server (CSS) 1",
    oidcIssuer: env.NEXT_PUBLIC_CSS_BASE_URL,
    value: "css 1",
  },
  {
    label: "Community Solid Server (CSS) 2",
    oidcIssuer: env.NEXT_PUBLIC_CSS_BASE_URL_2,
    value: "css 2",
  },
];

export default function LoginForm() {
  const [selectedProvider, setSelectedProvider] = useState<Provider>(PROVIDERS[0]!);
  useEffect(() => {
    //    PROVIDERS.find((item) => item.oidcIssuer === localStorage.getItem("css_provider")) ?? PROVIDERS[0]!
    const storedProvider = localStorage.getItem("css_provider");
    if (storedProvider) {
      const foundProvider = PROVIDERS.find((item) => item.oidcIssuer === storedProvider);
      if (foundProvider) setSelectedProvider(foundProvider);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("css_provider", selectedProvider.oidcIssuer);
  }, [selectedProvider]);
  return (
    <>
      <Select<Provider>
        options={PROVIDERS}
        selectedOption={selectedProvider}
        setSelectedOption={setSelectedProvider}
      />
      <button
        data-testid="cy-login-button"
        onClick={() => logIn()}
        className={styles.primaryButton}>
        Sign in / Register
      </button>
      <Link
        href="/signin-faq"
        target="_blank">
        <button
          data-testid="cy-login-button"
          className={`${styles.secondaryButton} w-full`}>
          How to sign in / register
        </button>
      </Link>
      <Link
        href="/learnmore"
        target="_blank">
        <button
          data-testid="cy-login-button"
          className={`${styles.secondaryButton} w-full`}>
          Learn More
        </button>
      </Link>
    </>
  );
}
