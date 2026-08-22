import { useCallback, useEffect, useRef, useState } from "react";

// Browser Speech Synthesis (TTS)
export function useSpeak(langCode: string) {
  const [speaking, setSpeaking] = useState(false);

  const speak = useCallback(
    (text: string) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = langCode;
      utter.rate = 0.95;
      utter.pitch = 1;
      utter.onend = () => setSpeaking(false);
      utter.onerror = () => setSpeaking(false);
      setSpeaking(true);
      window.speechSynthesis.speak(utter);
    },
    [langCode]
  );

  const stop = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
  }, []);

  useEffect(() => () => stop(), [stop]);

  return { speak, stop, speaking };
}

// Browser SpeechRecognition (STT)
type SpeechResultLike = {
  isFinal?: boolean;
  0?: { transcript: string };
  length?: number;
};
type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives?: number;
  start: () => void;
  stop: () => void;
  abort?: () => void;
  onresult:
    | ((e: { results: { length: number; [key: number]: SpeechResultLike }; resultIndex: number }) => void)
    | null;
  onerror: ((e: { error?: string }) => void) | null;
  onend: (() => void) | null;
  onspeechend?: (() => void) | null;
};

export type ListenErrorCode = "not-allowed" | "no-speech" | "network" | "error";

export function useListen(
  langCode: string,
  onResult: (text: string) => void,
  opts?: { onError?: (code: ListenErrorCode) => void; silenceMs?: number },
) {
  const recRef = useRef<SpeechRecognitionLike | null>(null);
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");
  const [supported, setSupported] = useState(true);

  // Keep latest callbacks in refs so recognition isn't rebuilt on every render.
  const onResultRef = useRef(onResult);
  onResultRef.current = onResult;
  const onErrorRef = useRef(opts?.onError);
  onErrorRef.current = opts?.onError;
  const silenceMs = opts?.silenceMs ?? 1600;

  const finalRef = useRef("");
  const emittedRef = useRef(false);
  const silenceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const manualStopRef = useRef(false);

  const clearSilence = () => {
    if (silenceTimer.current) {
      clearTimeout(silenceTimer.current);
      silenceTimer.current = null;
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const w = window as unknown as {
      SpeechRecognition?: new () => SpeechRecognitionLike;
      webkitSpeechRecognition?: new () => SpeechRecognitionLike;
    };
    const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!Ctor) {
      setSupported(false);
      return;
    }
    const rec = new Ctor();
    rec.lang = langCode;
    // Continuous + interim tolerates background noise and short pauses:
    // we only finalize after the farmer has been silent for `silenceMs`.
    rec.continuous = true;
    rec.interimResults = true;
    rec.maxAlternatives = 1;

    const finish = () => {
      clearSilence();
      manualStopRef.current = true;
      try {
        rec.stop();
      } catch {
        /* noop */
      }
    };

    rec.onresult = (e) => {
      let interimText = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        const text = r?.[0]?.transcript ?? "";
        if (!text) continue;
        if (r?.isFinal) finalRef.current += (finalRef.current ? " " : "") + text.trim();
        else interimText += text;
      }
      setInterim(interimText);
      clearSilence();
      silenceTimer.current = setTimeout(() => {
        if (!finalRef.current.trim() && interimText.trim()) {
          finalRef.current = interimText.trim();
        }
        finish();
      }, silenceMs);
    };

    rec.onerror = (e) => {
      const code = e?.error;
      clearSilence();
      setListening(false);
      setInterim("");
      if (code === "not-allowed" || code === "service-not-allowed") {
        onErrorRef.current?.("not-allowed");
      } else if (code === "no-speech") {
        onErrorRef.current?.("no-speech");
      } else if (code === "network") {
        onErrorRef.current?.("network");
      } else if (code !== "aborted") {
        onErrorRef.current?.("error");
      }
    };

    rec.onend = () => {
      clearSilence();
      setListening(false);
      setInterim("");
      const text = finalRef.current.trim();
      finalRef.current = "";
      if (emittedRef.current) return;
      emittedRef.current = true;
      // Only send the question to the AI once speech has actually finished.
      if (text) onResultRef.current(text);
      else if (manualStopRef.current) onErrorRef.current?.("no-speech");
    };

    recRef.current = rec;
    return () => {
      clearSilence();
      try {
        rec.onresult = null;
        rec.onend = null;
        rec.onerror = null;
        rec.stop();
      } catch {
        /* noop */
      }
      recRef.current = null;
    };
  }, [langCode, silenceMs]);

  const start = useCallback(() => {
    if (!recRef.current) return;
    finalRef.current = "";
    emittedRef.current = false;
    manualStopRef.current = false;
    setInterim("");
    try {
      recRef.current.lang = langCode;
      recRef.current.start();
      setListening(true);
    } catch {
      setListening(false);
    }
  }, [langCode]);

  const stop = useCallback(() => {
    clearSilence();
    manualStopRef.current = true;
    try {
      recRef.current?.stop();
    } catch {
      /* noop */
    }
    setListening(false);
  }, []);

  return { start, stop, listening, supported, interim };
}

