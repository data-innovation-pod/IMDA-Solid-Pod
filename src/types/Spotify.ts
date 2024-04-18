export type SpotifyImage = {
  url: string;
  height: number;
  width: number;
};

export type Copyright = { text: string; type: string };

export type ListResponse<T> = {
  items: T[];
  total: number;
  href: string;
  limit: number;
  next: string;
  offset: number;
  previous: string;
};

export type Artist = {
  external_urls: { spotify: string };
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
};

export type AlbumTrack = {
  artists: Artist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_urls: { spotify: string };
  href: string;
  id: string;
  is_playable: boolean;
  linked_from: { external_urls: { spotify: string }; href: string; id: string; type: string; uri: string };
  restrictions: { reason: string };
  name: string;
  preview_url: string;
  track_number: number;
  type: string;
  uri: string;
  is_local: boolean;
};

export type Playlist = {
  collaborative: boolean;
  description: string;
  external_urls: { spotify: string };
  href: string;
  id: string;
  images: SpotifyImage[];
  name: string;
  owner: Partial<Profile>;
  public: boolean;
  snapshot_id: string;
  tracks: {
    href: string;
    total: number;
  };
  type: string;
  uri: string;
};

export type Profile = {
  country: string;
  display_name: string;
  email: string;
  explicit_content: {
    filter_enabled: boolean;
    filter_locked: boolean;
  };
  external_urls: { spotify: string };
  followers: {
    href: string;
    total: number;
  };
  href: string;
  id: string;
  images: SpotifyImage[];
  product: string;
  type: string;
  uri: string;
};

export type Album = {
  added_at: string;
  album: {
    album_type: string;
    total_tracks: number;
    available_markets: string[];
    external_urls: { spotify: string };
    href: string;
    id: string;
    images: SpotifyImage[];
    name: string;
    release_date: string;
    release_date_precision: string;
    restrictions: { reason: string };
    type: string;
    uri: string;
    artists: Artist[];
    tracks: ListResponse<AlbumTrack>;
    copyrights: Copyright[];
    external_ids: { isrc: string; ean: string; upc: string };
    genres: string[];
    label: string;
    popularity: number;
  };
};

export type Audiobook = {
  authors: { name: string }[];
  available_markets: string[];
  copyrights: Copyright[];
  description: string;
  html_description: string;
  edition: string;
  explicit: boolean;
  external_urls: { spotify: string };
  href: string;
  id: string;
  images: SpotifyImage[];
  languages: string[];
  media_type: string;
  name: string;
  narrators: { name: string }[];
  publisher: string;
  type: string;
  uri: string;
  total_chapters: number;
};

export type Show = {
  added_at: string;
  show: {
    available_markets: string[];
    copyrights: Copyright[];
    description: string;
    html_description: string;
    explicit: boolean;
    external_urls: { spotify: string };
    href: string;
    id: string;
    images: SpotifyImage[];
    is_externally_hosted: boolean;
    languages: string[];
    media_type: string;
    name: string;
    publisher: string;
    type: string;
    uri: string;
    total_episodes: number;
  };
};

export type Episode = {
  added_at: string;
  episode: {
    audio_preview_url: string;
    description: string;
    html_description: string;
    duration_ms: number;
    explicit: boolean;
    external_urls: { spotify: string };
    href: string;
    id: string;
    images: SpotifyImage[];
    is_externally_hosted: boolean;
    is_playable: boolean;
    language: string;
    languages: string[];
    name: string;
    release_date: string;
    release_date_precision: string;
    resume_point: {
      fully_played: boolean;
      resume_position_ms: number;
    };
    type: string;
    uri: string;
    restrictions: { reason: string };
    show: Show;
  };
};

export type Track = {
  added_at: string;
  track: AlbumTrack;
  copyrights: Copyright[];
  external_ids: {
    isrc: string;
    ean: string;
    upc: string;
  };
  genres: string[];
  label: string;
  popularity: number;
};

export type FollowingResponse = {
  artists: {
    href: string;
    limit: number;
    next: string;
    cursors: { after: string; before: string };
    total: number;
    items: Following[];
  };
};

export type Following = {
  external_urls: { spotify: string };
  followers: {
    href: string;
    total: number;
  };
  genres: string[];
  href: string;
  id: string;
  images: SpotifyImage[];
  name: string;
  popularity: number;
  type: string;
  uri: string;
};
