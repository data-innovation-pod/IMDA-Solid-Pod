import styles from "./your-data-styles.module.css";

import Image from "next/image";

import { PersonIcon } from "~/app/_assets/svg";
import Checkmark from "~/app/_assets/svg/checkmark";
import { mergeClassnames } from "~/app/_utils";
import { type User } from "./detail-column";

interface EditModalTableRowProps {
  handleClick: () => void;
  selectedWebIds: string[];
  user: User;
}

export default function EditModalTableRow({ handleClick, selectedWebIds, user }: Readonly<EditModalTableRowProps>) {
  const { name, webId, profileImageUrl } = user;

  const isSelected = selectedWebIds.includes(webId);

  return (
    <>
      <tr
        key={webId}
        className={mergeClassnames(styles.tableRow, isSelected ? "bg-purple-light" : "")}>
        <td className={styles.selectionColBody}>
          <button
            onClick={handleClick}
            className={mergeClassnames(styles.selectionButton, isSelected ? "bg-purple-dark" : "border")}>
            {isSelected && <Checkmark />}
          </button>
        </td>
        <td className={styles.nameColBody}>
          {profileImageUrl ? (
            <Image
              className={styles.profileImage}
              src={profileImageUrl}
              alt="profile"
              width={24}
              height={24}
            />
          ) : (
            <PersonIcon />
          )}
          <span className="truncate">{name}</span>
        </td>
        <tr className={styles.webIdColBody}>{webId}</tr>
      </tr>
      <div className="h-px bg-grey-light" />
    </>
  );
}
