import Link from "next/link";
import globalStyles from "../../styles/global-styles.module.css";
import styles from "./learnmore-page-styles.module.css";
import openSourcePic from "../_assets/images/open_source.png";
import peerPic from "../_assets/images/peer-to-peer.png";
import hostingPic from "../_assets/images/hosting_pods.png";
import securityPic from "../_assets/images/security_access_control.png";
import separationPic from "../_assets/images/data_app_separation.png";
import podsLogo from "../_assets/images/login-bg-image.png";

import Image from "next/image";

export default function LearnMorePage() {
  return (
    <>
      <h1 className={globalStyles.pageTitle}>Learn More about Solid Pods</h1>
      <section>
        <p className={globalStyles.sectionTitle}>What is Solid PODS?</p>

        <p className={styles.paraText}>
          The core idea of Solid is to <strong>give people control over their data</strong>, allowing them to store it securely in decentralised data
          stores known as PODS (Personal Online Data Stores). These PODS can be thought of as personal web servers for people to store and control
          their data.
        </p>

        <p className={styles.paraText}>
          Any kind of information can be stored – from structured to unstructured data, the scope of data that PODS can hold goes beyond just a single
          data type of information from a specific sector. This means that media, retail or even wellness information can all be held in a single
          PODS, and owners of their PODS get to have full control over what they want to store.
        </p>

        <p className={styles.paraText}>
          With Solid PODS, you (and not organisations) get to control what data to store in your PODS and who gets access to that slice of data. You
          can even revoke this access at any time.
        </p>

        <p className={styles.paraText}>
          Solid’s use of a common, shared way of describing things and their relationships to one another has also allowed for its unique ability –
          where within the Solid ecosystem, different applications (e.g. shopping, health, travel, media) can “understand” and work with the same data
          within your PODS. So, for example, instead of updating your email with different service providers like bank statement notification service
          or phone billing service, you can instead store this information in your PODS and grant access to read your email information to the various
          services/applications.{" "}
        </p>

        <Image
          src={podsLogo}
          alt="Pods Logo"
          className={styles.pagePic}
        />

        <p className={globalStyles.sectionTitle}>How does Solid PODS really work?</p>

        <div className={styles.paraContainer}>
          <Image
            src={openSourcePic}
            alt="Open Source Logo"
            className={styles.paraIcon}
          />
          <p className={styles.paraTextIndent}>
            As one of the vehicles driving Web3’s vision of a decentralised and open web, <strong>Solid is an open-source specification</strong> based
            on existing World Wide Web Consortium (W3C) recommendations for reading, writing and access control of the contents in a user’s Pod. This
            means that any application can be developed or tweaked to be Solid-compatible and access PODS, as long as it uses W3C authentication and
            access standards. The Solid specification can also enable apps to communicate via a universal API that handles back-end data and controls
            access.{" "}
          </p>

          <p className={styles.paraText}>
            Solid also uses{" "}
            <strong>other W3C standards, namely the global ID space and single sign-on, in addition to the WebID identifier and protocol.</strong>{" "}
            This makes Solid PODS’ processes “universally recognised” by other programmes and applications using the same standards. Above all, the
            open-source nature of Solid enables applications to easily access and be developed to be Solid-compatible.
          </p>
        </div>

        <div className={styles.paraContainer}>
          <Image
            src={peerPic}
            alt="Open Source Logo"
            className={styles.paraIcon}
          />
          <p className={styles.paraTextIndent}>
            The Solid network is built on a{" "}
            <strong>
              peer-to-peer design rather than a centralised hub-and-spoke infrastructure. It puts a user’s data in PODS, which can be stored anywhere
            </strong>
            – PC, mobile device, server, or cloud.
          </p>
        </div>

        <div className={styles.paraContainer}>
          <Image
            src={hostingPic}
            alt="Open Source Logo"
            className={styles.paraIcon}
          />
          <p className={styles.paraTextIndent}>
            These PODS are hosted on <strong>Solid PODS servers</strong> that are managed by <strong>PODS providers</strong>. Users can have just one
            or multiple PODS, and their PODS can be with a single PODS provider or spread across multiple PODS providers. There are several
            larger-scale open-source servers available, with <strong>IMDA providing its own Solid server through this platform</strong>.
          </p>
        </div>

        <div className={styles.paraContainer}>
          <Image
            src={securityPic}
            alt="Open Source Logo"
            className={styles.paraIcon}
          />
          <p className={styles.paraTextIndent}>
            In terms of access, every user is identified by a unique ID (i.e. WebID), which is authenticated by a decentralised extension of OpenID
            Connect. Solid’s access control system uses these IDs to determine whether a person, group, or application has access to a resource in a
            PODS. Owners of their PODS, on the other hand, manage data in their PODS by granting or revoking various degrees of access as needed.
          </p>
        </div>

        <div className={styles.paraContainer}>
          <Image
            src={separationPic}
            alt="Open Source Logo"
            className={styles.paraIcon}
          />
          <p className={styles.paraTextIndent}>
            Separating the data from the application is an important feature of Solid. Data is managed independently of applications that access the
            data. This makes PODS similar to a standalone data repository, rather than a database file only accessible by that organisation holding
            that database.
          </p>
        </div>

        <div className={styles.paraContainer}>
          <p className={styles.paraText}>
            {`More information can be found at `}
            <Link
              className={globalStyles.linkText}
              href="https://solidproject.org/">
              https://solidproject.org/
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
