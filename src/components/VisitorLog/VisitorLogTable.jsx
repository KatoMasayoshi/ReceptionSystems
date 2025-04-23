import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './VisitorLogTable.css';

const VisitorLogTable = ({ isEditing, setIsEditing }) => {
  // DBから取得した来訪ログ一覧（state）
  const [visitorLogs, setVisitorLogs] = useState([]);

  // 最初の1回だけ実行される処理（DBから一覧取得）
  useEffect(() => {
    axios.get('http://localhost:8000/api/visitor-logs')
      .then((res) => setVisitorLogs(res.data))
      .catch((err) => console.error('取得失敗:', err));
  }, []);

  // 入力変更をstateに反映させる関数
  const handleChange = (id, field, value) => {
    const updated = visitorLogs.map(log =>
      log.id === id ? { ...log, [field]: value } : log
    );
    setVisitorLogs(updated);
  };

  // 保存ボタンを押したときにDBに変更を送信する処理
  const handleSave = () => {
    const updateRequests = visitorLogs.map(log =>
      axios.put(`http://localhost:8000/api/visitor-logs/${log.id}`, {
        check_in: log.check_in,
        check_out: log.check_out,
        company: log.company,
        name: log.name,
        purpose: log.purpose,
        companions: log.companions
      })
    );

    // 全ての更新リクエストが終わったら編集モードをオフにして再取得
    Promise.all(updateRequests)
      .then(() => {
        alert('保存が完了しました！');
        setIsEditing(false);
        // 最新データ取得
        return axios.get('http://localhost:8000/api/visitor-logs');
      })
      .then((res) => setVisitorLogs(res.data))
      .catch((err) => {
        console.error('保存エラー:', err);
        alert('保存中にエラーが発生しました。');
      });
  };

  return (
    <div className="visitorlog-container">
      <div className="visitorlog-header">
        <h2>来訪者管理</h2>
        <div className="visitorlog-controls">
          {/* 編集ボタン：ON/OFF */}
          <button onClick={() => setIsEditing(!isEditing)} className="edit-btn">
            {isEditing ? 'キャンセル' : '編集'}
          </button>
          {/* 保存ボタン */}
          <button onClick={handleSave} className="save-btn">保存</button>
        </div>
      </div>
      <div className="visitor-table-wrapper">
        <table className="visitorlog-table">
          <thead>
            <tr>
              <th>入出時間</th>
              <th>退出時間</th>
              <th>会社名</th>
              <th>氏名</th>
              <th>来訪目的</th>
              <th>同行人数</th>
            </tr>
          </thead>
          <tbody>
            {visitorLogs.map(log => (
              <tr key={log.id}>
                <td>
                  {isEditing ? (
                    <input
                      value={log.check_in || ''}
                      onChange={(e) => handleChange(log.id, 'check_in', e.target.value)}
                    />
                  ) : (
                    log.check_in ? String(log.check_in).replace('T', ' ') : '-'
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <input
                      value={log.check_out || ''}
                      onChange={(e) => handleChange(log.id, 'check_out', e.target.value)}
                    />
                  ) : (
                    log.check_out ? String(log.check_out).replace('T', ' ') : '-'
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <input
                      value={log.company || ''}
                      onChange={(e) => handleChange(log.id, 'company', e.target.value)}
                    />
                  ) : (
                    log.company || '-'
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <input
                      value={log.name || ''}
                      onChange={(e) => handleChange(log.id, 'name', e.target.value)}
                    />
                  ) : (
                    log.name || '-'
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <select
                      value={log.purpose || ''}
                      onChange={(e) => handleChange(log.id, 'purpose', e.target.value)}
                    >
                      <option value="既存打ち合わせ">既存打ち合わせ</option>
                      <option value="新規打ち合わせ">新規打ち合わせ</option>
                      <option value="面接">面接</option>
                    </select>
                  ) : (
                    log.purpose || '-'
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <input
                      value={log.companions || ''}
                      onChange={(e) => handleChange(log.id, 'companions', e.target.value)}
                    />
                  ) : (
                    log.companions || '-'
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

export default VisitorLogTable;
