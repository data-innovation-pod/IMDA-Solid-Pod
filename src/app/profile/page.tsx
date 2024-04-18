import styles from "./profile-page-styles.module.css";
import ProfileSection from "./profile";
import EditProfileSection from "./edit-profile";

export default function EditProfilePage() {
  return (
    <div className={styles.pageContainer}>
      <section className={styles.breadcrumbSection}>
        <p>Profile</p>
      </section>
      <ProfileSection />
      <EditProfileSection />
    </div>
  );
}
