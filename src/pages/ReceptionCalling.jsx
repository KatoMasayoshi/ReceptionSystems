// src/pages/Calling.jsx
import React, { useEffect }from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import '../css/calling.css'; // ← CSSファイルを分けてもOK！

const Calling = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const staffName = location.state?.staffName || '担当者';
  
    useEffect(() => {
      const timer = setTimeout(() => {
        navigate('/waitscreen');
      }, 3000);
  
      return () => clearTimeout(timer);
    }, [navigate]);
  
    return (
      <div className="calling-page">
        <div className="loader">Loading...</div>
        <p className="calling-message">{staffName}を呼び出しています...</p>
      </div>
    );
  };


export default Calling;
