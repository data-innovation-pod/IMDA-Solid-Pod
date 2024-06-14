import { useRouter } from "next/navigation";
import { getFitbitQueryParams } from "~/app/_components/connector/fitbit/get-fitbit-query-params";
import { env } from "~/env.mjs";

export default function RetryButton() {
  const router = useRouter();

  async function handleClick() {
    const fitbitQueryParamsString = await getFitbitQueryParams();

    router.push(`${env.NEXT_PUBLIC_FITBIT_AUTH_URL}?${fitbitQueryParamsString}`);
  }

  return (
    <button
      onClick={handleClick}
      className="rounded-lg bg-purple-dark p-2 text-white">
      Retry
    </button>
  );
}
