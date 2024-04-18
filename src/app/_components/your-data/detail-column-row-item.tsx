import { PersonIcon } from "~/app/_assets/svg";
import styles from "./your-data-styles.module.css";
import Image from "next/image";
import { type User } from "./detail-column";

interface DetailColumnRowItemProps {
  user: User;
}
export default function DetailColumnRowItem({ user }: DetailColumnRowItemProps) {
  const { name, webId, profileImageUrl } = user;

  return (
    <div className={styles.userItemContainer}>
      {profileImageUrl ? (
        <Image
          className={styles.profileImage}
          src={profileImageUrl}
          alt="profile"
          width={24}
          height={24}
        />
      ) : (
        <div className={styles.personIconWrapper}>
          <PersonIcon />
        </div>
      )}
      <span className={styles.userItemName}>{name ?? webId}</span>
    </div>
  );
}
