// src/pages/Reception.jsx
import React from 'react';
import '../css/reception.css';
import { useNavigate } from 'react-router-dom';

const Reception = () => {
  const navigate = useNavigate();

  const handleCallStaff = () => {
    navigate('/select-staff');
  }

  const handleCallStaffs = () =>{
    navigate('/seliveryandInfocalling');
  }
  return (
    <div className="reception-form reception-page">
      <h1 className="corporate-name">
        <img src="/image/ロゴタイプ2.png" alt="ロゴ" className="logo-icon" />
      </h1>

      <p className="fisrttext">いらっしゃいませ、ご用件を選んでください</p>

      <div className="reception-button">
        {/* 担当者呼び出し */}
        <button type="button" className="callstaff-button" onClick={handleCallStaff}>
          <img src="/image/door_調整3(484A5A).png" alt="担当者" className="door-icon" />
          <div className="callstaff-text">担当者呼出</div>
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
    </div>
  );
};

export default Reception;
