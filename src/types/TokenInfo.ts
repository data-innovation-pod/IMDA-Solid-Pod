type SpotifyTokenInfo = {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
};

type YouTubeTokenInfo = {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
};

type FitbitTokenInfo = {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
  user_id: string;
};

export type { SpotifyTokenInfo, YouTubeTokenInfo, FitbitTokenInfo };
