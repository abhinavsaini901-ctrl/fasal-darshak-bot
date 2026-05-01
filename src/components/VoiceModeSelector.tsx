import type { ReactElement } from "react";
import { Mic, Volume2, MicOff, Headphones } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useVoiceMode, type VoiceMode } from "@/hooks/use-voice-mode";
import { useLanguage } from "@/hooks/use-language";

export function VoiceModeSelector({ compact = false }: { compact?: boolean }) {
  const { mode, setMode } = useVoiceMode();
  const { t } = useLanguage();

  const options: { value: VoiceMode; label: string; icon: ReactElement }[] = [
    { value: "both", label: t("voiceBoth"), icon: <Headphones className="h-4 w-4" /> },
    { value: "tts", label: t("voiceTtsOnly"), icon: <Volume2 className="h-4 w-4" /> },
    { value: "stt", label: t("voiceSttOnly"), icon: <Mic className="h-4 w-4" /> },
    { value: "off", label: t("voiceOff"), icon: <MicOff className="h-4 w-4" /> },
  ];
  const current = options.find((o) => o.value === mode)!;

  return (
    <Select value={mode} onValueChange={(v) => setMode(v as VoiceMode)}>
      <SelectTrigger
        className={`gap-2 rounded-full border-border bg-card/80 ${compact ? "h-9 w-auto px-3 text-xs" : "h-10 w-full"}`}
        aria-label={t("voiceMode")}
      >
        <span className="flex items-center gap-2">
          {current.icon}
          {!compact && <SelectValue />}
        </span>
        {compact && <span className="text-xs font-semibold">{current.label}</span>}
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            <span className="flex items-center gap-2">
              {o.icon}
              {o.label}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
