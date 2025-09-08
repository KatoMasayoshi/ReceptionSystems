import React, { useEffect, useState , useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/selectstaff.css';
// import BackArrow from "../components/common/BackArrow";
import { motion } from 'motion/react';
import { useSound } from '../utils/sound';
import axios from 'axios';
import { flushSync } from 'react-dom';

import BackNavButton from '../components/common/BackNavButton';

const SelectStaff = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]); // 🔄 社員情報をここに取得
  const { playNav } = useSound(); 
  const pressedRef = useRef(false)

  // // 矢印
  // const [hidding, setHiding] = useState(false);

  // 🔄 ページ表示時にAPIから社員データを取得
  useEffect(() => {
    // axios.get('/api/employees')
    axios.get('http://192.168.1.7:8000/employees') // <= 開発環境
      .then(res => setEmployees(res.data))
      .catch(err => console.error('社員情報取得エラー:', err));
  }, []);

  // const handleBack = () => {
  //   requestAnimationFrame(() => {
  //     navigate('/reception');
  //   })
  // };

  // const handleStaffClick = (emp) => {
  //   playNav();
  //   requestAnimationFrame(() => {
  //     navigate('/input', { state: { staffName: emp.name, staffImage: emp.image_path } });
  //   })
  // };

  // const onArrowDown = () => {
  //   // このフレームで見た目を確実に更新
  //   flushSync(() => setHiding(true));
  //   playNav();
  // }

 const onStaffDown = () => {
   if (pressedRef.current) return;
   pressedRef.current = true;
   playNav(); // ← タップ瞬間に鳴らす
 };

 const onStaffUp = (emp) => {
   if (!pressedRef.current) return;
   pressedRef.current = false;
   navigate('/input', { state: { staffName: emp.name, staffImage: emp.image_path } }); // ← すぐ遷移
 };
  return (
    <>
      <BackNavButton to="/reception" />
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
            <div 
              key={index}  
              className="staff-card" 
              onPointerDown={onStaffDown}
              onPointerUp={() => onStaffUp(emp)}
              >
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