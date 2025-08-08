import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../css/standby.css"; // 待機画面用のCSSを作る！

const StandbyScreen = () => {
  const navigate = useNavigate();

  const handleScreenClick = () => {
    navigate('/reception'); // タップしたらホームへ戻る！
  };

  return (
    <div className="standby-screen" onClick={handleScreenClick}>
      <video
        className="standby-video"
        src="/a-proudロゴアニメーション9.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
    </div>
  );
};

export default StandbyScreen;
