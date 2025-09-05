import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { flushSync } from "react-dom";
import { useSound } from "../../utils/sound"
import { createPortal } from "react-dom";
import "./css/backnav.css";

export default function BackNavButton({ to, delta = null, className = "" }) {
  const [hiding, setHiding] = useState(false);
  const navigate = useNavigate();
  const { playNav } = useSound();

  const onPointerDown = () => {
    // このフレームで矢印を消す＆SEを出す（iPadでも即時）
    flushSync(() => setHiding(true));
    playNav();
  };

  const onClick = () => {
    // 次フレームで遷移 → 体感“同時”
    requestAnimationFrame(() => {
      if (delta !== null) navigate(delta);
      else if (to) navigate(to);
    });
  };

  const btn = (
    <button
      type="button"
      onPointerDown={onPointerDown}
      onClick={onClick}
      className={`backnav-btn ${hiding ? "is-hiding" : ""} ${className}`}
      aria-label="戻る"
    >
      <svg className="backnav-icon" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        <path d="M6,6V3L0,8l6,5v-3c4-1,7-0.5,10,2C14,7,10.5,6,6,6z" />
      </svg>
    </button>
  );

  // transform の影響を受けないよう body 直下に固定（iPadで安定）
  return createPortal(btn, document.body);
}
