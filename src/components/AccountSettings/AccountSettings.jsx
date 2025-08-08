// AccountSettings.jsx（スクロールとモーダル対応）
import React, { useEffect, useState } from 'react';
import './AccountSettings.css';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const AccountSettings = () => {
  const [users, setUsers] = useState([]);
  const [editUserId, setEditUserId] = useState(null);
  const [editFormData, setEditFormData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios.get('/api/users')
      .then(res => setUsers(res.data))
      .catch(err => console.error('ユーザー取得エラー:', err));
  };

  const isValidPassword = (password) => {
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);
    return password.length >= 8 && hasUpper && hasLower && hasSymbol;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddUser = () => {
    setErrorMessage('');

    if (!isValidPassword(formData.password)) {
      setErrorMessage('パスワードは大文字・小文字・記号を含み、8文字以上である必要があります');
      return;
    }

    const duplicate = users.find(u => u.password === formData.password);
    if (duplicate) {
      setErrorMessage('既に登録されているため、パスワードを変更してください');
      return;
    }

    axios.post('/api/users', formData)
      .then(() => {
        setFormData({ username: '', password: '' });
        setIsModalOpen(false);
        fetchUsers();
      })
      .catch(err => console.error('ユーザー作成エラー:', err));
  };

  const handleEdit = (user) => {
    setEditUserId(user.id);
    setEditFormData({ username: user.username, password: user.password });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (id) => {
    axios.put(`/api/users/${id}`, editFormData)
      .then(() => {
        setEditUserId(null);
        fetchUsers();
      })
      .catch(err => console.error('保存エラー:', err));
  };

  const handleDelete = (id) => {
    axios.delete(`/api/users/${id}`)
      .then(() => fetchUsers())
      .catch(err => console.error('削除エラー:', err));
  };

  return (
    <div className="account-settings-container">
      <h2>アカウント設定</h2>

      {/* アカウント作成ボタン */}
      <button onClick={() => setIsModalOpen(true)} className="add-user-form-button">アカウント作成</button>

      {/* モーダル */}
      {isModalOpen && (
        <div className="modal-overlay_account">
          <div className="modal-content">
            <h3>アカウント作成</h3>
            <input
              type="text"
              name="username"
              placeholder="ユーザー名"
              value={formData.username}
              onChange={handleChange}
            />
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="半角英字大小・数字・記号・8桁以上"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="toggle-password-icon"
                onClick={() => setShowPassword(prev => !prev)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <div className="modal-actions">
              <button onClick={handleAddUser}>追加</button>
              <button className="cancel-button" onClick={() => setIsModalOpen(false)}>キャンセル</button>
            </div>
          </div>
        </div>
      )}

      {/* 一覧表示（スクロール対応ラップ） */}
      <div className="account-table-wrapper">
        <table className="account-table">
          <thead>
            <tr>
              <th>ユーザー名</th>
              <th>パスワード</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {users
            .filter(user => user.username !== 'admin')
            .map(user => (
              <tr key={user.id}>
                <td>
                  {editUserId === user.id ? (
                    <input
                      type="text"
                      name="username"
                      value={editFormData.username}
                      onChange={handleEditChange}
                    />
                  ) : (
                    user.username
                  )}
                </td>
                <td>
                  {editUserId === user.id ? (
                    <input
                      type="password"
                      name="password"
                      value={editFormData.password}
                      onChange={handleEditChange}
                    />
                  ) : (
                    user.password
                  )}
                </td>
                <td>
                  {editUserId === user.id ? (
                    <button onClick={() => handleSave(user.id)}>保存</button>
                  ) : (
                    <>
                      <button onClick={() => handleEdit(user)}>編集</button>
                      <button onClick={() => handleDelete(user.id)}>削除</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccountSettings;
