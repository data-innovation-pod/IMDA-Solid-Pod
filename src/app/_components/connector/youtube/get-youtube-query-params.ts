"use client";

import { env } from "~/env.mjs";

export function getYouTubeQueryParams() {
  return new URLSearchParams({
    client_id: env.NEXT_PUBLIC_YOUTUBE_CLIENT_ID,
    redirect_uri: env.NEXT_PUBLIC_BASE_URL,
    response_type: "code",
    scope: "https://www.googleapis.com/auth/youtube.readonly",
    include_granted_scopes: "true",
    state: "pass-through value",
  }).toString();
}
