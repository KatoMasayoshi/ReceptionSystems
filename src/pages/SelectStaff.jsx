// src/pages/SelectStaff.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/selectstaff.css';
import BackArrow from "../components/common/BackArrow";
import { motion } from 'motion/react';
import { playClickSound } from '../utils/sound';

// ✅ 社員情報：画像パス・名前・部署を含む配列
const employees = [
  { name: '尾川 健斗', department: '営業部', image: '/image/ogawa.jpg' },
  { name: '船古 陸斗', department: '営業部', image: '/image/funako.jpg' },
  { name: '阿部 圭祐', department: 'ITソリューション事業部', image: '/image/abe.jpg' },
  { name: '古瀬 康浩', department: 'ITソリューション事業部', image: '/image/furuse.jpg' },
  { name: '村上 優太', department: 'ITソリューション事業部', image: '/image/murakami.jpg' },
  { name: '加藤 優凱', department: 'ITソリューション事業部', image: '/image/kato.jpg' },
];

const SelectStaff = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    playClickSound();
    navigate('/reception');
  };

  const handleStaffClick = (name) => {
    playClickSound();
    navigate('/input', { state: { staffName: name } });
  };

  return (
    <>
      {/* ✅ 戻るボタンはアニメーション外に出すことでズレを防止 */}
      <BackArrow onClick={handleBack} />

      <motion.div
        className="select-staff-page"
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '-100%', opacity: 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        <h1 className='selectstaff-title'>担当者を選択してください</h1>

        {/* ✅ 社員カードをグリッド表示 */}
        <div className="staff-grid">
          {employees.map((emp, index) => (
            <div key={index} className="staff-card" onClick={() => handleStaffClick(emp.name)}>
              <img src={emp.image} alt={emp.name} className="staff-image" />
              <p className="staff-name">{emp.name}</p>
              <p className="staff-department">{emp.department}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </>
  );
};

export default SelectStaff;
