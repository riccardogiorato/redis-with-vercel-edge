import type { NextPage } from "next";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Home: NextPage = () => {
  // fetch redis data about analytics
  const { data, error } = useSWR<{ message: string }>("/api/redis", fetcher, {
    // disable all refetching
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshWhenHidden: false,
    refreshWhenOffline: false,
    shouldRetryOnError: false,
    dedupingInterval: 0,
  });

  // display analytics data in the center of the page with tailwind

  console.log(data);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center max-w-lg gap-3">
        <h1 className="text-lg font-bold">Analytics</h1>
        <p className="text-xl text-slate-800">{data?.message}</p>
        <a
          href="https://github.com/riccardogiorato/redis-with-vercel-edge"
          className="font-bold underline text-blue-800"
        >
          Full Tutorial Code here!
        </a>
      </main>
    </div>
  );
};

export default Home;
