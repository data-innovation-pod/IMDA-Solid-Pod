import { YouTubeLogo, SpotifyLogo } from "../_assets/svg";
import FitbitLogo from "../_assets/svg/fitbit-logo";
import FitbitCard from "../_components/connector/fitbit/fitbit-card";
import SpotifyCard from "../_components/connector/spotify/spotify-card";
import YouTubeCard from "../_components/connector/youtube/youtube-card";

import styles from "./discover-page-styles.module.css";

export default function Discover() {
  return (
    <>
      <h1 className={styles.title}>Connect your data</h1>
      <p className={styles.desc}>
        {`IMDA's Solid PODS provides a platform for you to store all kinds of data - from music, retail to wellness, you have the power to store, delete or share with others and through that, discover how your data can work for you.`}
      </p>
      <div className={styles.gridContainer}>
        <SpotifyCard
          desc="Connect and choose what data to retrieve from your Spotify account."
          logo={<SpotifyLogo />}
          title="Spotify"
        />
        <YouTubeCard
          desc="Connect and choose what data to retrieve from your YouTube account."
          logo={<YouTubeLogo />}
          title="YouTube"
        />
        <FitbitCard
          desc="Connect and choose what data to retrieve from your Fitbit account."
          logo={<FitbitLogo />}
          title="Fitbit"
        />
      </div>
    </>
  );
}
