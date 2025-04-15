import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/selectstaff.css';

const SelectStaff = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/reception');
  };

  const handleStaffClick = (name) => {
    console.log(`選択された担当者: ${name}`);
    // データを渡したい場合は state で渡せる！
    navigate('/input', { state: { staffName: name } });
  };

  return (
    <div className="select-staff-page">
      <button onClick={handleBack} className="arrow-button" aria-label="戻る">
        <svg className="arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
          <path style={{ fill: '#030104' }} d="M6,6V3L0,8l6,5v-3c4-1,7-0.5,10,2C14,7,10.5,6,6,6z" />
        </svg>
      </button>

      <h1>担当者を選択してください</h1>

      <div className="staffselect-button">
        {['尾川 健斗', '船古 陸斗', '阿部 圭祐', '古瀬 康浩', '村上 優太', '加藤 優凱'].map((name, index) => (
          <button
            key={index}
            className={`staff${index + 1}`}
            onClick={() => handleStaffClick(name)}
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SelectStaff;
