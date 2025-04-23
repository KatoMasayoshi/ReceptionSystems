import React from "react";
import { motion } from "motion/react"; // ✅ motion パッケージからインポート
import "../css/waitscreen.css"

const WaitScreen = () => {
  return (
    <motion.div
      initial={{ y: "100%", opacity: 0 }}  // 👈 初期位置：画面下
      animate={{ y: "0%", opacity: 1 }}    // 👈 アニメーション後：画面中央
      exit={{ y: "-100%", opacity: 0 }}    // 👈 次に消えるとき（上に抜ける）
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="wait-screen"
    >
        <h1 className="animated-header">a-proud株式会社</h1>
        <h2 className="wait-message">ご来社ありがとうございます。少々お待ちくださいませ
            
        </h2>
    </motion.div>
  );
};

export default WaitScreen;
