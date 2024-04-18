"use client";

import styles from "./profile-page-styles.module.css";
import globalStyles from "~/styles/global-styles.module.css";

import { type ChangeEvent, useRef, useState } from "react";
import Image from "next/image";
import { HeaderProfileIcon } from "~/app/_assets/svg";
import { useGlobalContext } from "~/app/_context/store";

export default function ProfileSection() {
  const { webId, userDetails, setUserDetails } = useGlobalContext();
  const [imageData, setImageData] = useState(userDetails?.imageUrl);

  const [uploadImageErrorMsg, setUploadImageErrorMsg] = useState<string>("");
  const imageFileUploadInput = useRef<HTMLInputElement>(null);

  function handleSubmitProfileImage(evt: ChangeEvent<HTMLInputElement>) {
    const chosenFile = evt?.target?.files?.[0];

    if (!chosenFile) {
      setUploadImageErrorMsg("Please select a file");
      return;
    }

    if (!chosenFile.type.startsWith("image")) {
      setUploadImageErrorMsg("Please select a valid image file");
      return;
    }

    setUploadImageErrorMsg("");
    // convert selected image file to dataUrl so user can preview selection
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setImageData(dataUrl);
    };

    // Initiates the reading of the file
    reader.readAsDataURL(chosenFile);
    // need to send file to store, so it can be saved when click save button in edit-profile.tsx
    setUserDetails?.((prev) => ({ ...prev, imageFile: chosenFile }));
  }

  return (
    <section>
      <div className={styles.profileSection}>
        <button
          onClick={() => imageFileUploadInput?.current?.click()}
          className={styles.profileBtn}>
          {userDetails?.imageUrl ?? imageData ? (
            <Image
              className={styles.icon}
              src={imageData ?? ""}
              alt="Profile Picture"
              width={200}
              height={200}
            />
          ) : (
            <HeaderProfileIcon
              fillColor="#616161"
              className={styles.icon}
            />
          )}
          Edit Photo
        </button>
        <div className={styles.nameContainer}>
          <p
            data-testid="cy-name-display"
            className={styles.titleText}>
            {userDetails?.name}
          </p>
          <p className={styles.text}>{userDetails?.email}</p>
          <p className={styles.text}>{webId}</p>
        </div>
      </div>
      {uploadImageErrorMsg && <p className={globalStyles.errorMsg}>{uploadImageErrorMsg}</p>}
      <form className="hidden">
        <input
          ref={imageFileUploadInput}
          onChange={handleSubmitProfileImage}
          type="file"
        />
      </form>
    </section>
  );
}
