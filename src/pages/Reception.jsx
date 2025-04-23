// src/pages/Reception.jsx
import React from 'react';
import '../css/reception.css';
import { useNavigate } from 'react-router-dom';
// ✅ motionを読み込み
import { motion } from 'motion/react';

import { playClickSound } from '../utils/sound';

const Reception = () => {
  const navigate = useNavigate();

  const handleCallStaff = () => {
    playClickSound();
    navigate('/select-staff');
  };

  const handleCallStaffs = () => {
    playClickSound();
    navigate('/seliveryandInfocalling');
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
      <h1 className="corporate-name">
        <img src="/image/ロゴタイプ2.png" alt="ロゴ" className="logo-icon" />
      </h1>

      <p className="fisrttext">いらっしゃいませ、ご用件を選んでください</p>

      <div className="reception-button">
        {/* 担当者呼び出し */}
        <button type="button" className="callstaff-button" onClick={handleCallStaff}>
          <img src="/image/door_調整3(484A5A).png" alt="担当者" className="door-icon" />
          <div className="callstaff-text">担当者呼出し</div>
        </button>

        {/* 配送受付 */}
        <button type="button" className="delivery-button" onClick={handleCallStaffs}>
          <img src="/image/配送アイコン2(cccccc).png" alt="配送" className="delivery-icon" />
          <div className="delivery-text">配送受付</div>
        </button>

        {/* 総合受付 */}
        <button type="button" className="general-button" onClick={handleCallStaffs}>
          <img src="/image/326650.png" alt="総合受付" className="general-icon" />
          <div className="general-text">総合受付</div>
        </button>
      </div>
    </motion.div>
  );
};

export default Reception;
