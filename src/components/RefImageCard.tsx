import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ImageOff, Info } from "lucide-react";
import type { RefImage } from "@/lib/visual-library";

/**
 * Mobile-first reference image card with skeleton loader.
 * Renders nothing broken: on load error it shows a friendly placeholder.
 * When `image` is null a placeholder note is shown instead of a wrong image.
 */
export function RefImageCard({
  image,
  lang,
  alt,
  reference,
  emptyNote,
}: {
  image: RefImage | null;
  lang: string;
  alt: string;
  /** Label the image as an example/reference (low confidence or generic family). */
  reference?: boolean;
  emptyNote?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  if (!image || failed) {
    return (
      <Card className="mt-3 flex min-h-[104px] flex-col items-center justify-center gap-2 border-0 bg-muted/50 p-4 text-center shadow-soft">
        <ImageOff className="h-6 w-6 text-muted-foreground" aria-hidden />
        <p className="text-xs text-muted-foreground">
          {emptyNote ??
            (lang === "en"
              ? "No reliable reference image available for this."
              : "इसके लिए भरोसेमंद संदर्भ चित्र उपलब्ध नहीं है।")}
        </p>
      </Card>
    );
  }

  return (
    <Card className="mt-3 overflow-hidden border-0 shadow-soft">
      <div className="relative aspect-[3/2] w-full bg-muted">
        {!loaded && <div className="absolute inset-0 animate-pulse bg-muted" aria-hidden />}
        <img
          src={image.src}
          alt={alt}
          loading="lazy"
          width={768}
          height={512}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`h-full w-full object-cover transition-opacity duration-300 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
        <span className="absolute left-2 top-2 rounded-full bg-background/90 px-2.5 py-1 text-[10px] font-bold text-foreground shadow-sm">
          {reference
            ? lang === "en"
              ? "Example / Reference image"
              : "उदाहरण / संदर्भ चित्र"
            : lang === "en"
              ? "Reference image"
              : "संदर्भ चित्र"}
        </span>
      </div>
      <div className="flex items-start gap-2 p-3">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
        <p className="text-xs leading-relaxed text-muted-foreground">
          {lang === "en" ? image.caption.en : image.caption.hi}
        </p>
      </div>
    </Card>
  );
}
