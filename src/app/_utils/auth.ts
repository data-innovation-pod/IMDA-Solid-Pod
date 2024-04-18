import { login, logout } from "@inrupt/solid-client-authn-browser";
import { env } from "~/env.mjs";
import { deleteCookies } from "./storage";

export async function logIn(currentLocation?: string) {
  await login({
    clientName: "My application",
    oidcIssuer: localStorage.getItem("css_provider") ?? env.NEXT_PUBLIC_CSS_BASE_URL,
    redirectUrl: currentLocation ?? new URL("/your-data", window.location.href).toString(),
  });
}

export function logOut() {
  localStorage.clear();
  // delete all solidClientAuth cookies tt were needed due CSS session lost if cancel Spotify auth
  deleteCookies("solidClientAuth");

  void logout({
    logoutType: "idp",
    handleRedirect() {
      window.location.href = env.NEXT_PUBLIC_BASE_URL;
    },
  });
}
