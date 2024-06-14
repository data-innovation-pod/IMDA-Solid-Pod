"use client";

import { env } from "~/env.mjs";

export function generateFitbitCodeVerifier(length: number) {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

async function generateFitbitCodeChallenge(codeVerifier: string) {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

//not sure if need code challenge verifier for fitbit
export async function getFitbitQueryParams() {
  let verifier = localStorage.getItem("verifier");

  if (!verifier) {
    verifier = generateFitbitCodeVerifier(128);
    localStorage.setItem("verifier", verifier);
  }
  const challenge = await generateFitbitCodeChallenge(verifier);

  //maybe need to follow url structure of
  //https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=23RYVK&redirect_uri=http://localhost&scope=activity%20nutrition%20heartrate%20location%20nutrition%20profile%20settings%20sleep%20social%20weight
  //to get authorization code, which needs to be
  return new URLSearchParams({
    client_id: env.NEXT_PUBLIC_FITBIT_CLIENT_ID,
    code_challenge_method: "S256",
    code_challenge: challenge,
    redirect_uri: env.NEXT_PUBLIC_BASE_URL,
    response_type: "code",
    scope: "user-read-private user-read-email user-library-read user-top-read user-follow-read",
  }).toString();
}
