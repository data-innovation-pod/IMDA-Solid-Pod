"use client";

import { api } from "~/trpc/react";
import { useEffect, useState } from "react";
import moment from "moment";
import { writeDataIntoPod } from "~/app/_utils/fitbit";
import { sleep, useGlobalContext } from "~/app/_context/store";
import globalStyles from "../../../styles/global-styles.module.css";
import { useRouter } from "next/navigation";
import styles from "./callback-fitbit-styles.module.css";
import Link from "next/link";

export default function Fitbit() {
  const router = useRouter();
  //access token to be used for fetching data from fitbit
  const [accessToken, setAccessToken] = useState<string>("");
  //podUrlLink to be used for saving data into pod
  const [podUrlLink] = useState<string>(localStorage.getItem("podUrlLink") ?? "");
  //completedItemsSentences to show the user what data has been imported
  const [completedItemsSentences, setCompletedItemsSentences] = useState<string[]>([]);
  //importingItems to be used for fetching data from fitbit
  const importingItemsString = localStorage.getItem("import_items") ?? "";
  const [importingItems] = useState<string[]>(importingItemsString.split(","));
  const { webId, podUrl } = useGlobalContext();

  const code = localStorage.getItem("code");
  const verifier = localStorage.getItem("verifier");
  const getTokenInfo = api.fitbit.getTokenInfo.useQuery(
    { code: code, verifier },
    {
      enabled: false,
      retry: 0,
    }
  );

  const connectToServices = api.userConnectedService.updateOrCreateMyConnectedService.useMutation();

  useEffect(() => {
    if (getTokenInfo.isFetched && getTokenInfo.isError) {
      localStorage.removeItem("import_items");
      localStorage.removeItem("can_fetch_fitbit");
      return;
    }

    if (!getTokenInfo.isFetched || !getTokenInfo.data) return;

    localStorage.setItem("fitbit_access_token", getTokenInfo.data.access_token);
    const expires_at = new Date().getTime() + getTokenInfo.data.expires_in * 1000; // in milliseconds from 1-1-1970
    localStorage.setItem("fitbit_expires_at", expires_at.toString());
    localStorage.setItem("fitbit_refresh_token", getTokenInfo.data.refresh_token);
    setAccessToken(getTokenInfo.data.access_token);
    if (webId && webId?.length > 0) {
      connectToServices.mutate({
        web_id: webId,
        service_name: "FITBIT",
        access_token: getTokenInfo.data.access_token,
        refresh_token: getTokenInfo.data.refresh_token,
        expires_at: expires_at.toString(),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getTokenInfo.isFetched]);

  const getSleepLog = api.fitbit.getSleepLog.useQuery(
    {
      access_token: accessToken ?? "",
    },
    { enabled: false }
  );

  const getFriends = api.fitbit.getFriends.useQuery(
    {
      access_token: accessToken ?? "",
    },
    { enabled: false }
  );

  const getFoodLog = api.fitbit.getFoodLog.useQuery(
    {
      access_token: accessToken ?? "",
    },
    { enabled: false }
  );

  const getWaterLog = api.fitbit.getWaterLog.useQuery(
    {
      access_token: accessToken ?? "",
    },
    { enabled: false }
  );

  const getTemperatureCore = api.fitbit.getTemperatureCore.useQuery(
    {
      access_token: accessToken ?? "",
    },
    { enabled: false }
  );

  const getDevices = api.fitbit.getDevices.useQuery(
    {
      access_token: accessToken ?? "",
    },
    { enabled: false }
  );

  const getHeartRate = api.fitbit.getHeartRate.useQuery(
    {
      access_token: accessToken ?? "",
    },
    { enabled: false }
  );

  const getProfile = api.fitbit.getProfile.useQuery(
    {
      access_token: accessToken ?? "",
    },
    { enabled: false }
  );

  const getBreathingRate = api.fitbit.getBreathingRate.useQuery(
    {
      access_token: accessToken ?? "",
    },
    { enabled: false }
  );

  const getDailyActivity = api.fitbit.getDailyActivity.useQuery(
    {
      access_token: accessToken ?? "",
    },
    { enabled: false }
  );

  const getOxygenSaturation = api.fitbit.getOxygenSaturation.useQuery(
    {
      access_token: accessToken ?? "",
    },
    { enabled: false }
  );

  const getWeightLog = api.fitbit.getWeightLog.useQuery(
    {
      access_token: accessToken ?? "",
    },
    { enabled: false }
  );

  //sleep
  useEffect(() => {
    if (getSleepLog.isFetched && webId) {
      if (!getSleepLog.data) return;
      void writeDataIntoPod(podUrlLink ?? "", "sleep", getSleepLog.data ? [getSleepLog.data] : [], webId).then(() => {
        setCompletedItemsSentences([...completedItemsSentences, "Sleep data has been imported."]);
      });
    }

    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getSleepLog.isFetched]);

  useEffect(() => {
    if (getFriends.isFetched && webId) {
      if (!getFriends.data) return;
      void writeDataIntoPod(podUrlLink ?? "", "friends", getFriends.data ? [getFriends.data] : [], webId).then(() => {
        setCompletedItemsSentences([...completedItemsSentences, "Friends data has been imported."]);
      });
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getFriends.isFetched]);

  useEffect(() => {
    if (getFoodLog.isFetched && webId) {
      if (!getFoodLog.data) return;
      void writeDataIntoPod(podUrlLink ?? "", "food", getFoodLog.data ? [getFoodLog.data] : [], webId).then(() => {
        setCompletedItemsSentences([...completedItemsSentences, "Food data has been imported."]);
      });
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getFoodLog.isFetched]);

  useEffect(() => {
    if (getWaterLog.isFetched && webId) {
      if (!getWaterLog.data) return;
      void writeDataIntoPod(podUrlLink ?? "", "water", getWaterLog.data ? [getWaterLog.data] : [], webId).then(() => {
        setCompletedItemsSentences([...completedItemsSentences, "Water data has been imported."]);
      });
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getWaterLog.isFetched]);

  useEffect(() => {
    if (getTemperatureCore.isFetched && webId) {
      if (!getTemperatureCore.data) return;
      void writeDataIntoPod(podUrlLink ?? "", "temperature", getTemperatureCore.data ? [getTemperatureCore.data] : [], webId).then(() => {
        setCompletedItemsSentences([...completedItemsSentences, "Temperature data has been imported."]);
      });
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getTemperatureCore.isFetched]);

  useEffect(() => {
    if (getDevices.isFetched && webId) {
      if (!getDevices.data) return;
      void writeDataIntoPod(podUrlLink ?? "", "devices", getDevices.data ? [getDevices.data] : [], webId).then(() => {
        setCompletedItemsSentences([...completedItemsSentences, "Devices data has been imported."]);
      });
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getDevices.isFetched]);

  useEffect(() => {
    if (getHeartRate.isFetched && webId) {
      if (!getHeartRate.data) return;
      void writeDataIntoPod(podUrlLink ?? "", "heartRate", getHeartRate.data ? [getHeartRate.data] : [], webId).then(() => {
        setCompletedItemsSentences([...completedItemsSentences, "Heart Rate data has been imported."]);
      });
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getHeartRate.isFetched]);

  useEffect(() => {
    if (getProfile.isFetched && webId) {
      if (!getProfile.data) return;
      void writeDataIntoPod(podUrlLink ?? "", "profile", getProfile.data ? [getProfile.data] : [], webId).then(() => {
        setCompletedItemsSentences([...completedItemsSentences, "Profile data has been imported."]);
      });
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getProfile.isFetched]);

  useEffect(() => {
    if (getBreathingRate.isFetched && webId) {
      if (!getBreathingRate.data) return;
      void writeDataIntoPod(podUrlLink ?? "", "breathingRate", getBreathingRate.data ? [getBreathingRate.data] : [], webId).then(() => {
        setCompletedItemsSentences([...completedItemsSentences, "Breathing Rate data has been imported."]);
      });
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getBreathingRate.isFetched]);

  useEffect(() => {
    if (getDailyActivity.isFetched && webId) {
      if (!getDailyActivity.data) return;
      void writeDataIntoPod(podUrlLink ?? "", "dailyActivity", getDailyActivity.data ? [getDailyActivity.data] : [], webId).then(() => {
        setCompletedItemsSentences([...completedItemsSentences, "Daily Activity data has been imported."]);
      });
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getDailyActivity.isFetched]);

  useEffect(() => {
    if (getOxygenSaturation.isFetched && webId) {
      if (!getOxygenSaturation.data) return;
      void writeDataIntoPod(podUrlLink ?? "", "oxygenSaturation", getOxygenSaturation.data ? [getOxygenSaturation.data] : [], webId).then(() => {
        setCompletedItemsSentences([...completedItemsSentences, "Oxygen Saturation data has been imported."]);
      });
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getOxygenSaturation.isFetched]);

  useEffect(() => {
    if (getWeightLog.isFetched && webId) {
      if (!getWeightLog.data) return;
      void writeDataIntoPod(podUrlLink ?? "", "weight", getWeightLog.data ? [getWeightLog.data] : [], webId).then(() => {
        setCompletedItemsSentences([...completedItemsSentences, "Weight data has been imported."]);
      });
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getWeightLog.isFetched]);

  useEffect(() => {
    const accessToken = localStorage.getItem("fitbit_access_token") ?? "";
    const expiresAt = localStorage.getItem("fitbit_expires_at") ?? "";
    if (accessToken.length === 0 || (expiresAt?.length > 0 && Number(expiresAt) <= moment().unix() * 1000)) {
      void getTokenInfo.refetch();
    } else {
      setAccessToken(localStorage.getItem("fitbit_access_token") ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchFitbitData = async () => {
      if (importingItems.includes("Playlists")) {
        await sleep(1000);
        await getSleepLog.refetch();
        await sleep(2500);
      }
      if (importingItems.includes("Sleep")) {
        await sleep(1000);
        await getSleepLog.refetch();
        await sleep(2500);
      }
    };

    const canFetchFitbit = localStorage.getItem("can_fetch_fitbit") ?? "";
    if (canFetchFitbit === "true" && accessToken.length > 0) {
      void fetchFitbitData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  return (
    <>
      <div className={styles.mainTitle}>Fitbit data for Solid</div>
      <div className={styles.dividerWithTopBottomMargin}></div>
      <div className={styles.subTitle}>Import Fitbit Data</div>
      <div>
        {completedItemsSentences.map((item) => (
          <p key={item}>{item}</p>
        ))}
      </div>

      {getTokenInfo.isFetched && getTokenInfo.isError && (
        <div className={globalStyles.errorMsg}>
          <p className="mb-4">Import Data Error! </p>{" "}
          <Link href={"/discover"}>
            <button className={globalStyles.primaryButton}>Continue</button>
          </Link>
        </div>
      )}

      {completedItemsSentences.length === importingItems.length && (
        <>
          <div className={styles.dividerWithTopBottomMargin}></div>
          <div className="mb-6">
            Your Fitbit data has been saved at{" "}
            <button
              className={styles.podUrl}
              onClick={() => {
                const path = podUrlLink.replace(`${podUrl}`, "");
                router.push(`/your-data/${path}`);
              }}
              type="button">
              {podUrlLink}
            </button>
          </div>
          <button
            data-testid="cy-fitbit-cb-continue-btn"
            className={completedItemsSentences.length !== importingItems.length ? globalStyles.primaryButtonInactive : globalStyles.primaryButton}
            disabled={completedItemsSentences.length !== importingItems.length}
            onClick={() => {
              router.push("/your-data");
            }}>
            Continue
          </button>
        </>
      )}
    </>
  );
}
