import { useState } from "react";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useListen } from "@/hooks/use-voice";
import { useLanguage } from "@/hooks/use-language";
import { useVoiceMode } from "@/hooks/use-voice-mode";

export function VoiceInputButton({
  onText,
  className,
  pushToTalk = true,
}: {
  onText: (text: string) => void;
  className?: string;
  pushToTalk?: boolean;
}) {
  const { speechCode, t } = useLanguage();
  const { sttEnabled } = useVoiceMode();
  const [hint, setHint] = useState(false);
  const [pressed, setPressed] = useState(false);
  const { start, stop, listening, supported } = useListen(speechCode, (text) => {
    onText(text);
  });

  if (!supported || !sttEnabled) return null;

  const begin = () => {
    setPressed(true);
    setHint(true);
    start();
  };

  const end = () => {
    setPressed(false);
    setHint(false);
    stop();
  };

  const isActive = listening || pressed;

  return (
    <Button
      type="button"
      size="icon"
      variant={isActive ? "default" : "secondary"}
      onPointerDown={(e) => {
        if (pushToTalk) {
          e.preventDefault();
          begin();
        }
      }}
      onPointerUp={(e) => {
        if (pushToTalk) {
          e.preventDefault();
          end();
        }
      }}
      onPointerLeave={(e) => {
        if (pushToTalk) {
          e.preventDefault();
          end();
        }
      }}
      onPointerCancel={(e) => {
        if (pushToTalk) {
          e.preventDefault();
          end();
        }
      }}
      onClick={() => {
        if (!pushToTalk) {
          if (listening) stop();
          else {
            start();
            setHint(true);
            setTimeout(() => setHint(false), 2500);
          }
        }
      }}
      onContextMenu={(e) => e.preventDefault()}
      className={`relative touch-none select-none rounded-full transition-transform duration-150 active:scale-95 ${isActive ? "animate-pulse" : ""} ${pressed ? "scale-90 ring-4 ring-primary/40" : ""} ${className ?? ""}`}
      aria-label={isActive ? t("stop") : t("voiceAsk")}
      aria-pressed={isActive}
    >
      {isActive ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
      {hint && isActive && (
        <span className="absolute -top-9 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-soft">
          {t("listening")}
        </span>
      )}
    </Button>
  );
}

