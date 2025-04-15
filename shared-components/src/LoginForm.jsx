import React, { useState } from 'react';
import './style.css';

const LoginForm = () => {
  const [userId, setUserId] = useState('');

  const handleLogin = () => {
    console.log('ログインID:', userId);

    if (userId.startsWith('admin')) {
      // 管理者IDの例：admin001 → 管理画面へ
      window.location.href = '/admin';
    } else {
      // それ以外 → 受付画面へ
      window.location.href = '/reception';
    }
  };

  return (
    <form id="loginForm" onSubmit={(e) => e.preventDefault()}>
      <div className="center-container login-page">
        <h1 className="titlename">受付システム</h1>

        <label htmlFor="userid" className="label-id">ID</label>
        <input
          type="text"
          id="userid"
          name="userid"
          required
          className="textbox"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        /><br />

        <label htmlFor="password" className="label-pw">password</label>
        <input type="password" id="password" name="password" required className="textbox" /><br />

        <button type="button" onClick={handleLogin} className="submitbutton">LogIn</button>
      </div>
    </form>
  );
};

export default LoginForm;
