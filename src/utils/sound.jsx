// src/utils/sound.js
import { createContext, useContext, useMemo, useEffect } from "react";

const SoundCtx = createContext(null);

export function SoundProvider({ children }) {
  // 音のインスタンスはメモ化（毎回 new しない）
  const api = useMemo(() => {
    const click = new Audio("/sound/maou_se_system44.wav"); // public/sound/ に配置
    click.preload = "auto";
    click.volume = 0.7;

    return {
      playNav() {
        try {
          click.pause();
          click.currentTime = 0;
          // await しない＝体感同時
          click.play();
        } catch {
          /* no-op */
        }
      },
      _unsafe__audio: click, // デバッグ用に残しておくと便利（あとで消してOK）
    };
  }, []);

  // 自動再生ブロック対策：unlock は useEffect で
  useEffect(() => {
    const { _unsafe__audio: click } = api;
    if (!click) return;

    const unlock = () => {
      click.play().then(() => {
        click.pause();
        click.currentTime = 0;
      });
      window.removeEventListener("pointerdown", unlock);
    };

    window.addEventListener("pointerdown", unlock, { once: true });
    return () => window.removeEventListener("pointerdown", unlock);
  }, [api]);

  return <SoundCtx.Provider value={api}>{children}</SoundCtx.Provider>;
}

// Provider 未適用を即検知
export function useSound() {
  const ctx = useContext(SoundCtx);
  if (!ctx) {
    throw new Error("useSound must be used within <SoundProvider>");
  }
  return ctx;
}
