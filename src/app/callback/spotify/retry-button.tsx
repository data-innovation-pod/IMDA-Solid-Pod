import { useRouter } from "next/navigation";
import { getSpotifyQueryParams } from "~/app/_components/connector/spotify/get-spotify-query-params";
import { env } from "~/env.mjs";

export default function RetryButton() {
  const router = useRouter();

  async function handleClick() {
    const spotifyQueryParamsString = await getSpotifyQueryParams();

    router.push(`${env.NEXT_PUBLIC_SPOTIFY_AUTH_URL}?${spotifyQueryParamsString}`);
  }

  return (
    <button
      onClick={handleClick}
      className="rounded-lg bg-purple-dark p-2 text-white">
      Retry
    </button>
  );
}
