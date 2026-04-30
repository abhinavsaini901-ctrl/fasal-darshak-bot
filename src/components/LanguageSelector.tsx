import { useLanguage } from "@/hooks/use-language";
import { LANGUAGES } from "@/lib/i18n";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Languages } from "lucide-react";

export function LanguageSelector({ compact = false }: { compact?: boolean }) {
  const { lang, setLang, t } = useLanguage();

  return (
    <Select value={lang} onValueChange={(v) => setLang(v as typeof lang)}>
      <SelectTrigger
        className="w-auto gap-2 rounded-full border-primary/20 bg-card/80 backdrop-blur shadow-soft"
        aria-label={t("chooseLanguage")}
      >
        <Languages className="h-4 w-4 text-primary" />
        {!compact && <SelectValue />}
        {compact && (
          <span className="text-sm font-semibold">
            {LANGUAGES.find((l) => l.code === lang)?.native}
          </span>
        )}
      </SelectTrigger>
      <SelectContent>
        {LANGUAGES.map((l) => (
          <SelectItem key={l.code} value={l.code}>
            <span className="font-semibold">{l.native}</span>
            <span className="ml-2 text-xs text-muted-foreground">{l.label}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
