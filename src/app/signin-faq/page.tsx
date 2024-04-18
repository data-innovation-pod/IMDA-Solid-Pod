import styles from "./signin_faq-page-styles.module.css";
import signInStep1 from "../_assets/images/sign_in_step_1.png";
import signInStep2 from "../_assets/images/sign_in_step_2.png";
import signInStep3 from "../_assets/images/sign_in_step_3.png";
import signInLast from "../_assets/images/sign_in_last_pic.png";
import signUpStep1 from "../_assets/images/sign_up_step_1.png";
import signUpStep2 from "../_assets/images/sign_up_step_2.png";
import signUpStep3 from "../_assets/images/sign_up_step_3.png";
import signUpStep4 from "../_assets/images/sign_up_step_4.png";
import signUpStep51 from "../_assets/images/sign_up_step_51.png";
import signUpStep52 from "../_assets/images/sign_up_step_52.png";
import signUpStep6 from "../_assets/images/sign_up_step_6.png";
import signUpStep7 from "../_assets/images/sign_up_step_7.png";
import signUpLast from "../_assets/images/sign_up_last_pic.png";

import Image from "next/image";

export default function SignInFaqPage() {
  return (
    <>
      <h1 className={styles.pageTitle}>User Guide</h1>
      <section>
        <p className={styles.sectionTitle}>Signing up as a new user</p>

        <p className={styles.paraText}>1. At the homepage:</p>
        <ul className="ml-4">
          <li>
            a. Select a provider. <strong>Remember this choice</strong>.
          </li>
          <li>b. Click “Sign In / Register”.</li>
        </ul>
        <Image
          src={signUpStep1}
          alt="Sign-up Step 1"
          className={styles.paraImage}
        />

        <p className={styles.paraText}>2. At the Community Solid Server’s (CSS) Login page:</p>
        <ul className="ml-4">
          <li>a. Click the “Sign up” link.</li>
        </ul>
        <Image
          src={signUpStep2}
          alt="Sign-up Step 2"
          className={styles.paraImage}
        />

        <p className={styles.paraText}>3. At the CSS’ Registration page:</p>
        <ul className="ml-4">
          <li>a. Enter your email address and password.</li>
          <li>b. Click “Register”.</li>
        </ul>
        <Image
          src={signUpStep3}
          alt="Sign-up Step 3"
          className={styles.paraImage}
        />

        <p className={styles.paraText}>4. At the CSS’ Your Account page:</p>
        <ul className="ml-4">
          <li>a. Click “Create pod”.</li>
        </ul>
        <Image
          src={signUpStep4}
          alt="Sign-up Step 4"
          className={styles.paraImage}
        />

        <p className={styles.paraText}>5. At the CSS’ Create Account page:</p>
        <ul className="ml-4">
          <li>a. Enter a name for your pod.</li>
          <li>b. Click “Create pod”.</li>
        </ul>
        <Image
          src={signUpStep51}
          alt="Sign-up Step 51"
          className={styles.paraImage}
        />
        <ul className="ml-4">
          <li>
            c. <strong>Take note of your new WebID</strong>.
          </li>
          <li>d. Click “Back”.</li>
        </ul>
        <Image
          src={signUpStep52}
          alt="Sign-up Step 52"
          className={styles.paraImage}
        />

        <p className={styles.paraText}>6. At the CSS’ Your Account page:</p>
        <ul className="ml-4">
          <li>a. Click “Continue authentication”.</li>
        </ul>
        <Image
          src={signUpStep6}
          alt="Sign-up Step 6"
          className={styles.paraImage}
        />

        <p className={styles.paraText}>7. At the CSS Server’s Authorisation page:</p>
        <ul className="ml-4">
          <li>a. Click “Authorise”.</li>
        </ul>
        <Image
          src={signUpStep7}
          alt="Sign-up Step 7"
          className={styles.paraImage}
        />

        <p className={styles.paraText}>You have now registered successfully and can access your PODS.</p>
        <Image
          src={signUpLast}
          alt="Sign-up Last Step"
          className={styles.paraImage}
        />
      </section>
      <section>
        <p className={styles.sectionTitle}>Signing in as an existing user</p>

        <p className={styles.paraText}>1. At the homepage:</p>
        <ul className="ml-4">
          <li>a. Choose the provider that you had registered with.</li>
          <li>b. Click “Sign In / Register”.</li>
        </ul>
        <Image
          src={signInStep1}
          alt="Sign-in Step 1"
          className={styles.paraImage}
        />

        <p className={styles.paraText}>2. (If not signed in during the current browser session) At the CSS’ Login page:</p>
        <ul className="ml-4">
          <li>a. Enter your email address and password.</li>
          <li>b. Click “Log in”.</li>
        </ul>
        <Image
          src={signInStep2}
          alt="Sign-in Step 2"
          className={styles.paraImage}
        />

        <p className={styles.paraText}>3. At the CSS’ Authorisation page:</p>
        <ul className="ml-4">
          <li>a. Click “Authorise”.</li>
        </ul>
        <Image
          src={signInStep3}
          alt="Sign-in Step 3"
          className={styles.paraImage}
        />

        <p className={styles.paraText}>You are now signed in and can access your PODS.</p>
        <Image
          src={signInLast}
          alt="Sign-in Last Step"
          className={styles.paraImage}
        />
      </section>
    </>
  );
}
