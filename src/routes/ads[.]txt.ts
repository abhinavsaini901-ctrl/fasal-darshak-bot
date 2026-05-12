import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/ads.txt")({
  server: {
    handlers: {
      GET: () =>
        new Response(
          "google.com, pub-2415253815061726, DIRECT, f08c47fec0942fa0\n",
          { headers: { "content-type": "text/plain; charset=utf-8" } },
        ),
    },
  },
});
