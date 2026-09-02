import { createServerFn } from "@tanstack/react-start";

const CHANNEL_HANDLE = "farmingleaderofficial";
const CHANNEL_VIDEOS_URL = `https://www.youtube.com/@${CHANNEL_HANDLE}/videos`;
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";

export type YoutubeVideo = {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
};

export type YoutubeChannelData = {
  channelName: string;
  channelUrl: string;
  avatar: string | null;
  videos: YoutubeVideo[];
};

const CACHE_TTL = 3 * 60 * 60 * 1000; // 3 hours
let cache: { at: number; data: YoutubeChannelData } | null = null;

async function fetchText(url: string) {
  const res = await fetch(url, {
    headers: { "user-agent": UA, "accept-language": "hi-IN,hi;q=0.9,en;q=0.8" },
  });
  if (!res.ok) throw new Error(`fetch failed ${res.status}`);
  return res.text();
}

export const getFarmingLeaderVideos = createServerFn({ method: "GET" }).handler(
  async (): Promise<YoutubeChannelData> => {
    if (cache && Date.now() - cache.at < CACHE_TTL) return cache.data;

    const fallback: YoutubeChannelData = {
      channelName: "Farming Leader",
      channelUrl: `https://www.youtube.com/@${CHANNEL_HANDLE}`,
      avatar: null,
      videos: [],
    };

    try {
      const html = await fetchText(CHANNEL_VIDEOS_URL);

      const avatar =
        html.match(/<meta property="og:image" content="([^"]+)"/)?.[1] ?? null;
      const channelName =
        html.match(/<meta property="og:title" content="([^"]+)"/)?.[1] ??
        "Farming Leader";

      const ids: string[] = [];
      const re = /"contentId":"([\w-]{11})"/g;
      let m: RegExpExecArray | null;
      while ((m = re.exec(html)) !== null) {
        if (!ids.includes(m[1]!)) ids.push(m[1]!);
        if (ids.length >= 5) break;
      }

      const videos = (
        await Promise.all(
          ids.map(async (id): Promise<YoutubeVideo | null> => {
            const url = `https://www.youtube.com/watch?v=${id}`;
            try {
              const json = JSON.parse(
                await fetchText(
                  `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`,
                ),
              ) as { title?: string };
              if (!json.title) return null;
              return {
                id,
                title: json.title,
                url,
                thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
              };
            } catch {
              return null;
            }
          }),
        )
      ).filter((v): v is YoutubeVideo => v !== null);

      const data: YoutubeChannelData = {
        channelName,
        channelUrl: `https://www.youtube.com/@${CHANNEL_HANDLE}`,
        avatar,
        videos,
      };
      if (videos.length > 0) cache = { at: Date.now(), data };
      return data;
    } catch {
      return cache?.data ?? fallback;
    }
  },
);
