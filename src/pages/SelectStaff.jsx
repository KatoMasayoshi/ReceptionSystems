import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/selectstaff.css';
import BackArrow from "../components/common/BackArrow";
import { motion } from 'motion/react';
import { playClickSound } from '../utils/sound';
import axios from 'axios';

const SelectStaff = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]); // 🔄 社員情報をここに取得

  // 🔄 ページ表示時にAPIから社員データを取得
  useEffect(() => {
    axios.get('/api/employees')
      .then(res => setEmployees(res.data))
      .catch(err => console.error('社員情報取得エラー:', err));
  }, []);

  const handleBack = () => {
    playClickSound();
    navigate('/reception');
  };

  const handleStaffClick = (emp) => {
    playClickSound();
    navigate('/input', { state: { staffName: emp.name, staffImage: emp.image_path } });
  };

  return (
    <>
      <BackArrow onClick={handleBack} />
      <motion.div
        className="select-staff-page"
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '-100%', opacity: 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        <h1 className='selectstaff-title'>担当者を選択してください</h1>

        <div className="staff-grid">
          {employees.map((emp, index) => (
            <div key={index} className="staff-card" onClick={() => handleStaffClick(emp)}>
              <img src={emp.image_path} alt={emp.name} className="select_staff-image" />
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