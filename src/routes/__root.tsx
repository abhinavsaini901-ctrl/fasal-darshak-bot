import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=5" },
      { name: "theme-color", content: "#1e8a4d" },
      { title: "किसान मित्र — AI कृषि पोर्टल" },
      { name: "description", content: "भारतीय किसानों के लिए AI-संचालित कृषि पोर्टल — फसल स्कैन, मंडी भाव, सरकारी योजनाएं और हिंदी कृषि लेख।" },
      { property: "og:site_name", content: "किसान मित्र" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "hi_IN" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "google-adsense-account", content: "ca-pub-2415253815061726" },
      { name: "google-site-verification", content: "-B8F907iGMru7LF4K9skmEIreefs1-1WshCQmbb9xTo" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/icon-192.png" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "किसान मित्र",
          url: "https://kisanlens.com",
          description: "भारतीय किसानों के लिए AI-आधारित कृषि पोर्टल",
          sameAs: [],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

import { LanguageProvider } from "@/hooks/use-language";
import { VoiceModeProvider } from "@/hooks/use-voice-mode";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";

function RootComponent() {
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: { queries: { staleTime: 60_000, retry: 1 } } }),
  );
  useEffect(() => {
    const load = () => {
      try {
        if (document.querySelector('script[data-adsense="1"]')) return;
        const s = document.createElement("script");
        s.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2415253815061726";
        s.async = true;
        s.crossOrigin = "anonymous";
        s.setAttribute("data-adsense", "1");
        s.onerror = (e) => console.warn("AdSense script failed to load", e);
        document.head.appendChild(s);
      } catch (e) {
        console.warn("AdSense init error", e);
      }
    };
    const w = window as unknown as { requestIdleCallback?: (cb: () => void) => number };
    const id = w.requestIdleCallback ? w.requestIdleCallback(load) : window.setTimeout(load, 1500);
    return () => {
      if (w.requestIdleCallback) cancelIdleCallback?.(id as number);
      else clearTimeout(id as number);
    };
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <VoiceModeProvider>
          <Outlet />
          <Toaster position="top-center" richColors />
        </VoiceModeProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}
