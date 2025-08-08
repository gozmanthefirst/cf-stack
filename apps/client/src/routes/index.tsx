import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    console.log(process.env.SECRET);
  },
  loader: async () => {
    return { secret: process.env.SECRET, apiUrl: process.env.API_URL };
  },
  component: Homepage,
});

function Homepage() {
  const { secret } = Route.useLoaderData();

  return (
    <div className="container flex min-h-dvh flex-col items-center justify-center gap-3 p-4 text-center">
      <h1 className="font-bold font-jetbrains text-2xl md:text-3xl lg:text-4xl">
        Welcome to the CF STACK!!!
      </h1>
      <p className="font-inter text-base md:text-lg">
        This is the main entry point of our application.
      </p>

      <div>
        <p className="font-roboto text-base md:text-lg">SECRET: {secret}</p>
        <p className="font-roboto text-base md:text-lg">
          API URL: {import.meta.env.VITE_API_URL}
        </p>
      </div>
    </div>
  );
}
