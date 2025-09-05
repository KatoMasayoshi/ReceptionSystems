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

// 追加: 濁点/半濁点の変換マップ
const dakutenMap = {
  "ウ":"ヴ","カ":"ガ","キ":"ギ","ク":"グ","ケ":"ゲ","コ":"ゴ",
  "サ":"ザ","シ":"ジ","ス":"ズ","セ":"ゼ","ソ":"ゾ",
  "タ":"ダ","チ":"ヂ","ツ":"ヅ","テ":"デ","ト":"ド",
  "ハ":"バ","ヒ":"ビ","フ":"ブ","ヘ":"ベ","ホ":"ボ",
};

const handakutenMap = {
  "ハ":"パ","ヒ":"ピ","フ":"プ","ヘ":"ペ","ホ":"ポ",
};

const syoumoziMap = {
  "ア":"ァ", "イ":"ィ", "ウ":"ゥ", "エ":"ェ", "オ":"ォ",
  "カ":"ヵ", "ツ":"ッ", "ヤ":"ャ", "ユ":"ュ", "ヨ":"ョ",
};

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

  // 逆引き（元に戻す用）
const revDakutenMap   = Object.fromEntries(Object.entries(dakutenMap).map(([k,v]) => [v, k]));
const revHandakutenMap= Object.fromEntries(Object.entries(handakutenMap).map(([k,v]) => [v, k]));
const revSyoumoziMap = Object.fromEntries(Object.entries(syoumoziMap).map(([k,v]) => [v,k]));

const applyDakuten = () => {
  if (!value) return;
  const last = value.slice(-1);
  const head = value.slice(0, -1);

  // 既に濁点 → ベースへ戻す
  if (revDakutenMap[last]) {
    onInput(head + revDakutenMap[last]);
    return;
  }
  // 半濁点 → ベースに戻して濁点へ（パ→バ など）
  if (revHandakutenMap[last]) {
    const base = revHandakutenMap[last]; // ハ系のベース
    onInput(head + (dakutenMap[base] ?? last));
    return;
  }
  // ベース → 濁点付与
  if (dakutenMap[last]) {
    onInput(head + dakutenMap[last]);
  }
};

const applyHandakuten = () => {
  if (!value) return;
  const last = value.slice(-1);
  const head = value.slice(0, -1);

  // 既に半濁点 → ベースへ戻す
  if (revHandakutenMap[last]) {
    onInput(head + revHandakutenMap[last]);
    return;
  }
  // 濁点 → ベースに戻して半濁点へ（バ→パ など）
  if (revDakutenMap[last]) {
    const base = revDakutenMap[last]; // ハ系のベース or その他
    if (handakutenMap[base]) {
      onInput(head + handakutenMap[base]);
      return;
    }
    // ハ行以外（例: ズ等）は半濁点対象外 → そのまま戻すだけ
    onInput(head + base);
    return;
  }
  // ベース → 半濁点（ハ行のみ）
  if (handakutenMap[last]) {
    onInput(head + handakutenMap[last]);
  }
};

const applysyomozi = () => {
  if(!value) return;
  const last = value.slice(-1);
  const head = value.slice(0, -1);

  // 既に小文字 => ベースに戻す
  if(revSyoumoziMap[last]){
    onInput(head + revSyoumoziMap[last]);
    return;
  }

  // ベース => 小文字
  if(syoumoziMap[last]){
    onInput(head + syoumoziMap[last]);
  }
};

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

          {/* 小文字 */}
          <button className="key-syoumozi" onClick={applysyomozi}>
            小
          </button>

          {/* 追加: 濁点/半濁点 */}
          <button className="key-dakuten" onClick={applyDakuten}>
            ゛
            </button>
          <button className="key-handakuten" onClick={applyHandakuten}>
            ゜
            </button>
            {/* カナ英数字変更ボタン */}
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
