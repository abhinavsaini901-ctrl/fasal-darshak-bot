import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type VoiceMode = "both" | "tts" | "stt" | "off";

type Ctx = {
  mode: VoiceMode;
  setMode: (m: VoiceMode) => void;
  ttsEnabled: boolean;
  sttEnabled: boolean;
};

const VoiceModeContext = createContext<Ctx | null>(null);
const STORAGE_KEY = "kisan-mitra-voice-mode";

export function VoiceModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<VoiceMode>("both");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem(STORAGE_KEY) as VoiceMode | null;
    if (saved && ["both", "tts", "stt", "off"].includes(saved)) setModeState(saved);
  }, []);

  const setMode = (m: VoiceMode) => {
    setModeState(m);
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, m);
  };

  return (
    <VoiceModeContext.Provider
      value={{
        mode,
        setMode,
        ttsEnabled: mode === "both" || mode === "tts",
        sttEnabled: mode === "both" || mode === "stt",
      }}
    >
      {children}
    </VoiceModeContext.Provider>
  );
}

export function useVoiceMode() {
  const ctx = useContext(VoiceModeContext);
  if (!ctx) throw new Error("useVoiceMode must be used inside VoiceModeProvider");
  return ctx;
}
