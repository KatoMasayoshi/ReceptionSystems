import React, { useState } from "react";
import "./css/Keyboard.css"; // スタイルを別ファイルで管理
// import { ReactComponent as ArrowIcon } from '../../image/arrow-right3.svg';
import Arrow from "@elsdoerfer/react-arrow";

const katakanaKeys = [
  "ワ", "ラ", "ヤ", "マ", "ハ", "ナ", "タ", "サ", "カ", "ア",
  "ヲ", "リ", "ユ", "ミ", "ヒ", "ニ", "チ", "シ", "キ", "イ",
  "ン", "ル", "ヨ", "ム", "フ", "ヌ", "ツ", "ス", "ク", "ウ",
  "(株)", "レ", "", "メ", "ヘ", "ネ", "テ", "セ", "ケ", "エ",
  "", "ロ", "ー", "モ", "ホ", "ノ", "ト", "ソ", "コ", "オ"
];

const symbolKeys = [
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J",
  "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T",
  "U", "V", "W", "X", "Y", "Z",
  "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
  "@", "#", "$", "%", "&", "*", "-", "_", "!", "?"
];

const Keyboard = ({ value, onInput, onClose, placeholder="入力してください" }) => {
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
      <button className="close-arrow-button" onClick={onClose}>
        ←
      </button>        
        <div className="input-box">
          
          <input type="text" 
          className="company-input" 
          value={value} 
          readOnly 
          placeholder={placeholder} 
          />
          <button className="backspace" onClick={handleBackspace}>
            <img src="/image/backspace2.png" alt="削除" className="backspace-icon" />
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
          <button className="key-space" onClick={handleSpace}>
            スペース
          </button>
          <button className="key-kanaeisu" onClick={toggleMode}>
            {mode === "katakana" ? "英数記号" : "カタカナ"}
          </button>
          <button className="close-keyboard" onClick={onClose}>
          <Arrow className="arrow-icon"
              angle={90}
              length={5.5}
              color='#ABE1FA'
              lineWidth={0.4}
              arrowHeadFilled={false}
              style={{
                width: '250px'
              }}
            />
            {/* <img src= "/image/arrow-right.svg" alt="閉じる" className="arrow-icon" /> */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Keyboard;
