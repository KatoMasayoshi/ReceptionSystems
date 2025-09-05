import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/style.css';
import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';

const LoginForm = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  // const [role, setRole] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [animateError, setAnimateError] = useState(false); // アニメーション用フラグ 
  const navigate = useNavigate();
  const qc = useQueryClient();

  // ログイン処理
  const handleLogin = async () => {
    try {
      // API に送信するデータ
      const payload = {
        username: userId,
        password: password,
      };

      // FastAPI に POST リクエストを送信
      // const response = await axios.post('/api/login', payload)
      // 開発環境
      const response = await axios.post('http://192.168.1.6:8000/login', payload)

      // 入力されたIDとPassword 同じレコードのrole列の値を取得
      const role = response.data.role;

      // roleを保持する
      localStorage.setItem("role", role);

      // レスポンス内容に応じて画面遷移
      if (role === 'admin') {
        await qc.prefetchQuery({
          queryKey: ['admin'],
          queryFn: () => axios.get('/api/admin').then(r => r.data),
          staleTime: 60_000,
        });
        navigate('/admin', {replace: true}); // 管理画面 => 管理者
      } else if(role === 'staff') { 
          await qc.prefetchQuery({
          queryKey: ['admin'],
          queryFn: () => axios.get('/api/admin').then(r => r.data),
          staleTime: 60_000,
        })
        navigate('/admin', {replace: true}); // 受付画面 => 管理者以外
      } else{
        await qc.prefetchQuery({
          queryKey: ['reception'],
          queryFn: () => axios.get('/api/reception').then(r => r.data),
          staleTime: 60_000,
        });
        navigate('/reception', {replace: true}); // 受付画面
      }
    } catch (error) {
      // エラーがあれば画面に表示
      setErrorMsg(error.response?.data?.detail || 'ログインに失敗しました');
      setAnimateError(true);

      // 300ms 後にフラグをオフ(再表示可能にする)
      setTimeout(() => setAnimateError(false), 300);
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
          autoComplete='off'
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        /><br />

        <label htmlFor="password" className="label-pw">password</label>
        <input
          type="password"
          id="password"
          name="password"
          required
          className="textbox"
          autoComplete='off'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br />

        {/* エラーメッセージがある場合は表示 */}
        {errorMsg && (
          <p className={`error-message ${animateError ? 'fade-in' : ''}`}>
            {errorMsg}
          </p>
        )}
        <button type="button" onClick={handleLogin} className="submitbutton">LogIn</button>
      </div>
    </form>
  );
};

export default LoginForm;
