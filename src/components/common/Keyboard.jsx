import React, { useState } from "react";
import "./css/Keyboard.css"; // スタイルを別ファイルで管理

const katakanaKeys = [
  "ワ", "ラ", "ヤ", "マ", "ハ", "ナ", "タ", "サ", "カ", "ア",
  "ヲ", "リ", " ", "ミ", "ヒ", "ニ", "チ", "シ", "キ", "イ",
  "ン", "ル", "ユ", "ム", "フ", "ヌ", "ス", "ツ", "ク", "ウ",
  "(株)", "レ", " ", "メ", "ヘ", "ネ", "テ", "セ", "ケ", "エ",
  "", "ロ", "ヨ", "モ", "ホ", "ノ", "ト", "ソ", "コ", "オ"
];

const symbolKeys = [
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J",
  "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T",
  "U", "V", "W", "X", "Y", "Z",
  "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
  "@", "#", "$", "%", "&", "*", "-", "_", "!", "?"
];

const Keyboard = ({ value, onInput, onClose }) => {
  const [mode, setMode] = useState("katakana");

  const handleKeyClick = (key) => {
    onInput(value + key);
  };

  const handleBackspace = () => {
    onInput(value.slice(0, -1));
  };

  const handleSpace = () => {
    onInput(value + " ");
  };

  const toggleMode = () => {
    setMode((prev) => (prev === "katakana" ? "symbol" : "katakana"));
  };

  const keysToShow = mode === "katakana" ? katakanaKeys : symbolKeys;

  return (
    <div className="keyboard-popup-overlay">
      <div className="keyboard-popup">
        <div className="input-box">
          <input type="text" value={value} readOnly />
          <button className="backspace" onClick={handleBackspace}>
            <span role="img" aria-label="削除">
              ✖️
            </span>
          </button>
        </div>

        <div className="keyboard-grid">
          {keysToShow.map((key, index) => (
            <button
              key={index}
              className="key"
              onClick={() => handleKeyClick(key)}
            >
              {key}
            </button>
          ))}
        </div>

        <div className="bottom-buttons">
          <button className="key" onClick={handleSpace}>
            スペース
          </button>
          <button className="key" onClick={toggleMode}>
            {mode === "katakana" ? "英数記号" : "カタカナ"}
          </button>
          <button className="key" onClick={onClose}>
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};

export default Keyboard;
