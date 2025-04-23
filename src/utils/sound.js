// src/utils/sound.js

export const playClickSound = () => {
    const audio = new Audio('/sound/se_16_click_single.wav'); // public/sound/ を再生
    audio.play();
  };
  