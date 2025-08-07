import { createFileRoute } from "@tanstack/react-router";

import env from "@/lib/env";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    console.log(env.SECRET);
  },
  loader: async () => {
    return { secret: process.env.SECRET, apiUrl: process.env.API_URL };
  },
  component: Homepage,
});

function Homepage() {
  const { secret } = Route.useLoaderData();

  return (
    <div className="container flex min-h-dvh flex-col items-center justify-center gap-3 p-4">
      <h1 className="font-bold font-jetbrains text-4xl">
        Welcome to the Homepage
      </h1>
      <p className="font-inter text-lg">
        This is the main entry point of our application.
      </p>
      <p className="font-inter text-lg">SECRET: {secret}</p>
      <p className="font-inter text-lg">
        API URL: {import.meta.env.VITE_API_URL}
      </p>
    </div>
  );
}
