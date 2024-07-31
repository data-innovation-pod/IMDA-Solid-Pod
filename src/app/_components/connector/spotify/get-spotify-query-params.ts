"use client";

import { env } from "~/env.mjs";

export function generateSpotifyCodeVerifier(length: number) {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

async function generateSpotifyCodeChallenge(codeVerifier: string) {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export async function getSpotifyQueryParams() {
  let verifier = localStorage.getItem("verifier");

  if (!verifier) {
    verifier = generateSpotifyCodeVerifier(128);
    localStorage.setItem("verifier", verifier);
  }
  const challenge = await generateSpotifyCodeChallenge(verifier);

  //`${env.NEXT_PUBLIC_BASE_URL}/callback/spotify`
  //URLSearchParams to retrieve url parameters, check 16:20 video
  return new URLSearchParams({
    client_id: env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
    response_type: "code",
    redirect_uri: `${env.NEXT_PUBLIC_BASE_URL}/callback/spotify`,
    scope: "user-read-private user-read-email user-library-read user-top-read user-follow-read playlist-read-private playlist-read-collaborative",
    code_challenge_method: "S256",
    code_challenge: challenge,
  }).toString();
}
