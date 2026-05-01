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
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Kisan Mitra — फसल का AI डॉक्टर | Crop Disease Scanner" },
      { name: "description", content: "Scan your crop with your phone camera. Instantly detect disease, get treatment & advice in your language. किसानों के लिए AI ऐप।" },
      { name: "author", content: "Kisan Mitra" },
      { property: "og:title", content: "Kisan Mitra — फसल का AI डॉक्टर | Crop Disease Scanner" },
      { property: "og:description", content: "Scan your crop with your phone camera. Instantly detect disease, get treatment & advice in your language. किसानों के लिए AI ऐप।" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "Kisan Mitra — फसल का AI डॉक्टर | Crop Disease Scanner" },
      { name: "twitter:description", content: "Scan your crop with your phone camera. Instantly detect disease, get treatment & advice in your language. किसानों के लिए AI ऐप।" },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/9ba37112-6ae5-43b8-8da9-a5fcef37648d/id-preview-226c977f--8a0e629e-76fb-4e57-afa1-60231f26ed7e.lovable.app-1777643664782.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/9ba37112-6ae5-43b8-8da9-a5fcef37648d/id-preview-226c977f--8a0e629e-76fb-4e57-afa1-60231f26ed7e.lovable.app-1777643664782.png" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
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

function RootComponent() {
  return (
    <LanguageProvider>
      <VoiceModeProvider>
        <Outlet />
        <Toaster position="top-center" richColors />
      </VoiceModeProvider>
    </LanguageProvider>
  );
}
