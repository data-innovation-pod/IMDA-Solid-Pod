import { useRouter } from "next/navigation";
import { getYouTubeQueryParams } from "~/app/_components/connector/youtube/get-youtube-query-params";
import { env } from "~/env.mjs";

export default function RetryButton() {
  const router = useRouter();

  function handleClick() {
    const youTubeQueryParamsString = getYouTubeQueryParams();

    router.push(`${env.NEXT_PUBLIC_YOUTUBE_AUTH_URL}?${youTubeQueryParamsString}`);
  }

  return (
    <button
      onClick={handleClick}
      className="rounded-lg bg-purple-dark p-2 text-white">
      Retry
    </button>
  );
}
