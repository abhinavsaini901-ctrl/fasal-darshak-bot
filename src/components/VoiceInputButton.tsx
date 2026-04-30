import { useState } from "react";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useListen } from "@/hooks/use-voice";
import { useLanguage } from "@/hooks/use-language";

export function VoiceInputButton({
  onText,
  className,
}: {
  onText: (text: string) => void;
  className?: string;
}) {
  const { speechCode, t } = useLanguage();
  const [hint, setHint] = useState(false);
  const { start, stop, listening, supported } = useListen(speechCode, (text) => {
    onText(text);
  });

  if (!supported) return null;

  return (
    <Button
      type="button"
      size="icon"
      variant={listening ? "default" : "secondary"}
      onClick={() => {
        if (listening) stop();
        else {
          start();
          setHint(true);
          setTimeout(() => setHint(false), 2500);
        }
      }}
      className={`relative rounded-full ${listening ? "animate-pulse-ring" : ""} ${className ?? ""}`}
      aria-label={listening ? t("stop") : t("voiceAsk")}
    >
      {listening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
      {hint && listening && (
        <span className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-soft">
          {t("listening")}
        </span>
      )}
    </Button>
  );
}
