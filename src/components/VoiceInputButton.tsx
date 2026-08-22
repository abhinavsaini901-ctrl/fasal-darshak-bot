import { useState } from "react";
import { Mic, MicOff } from "lucide-react";
import { toast } from "sonner";
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
  const { speechCode, t, lang } = useLanguage();
  const { sttEnabled } = useVoiceMode();
  const [hint, setHint] = useState(false);
  const [pressed, setPressed] = useState(false);
  const en = lang === "en";
  const { start, stop, listening, supported, interim } = useListen(
    speechCode,
    (text) => {
      // Only fires once speech has actually finished.
      if (text.trim().length < 2) {
        toast.error(en ? "I couldn't understand that. Please speak again." : "मैं आपकी बात ठीक से समझ नहीं पाया, कृपया दोबारा बोलें।");
        return;
      }
      onText(text);
    },
    {
      onError: (code) => {
        if (code === "not-allowed") {
          toast.error(en ? "Please allow microphone permission." : "Microphone permission allow करें।");
        } else if (code === "no-speech") {
          toast.error(en ? "I couldn't hear you. Please speak again." : "मैं आपकी आवाज नहीं सुन पाया। कृपया दोबारा बोलें।");
        } else if (code === "network") {
          toast.error(en ? "Network problem. Please try again." : "इंटरनेट की दिक्कत है। कृपया दोबारा कोशिश करें।");
        } else {
          toast.error(en ? "Voice input failed. Please try again." : "आवाज़ नहीं पकड़ पाए। कृपया दोबारा बोलें।");
        }
      },
    }
  );

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
        <span className="absolute -top-9 left-1/2 z-20 max-w-[60vw] -translate-x-1/2 truncate whitespace-nowrap rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-soft">
          {interim ? interim : t("listening")}
        </span>
      )}
    </Button>
  );
}
