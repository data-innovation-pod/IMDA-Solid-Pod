"use client";

import styles from "./pod-display-styles.module.css";
import { HeaderProfileIcon } from "~/app/_assets/svg";
import { useContactProfileContext } from "./display-pod-contents";
import Image from "next/image";

export default function DisplayPodModal() {
  const { openDisplayPodModal, setOpenDisplayPodModal } = useContactProfileContext();
  return (
    openDisplayPodModal && (
      <div className={styles.contactsModalContainer}>
        <div className={styles.modalInner}>
          <button
            className={styles.closeModal}
            onClick={() => setOpenDisplayPodModal?.(false)}
            type="button">
            X
          </button>
          <ViewProfileModal />
        </div>
      </div>
    )
  );
}

function ViewProfileModal() {
  const { contactProfile } = useContactProfileContext();
  return (
    <div
      data-testid="cy-profile-modal"
      className={styles.profileContainer}>
      <section className={styles.contentsSection}>
        {contactProfile?.profileUrl ? (
          <Image
            className={styles.roundedIcon}
            src={contactProfile?.profileUrl}
            alt="profile"
            width={30}
            height={30}
          />
        ) : (
          <HeaderProfileIcon
            fillColor="#616161"
            className={styles.icon}
          />
        )}
        <div className={styles.nameContainer}>
          <p className={styles.titleText}>{contactProfile?.name}</p>
          <p className={styles.text}>{contactProfile?.webId}</p>
        </div>
      </section>
      {contactProfile?.email && (
        <section className={styles.contentsSection}>
          <div className={styles.icon} />
          <div className={styles.emailContainer}>
            <p className={styles.titleText}>Email</p>
            <p className={styles.text}>{contactProfile?.email}</p>
          </div>
        </section>
      )}
    </div>
  );
}
