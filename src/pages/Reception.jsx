// src/pages/Reception.jsx
import React, { useEffect, useRef} from 'react';
import '../css/reception.css';
import { useNavigate } from 'react-router-dom';
// ✅ motionを読み込み
import { motion } from 'motion/react';

import { useSound } from '../utils/sound';
import { useQueryClient } from '@tanstack/react-query';



const Reception = () => {
  const navigate = useNavigate();
  const timerRef = useRef(null)
  const { playNav } = useSound();

  const handleCallStaff = () => {
    playNav();
    requestAnimationFrame(() => {
      navigate('/select-staff');
    })
  };

  const handleCallStaffs = async (type) => {
    const endpoint = type === "delivery"
      ? "/api/notify/delivery"
      : "/api/notify/general";
  
    try {
      const response = await fetch(`${endpoint}`, {
        method: "POST",
      });

      console.log(response)
  
      if (response.ok) {
        // ✅ 通知が成功したら「呼び出し中」画面へ遷移！
        navigate("/seliveryandInfocalling", { state: { type } }); // 受付種類を渡すこともできるよ
      } else {
        alert("通知に失敗しました！");
      }
    } catch (error) {
      console.error("通知エラー:", error);
      alert("通知エラーが発生しました！");
    }
  };

  useEffect(() => {
    resetTimer(); // 初回もタイマー開始

    const resetEvents = ['click', 'toouchstart']; // 画面タッチまたはクリックでリセット
    resetEvents.forEach(event =>
      window.addEventListener(event, resetTimer)
    );
    
    return () => {
      // クリーンアップ
      resetEvents.forEach(event => 
        window.removeEventListener(event, resetTimer)
      );
      clearTimeout(timerRef.current);
    };
  }, []);

  const resetTimer = () => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      navigate('/standby'); // 10秒操作がなかったら待機画面ヘ
    }, 10000);
  };

  

  return (
    // ✅ motion.div で画面全体をアニメーション付きでラップ
    <motion.div
      className="reception-form reception-page"
      initial={{ x: '100%', opacity: 0 }} // 最初は右から
      animate={{ x: 0, opacity: 1 }}       // 表示中は中央へ
      exit={{ x: '-100%', opacity: 0 }}    // 終了時は左へ
      transition={{ duration: 0.5, ease: 'easeInOut' }}        // アニメーションの速さ
    >
      {/* <div style={{background: `url(${background})`}}/> */}
      <h1 className="corporate-name">
        <img src="/image/ロゴタイプ3.png" alt="ロゴ" className="logo-icon" />
      </h1>

      <p className="fisrttext">いらっしゃいませ、ご用件を選んでください</p>

      <div className="reception-button">
        {/* 担当者呼び出し */}
        <button type="button" className="callstaff-button" onClick={handleCallStaff}>
          <img src="/image/担当者.png" alt="担当者" className="door-icon" />
          <div className="callstaff-text">担当者呼出し</div>
        </button>

        {/* 配送受付 */}
        <button type="button" className="delivery-button" onClick={() => handleCallStaffs("delivery")} >
          <img src="/image/配達.png" alt="配送" className="delivery-icon" />
          <div className="delivery-text">配送受付</div>
        </button>

        {/* 総合受付 */}
        <button type="button" className="general-button" onClick={() => handleCallStaffs("general")}>
          <img src="/image/総合受付.png" alt="総合受付" className="general-icon" />
          <div className="general-text">総合受付</div>
        </button>
      </div>
    </motion.div>
  );
};

export default Reception;
