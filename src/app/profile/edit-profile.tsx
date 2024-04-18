"use client";
import styles from "./profile-page-styles.module.css";
import globalStyles from "../../styles/global-styles.module.css";
import { editContactProfile } from "~/app/_utils/wrangle-pods";
import { useState, useRef, type RefObject, useEffect } from "react";
import { useGlobalContext } from "~/app/_context/store";

export default function EditProfileSection() {
  const { webId, userDetails, setUserDetails } = useGlobalContext();
  const [inputs, setInputs] = useState({ name: userDetails?.name ?? "", email: userDetails?.email ?? "" });
  const [modalStates, setModalStates] = useState({ openPopupModal: false, updateSuccess: false });
  const [inputStates, setInputStates] = useState({ saveDisabled: true, emailError: false });
  const nameInputRef: RefObject<HTMLInputElement> = useRef(null);
  const emailInputRef: RefObject<HTMLInputElement> = useRef(null);

  async function handleEditProfile() {
    if (inputs.email === "" || /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(inputs.email)) {
      const resourceUrl = webId?.replace("#me", "");
      const result = userDetails?.imageFile
        ? await editContactProfile(resourceUrl, webId, inputs.name, inputs.email, userDetails?.imageFile)
        : await editContactProfile(resourceUrl, webId, inputs.name, inputs.email);
      if (result) {
        setModalStates((prev) => ({ ...prev, openPopupModal: true, updateSuccess: true }));
        setUserDetails?.((prev) => ({ ...prev, name: inputs.name, email: inputs.email }));
      } else {
        setModalStates((prev) => ({ ...prev, openPopupModal: true }));
      }
    } else {
      setInputStates((prev) => ({ ...prev, emailError: true }));
    }
    // reset savedImage file so it will not muck up editContactProfile() in wrangle-pods.ts
    setUserDetails?.((prev) => ({ ...prev, imageFile: undefined }));
  }

  function handleCloseModal() {
    setInputs((prev) => ({ ...prev, name: userDetails?.name ?? "", email: userDetails?.email ?? "" }));
    setInputStates((prev) => ({ ...prev, saveDisabled: true }));
    setModalStates((prev) => ({ ...prev, openPopupModal: false }));
    window.location.reload();
  }

  function enableSaveBtn() {
    if (nameInputRef?.current?.value === "" && emailInputRef?.current?.value === "") {
      setInputStates((prev) => ({ ...prev, saveDisabled: true }));
    } else {
      setInputStates((prev) => ({ ...prev, saveDisabled: false }));
    }
  }

  useEffect(() => {
    setInputs({
      name: userDetails?.name ? userDetails?.name : "",
      email: userDetails?.email ? userDetails?.email : "",
    });
    if (userDetails?.name ?? userDetails?.email) {
      enableSaveBtn();
    }
  }, [userDetails?.email, userDetails?.name]);

  return (
    <section className={styles.editProfileSection}>
      <div className={styles.editContainer}>
        <p>Name</p>
        <input
          data-testid="cy-name-input"
          ref={nameInputRef}
          defaultValue={userDetails?.name}
          onChange={(evt) => {
            setInputs((prev) => ({ ...prev, name: evt.target.value }));
            enableSaveBtn();
          }}
          type="text"
          className={styles.editInput}
        />
        {webId && !userDetails?.name && (
          <p className={globalStyles.errorMsg}>Please input a name or this page will continually be shown whenever the app refreshes.</p>
        )}
      </div>
      <div className={styles.editContainer}>
        <p>Email</p>
        <input
          data-testid="cy-email-input"
          ref={emailInputRef}
          defaultValue={userDetails?.email}
          onChange={(evt) => {
            setInputs((prev) => ({ ...prev, email: evt.target.value }));
            setInputStates((prev) => ({ ...prev, emailError: false }));
            enableSaveBtn();
          }}
          type="email"
          className={styles.editInput}
        />
        <p
          data-testid="cy-error-message"
          className={inputStates.emailError ? globalStyles.errorMsg : "hidden"}>
          Invalid email format.
        </p>
      </div>
      <div className={styles.actionsContainer}>
        <button
          data-testid="cy-save-profile-button"
          className={inputStates.saveDisabled ? globalStyles.primaryButtonInactive : globalStyles.primaryButton}
          onClick={() => handleEditProfile()}
          disabled={inputStates.saveDisabled}>
          Save
        </button>
      </div>
      <div className={modalStates.openPopupModal ? styles.popupModal : "hidden"}>
        {modalStates.updateSuccess ? (
          <p className={styles.modalText}>Details updated!</p>
        ) : (
          <p className={styles.modalText}>Sorry something went wrong, please try again.</p>
        )}
        <button
          className={globalStyles.primaryButton}
          onClick={() => handleCloseModal()}>
          Close
        </button>
      </div>
    </section>
  );
}
