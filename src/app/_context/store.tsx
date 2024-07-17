"use client";

import { createContext, type ReactNode, useContext, useMemo, useEffect, useState, type Dispatch, type SetStateAction, useCallback } from "react";

import { handleIncomingRedirect } from "@inrupt/solid-client-authn-browser";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { logIn } from "../_utils";
import { env } from "~/env.mjs";
import { type FitbitTokenInfo, type SpotifyTokenInfo } from "~/types/TokenInfo";
import { getProfileImage, viewContactProfile } from "../_utils/wrangle-pods";
import { type DocumentInfo } from "~/types/SolidData";
import { setCookiesWithPrefix, deleteCookies, setLocalStorageFromCookies } from "../_utils/storage";

interface ContextProps {
  spotifyTokenInfo?: SpotifyTokenInfo;
  setSpotifyTokenInfo: Dispatch<SetStateAction<SpotifyTokenInfo | undefined>>;
  fitbitTokenInfo?: FitbitTokenInfo;
  setFitbitTokenInfo: Dispatch<SetStateAction<FitbitTokenInfo | undefined>>;
  podUrl?: string;
  setPodUrl?: Dispatch<SetStateAction<string>>;
  webId?: string;
  setWebId?: Dispatch<SetStateAction<string>>;
  userDetails?: { name: string | undefined; email?: string | undefined; imageUrl?: string; imageFile?: File };
  setUserDetails?: Dispatch<SetStateAction<{ name: string | undefined; email?: string; imageUrl?: string; imageFile?: File } | undefined>>;
  sharedResourcesStructure?: DocumentInfo;
  setSharedResourcesStructure?: Dispatch<SetStateAction<DocumentInfo | undefined>>;
}

const GlobalContext = createContext<ContextProps>({
  spotifyTokenInfo: undefined,
  setSpotifyTokenInfo: (): SpotifyTokenInfo | undefined => undefined,
  fitbitTokenInfo: undefined,
  setFitbitTokenInfo: (): FitbitTokenInfo | undefined => undefined,
  podUrl: undefined,
  webId: undefined,
});

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function GlobalContextProvider({ children }: { children: ReactNode }) {
  const [podUrl, setPodUrl] = useState<string | undefined>();
  const [webId, setWebId] = useState<string | undefined>();
  const [userDetails, setUserDetails] = useState<
    { name: string | undefined; email?: string | undefined; imageUrl?: string; imageFile?: File } | undefined
  >(undefined);
  const [spotifyTokenInfo, setSpotifyTokenInfo] = useState<SpotifyTokenInfo | undefined>();
  const [fitbitTokenInfo, setFitbitTokenInfo] = useState<FitbitTokenInfo | undefined>();
  const [sharedResourcesStructure, setSharedResourcesStructure] = useState<DocumentInfo | undefined>(undefined);
  const pathname = usePathname();
  const router = useRouter();
  const params = useSearchParams();
  // cssProvider is set in localStorage when selected in login page
  const cssProvider =
    typeof window !== "undefined" ? localStorage.getItem("css_provider") ?? env.NEXT_PUBLIC_CSS_BASE_URL : env.NEXT_PUBLIC_CSS_BASE_URL;

  const completeLogin = useCallback(async () => {
    // both CSS and spotify haf auth codes in the url when redirect back to app. condition below chks if auth code is from spotify. if so, will store spotify auth code in localStorage so it can be used in /callback/spotify
    if (params.get("code") && !params.get("iss")) {
      localStorage.setItem("code", params.get("code") ?? "");
    }
    // const session = getDefaultSession();
    const chkResponse = await fetch(pathname);
    let redirectResult;
    // if the current path leads to an error page, then dun want to try restoring the session. leads to an infinite loop. also dun want to restore session if privacy statement page
    if (chkResponse.status !== 404 && pathname !== "/privacy") {
      // CSS localStorage items get deleted when cancel Spotify auth. So need to restore them from cookies if missing
      if (!localStorage.getItem("solidClientAuthn:currentSession")) {
        setLocalStorageFromCookies("solidClientAuth");
      }
      // need { restorePreviousSession: true } so session wld not be lost on app refresh
      redirectResult = await handleIncomingRedirect({ restorePreviousSession: true });
    }

    if (redirectResult?.isLoggedIn) {
      // store CSS localStorage items in cookies
      document.cookie = `solidClientAuthn:currentSession=${redirectResult.sessionId}; path=/`;
      // everytime app refreshes, a slightly different solidClientAuthenticationUser is generated. so need to delete this first, so the correct solidClientAuthenticationUser is stored in cookies
      deleteCookies("solidClientAuthenticationUser", "sessionId");
      setCookiesWithPrefix("solidClientAuthenticationUser");

      const copiedWebId = String(redirectResult?.webId);
      const relativeUrl = copiedWebId.replace(`${cssProvider}/`, "");
      const parsedRelativeUrl = relativeUrl?.split("/");
      const podName = parsedRelativeUrl?.[0];
      const [userName, userEmail] = await viewContactProfile(redirectResult?.webId);
      const profileImageFile = await getProfileImage(redirectResult?.webId);
      const profileImageUrl = profileImageFile?.internal_resourceInfo.sourceIri;
      // set states
      setUserDetails((prev) => ({ ...prev, name: userName ?? "", email: userEmail ?? "", imageUrl: profileImageUrl }));
      setPodUrl(`${cssProvider}/${podName}/`);
      setWebId(redirectResult?.webId);
      // only want to set localStorage current_path if url is not redirect from CSS silent auth
      if (pathname !== "/" && params.get("iss") !== `${cssProvider}/`) {
        localStorage.setItem("current_path", pathname);
      }
      // since deployed app does not fire sessionRestore event, haf to manually redirect app to last viewed page before silent auth
      const currentPath = localStorage.getItem("current_path");
      if (currentPath && currentPath !== "/") {
        router.push(currentPath);
      }

      if (userName?.length === 0) {
        router.push("/profile");
      }
    }

    /*
    - commented out code below spsed to return app to page it was on b4 session restored. see silentlyAuthenticate() in https://github.com/inrupt/solid-client-authn-js/blob/0c27ce0a/packages/browser/src/Session.ts#L320
    - sessionRestore event only emitted when there is actual session restoration.
    - hwever deployed app for some reason does not fire sessionRestore event... so the code below doesn't work
    - see manual workard above
    - keeping code below for ref
    */
    // session.events.on("sessionRestore", (currentUrl: string) => {
    //   const currentUrlAsUrl = new URL(currentUrl);
    //   // only want to go back to last page on app if it is not the home page. if sessionRestore happens on home page, it shld go to watever was e last page passed to logIn() for redirectUrl
    //   if (currentUrlAsUrl.pathname !== "/") {
    //     router.push(currentUrl);
    //   }
    // });
    if (redirectResult?.isLoggedIn === false && pathname !== "/signin-faq" && pathname !== "/learnmore" && pathname !== "/help") {
      if (document.referrer === `${localStorage.getItem("css_provider")}/`) {
        window.location.replace(env.NEXT_PUBLIC_BASE_URL);
      } else if (pathname !== "/") {
        // so if user attempts to key in url w/o logging in, will send user to CSS auth page & will redirect to the page user attempted to access
        const currentLocation = new URL("", window.location.href).toString();
        await logIn(currentLocation);
      }
    }
    if (localStorage.getItem("can_fetch_fitbit") === "true") {
      router.push("/callback/fitbit");
      return;
    }

    if (localStorage.getItem("can_fetch_youtube") === "true") {
      router.push("/callback/youtube");
      return;
    }

    if (localStorage.getItem("can_fetch_spotify") === "true") {
      router.push("/callback/spotify");
      return;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cssProvider, pathname]);

  useEffect(() => {
    void completeLogin();
  }, [completeLogin]);

  const contextValue = useMemo(
    () => ({
      spotifyTokenInfo,
      setSpotifyTokenInfo,
      fitbitTokenInfo,
      setFitbitTokenInfo,
      podUrl,
      webId,
      userDetails,
      setUserDetails,
      sharedResourcesStructure,
      setSharedResourcesStructure,
    }),
    [
      spotifyTokenInfo,
      setSpotifyTokenInfo,
      fitbitTokenInfo,
      setFitbitTokenInfo,
      podUrl,
      webId,
      userDetails,
      setUserDetails,
      sharedResourcesStructure,
      setSharedResourcesStructure,
    ]
  );

  return <GlobalContext.Provider value={contextValue}>{children}</GlobalContext.Provider>;
}

// this retrieves context and it's contents
export function useGlobalContext() {
  return useContext(GlobalContext);
}
