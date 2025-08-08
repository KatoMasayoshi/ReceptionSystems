import React, {useEffect} from "react";
import { motion } from "motion/react"; // ✅ motion パッケージからインポート
import "../css/waitscreen.css"
import { useNavigate } from "react-router-dom";



const WaitScreen = () => {
  const navigate= useNavigate();


  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/reception');
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate]);



  return (
    <motion.div
      initial={{ y: "100%", opacity: 0 }}  // 👈 初期位置：画面下
      animate={{ y: "0%", opacity: 1 }}    // 👈 アニメーション後：画面中央
      exit={{ y: "-100%", opacity: 0 }}    // 👈 次に消えるとき（上に抜ける）
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="wait-screen"
    >
        <h1 className="animated-header">a-proud株式会社</h1>
        <h2 className="wait-message">担当がお迎えにあがります。少々おまちくださいませ</h2>
        
        <div className="check-wrapper">
          <svg className="checkmark" viewBox="0 0 52 52">
            <circle className="checkmark-circle" cx="26" cy="26" r="24" fill="#484A5A" />
            <path
              className="checkmark-check"
              fill="none"
              d="M16 26l6 6 14-14"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <p className="greeting-phrase">受付が完了しました。</p>


    </motion.div>
  );
};

export default WaitScreen;
