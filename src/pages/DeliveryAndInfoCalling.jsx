// src/pages/DeliveryAndInfoCalling.jsx
import React, {useEffect } from "react";
import { useNavigate, useLocation} from "react-router-dom";
import '../css/calling.css';

const DeliveryAndInfoCalling = () =>{
    const navigate = useNavigate();
    const location = useLocation();
    const iconImage = location.state?.image || '/image/default.png';

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/waitscreen');
        }, 5000 ) // 10秒後に受付画面に戻る

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="calling-page">
            <div className="loader">Loadding...</div>
                <img src={iconImage} alt="icon" className="image-icon" />
            <p className="calling-message">呼び出しています...</p>
        </div>
    )
};

export default DeliveryAndInfoCalling;