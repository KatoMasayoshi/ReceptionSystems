import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import BackArrow from '../components/common/BackArrow';
import Keyboard from '../components/common/Keyboard';
import '../css/inputform2.css';

// クリック時に音を出す
import { playClickSound } from '../utils/sound';

const InputForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedStaff = location.state?.staffName || '未選択';

  const [formData, setFormData] = useState({
    company: '',
    name: '',
    purpose: '新規打ち合わせ',
    persons: ''
  });
  const [showModal, setShowModal] = useState(false);
  const [keyboardTarget, setKeyboardTarget] = useState(null); // 自作キーボードの対象フィールド

  // 入力変更処理（来訪目的変更時の特別処理を含む）
  const handleChange = (e) => {
    const { id, value } = e.target;

    if (id === 'purpose') {
      if (value === '面接') {
        // 面接なら会社名を固定し、キーボードでの編集を無効化
        setFormData(prev => ({ ...prev, [id]: value, company: '------' }));
      } else {
        // 面接以外なら会社名を編集可能に戻す（空白に）
        setFormData(prev => ({ ...prev, [id]: value, company: '' }));
      }
    } else {
      setFormData(prev => ({ ...prev, [id]: value }));
    }
  };

  // 自作キーボード入力値の反映
  const handleKeyboardInput = (newValue) => {
    if (keyboardTarget) {
      setFormData(prev => ({ ...prev, [keyboardTarget]: newValue }));
    }
  };

  const handleSubmit = (e) => {
    playClickSound();
    e.preventDefault();
    setShowModal(true);
  };

  const handleCall = () => {
    playClickSound();
    axios.post('http://192.168.1.3:8000/api/visitors', formData)
      .then(() => {
        navigate('/calling', { state: { staffName: selectedStaff } });
      })
      .catch((err) => {
        console.error('来訪者の登録に失敗しました:', err);
      });
  };

  const handleBack = () => {
    navigate('/select-staff');
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h2 className="header-text">来訪目的・会社名・氏名を記入してください</h2>

        <div className="Form">
          <BackArrow onClick={handleBack} />

          {/* ▼ 来訪目的（先頭に移動） */}
          <div className="Form-Item">
            <p className="Form-Item-Label isMsg">
              <span className="Form-Item-Label-Required">必須</span>来訪目的
            </p>
            <select id="purpose" value={formData.purpose} onChange={handleChange}>
              <option value="新規打ち合わせ">新規打ち合わせ</option>
              <option value="既存打ち合わせ">既存打ち合わせ</option>
              <option value="面接">面接</option>
            </select>
          </div>

          {/* ▼ 会社名（面接の場合は自動入力＆入力不可） */}
          <div className="Form-Item">
            <p className="Form-Item-Label">
              <span className="Form-Item-Label-Required">必須</span>会社名
            </p>
            <input
              type="text"
              id="company"
              className="Form-Item-Input"
              placeholder="例）株式会社○○"
              autoComplete="off"
              value={formData.company}
              onClick={() => {
                if (formData.purpose !== '面接') setKeyboardTarget('company');
              }}
              readOnly
              disabled={formData.purpose === '面接'} // 面接時は入力無効
              required
            />
          </div>

          {/* ▼ 氏名 */}
          <div className="Form-Item">
            <p className="Form-Item-Label">
              <span className="Form-Item-Label-Required">必須</span>氏名
            </p>
            <input
              type="text"
              id="name"
              className="Form-Item-Input"
              placeholder="例）山田太郎"
              autoComplete="off"
              value={formData.name}
              onClick={() => setKeyboardTarget('name')}
              readOnly
              required
            />
          </div>

          {/* ▼ 同行人数 */}
          <div className="Form-Item">
            <p className="Form-Item-Label">
              <span className="Form-Item-Label-Optional">任意</span>同行人数
            </p>
            <input
              type="text"
              id="persons"
              className="Form-Item-Input"
              placeholder="例）1人"
              autoComplete="off"
              value={formData.persons}
              onClick={() => setKeyboardTarget('persons')}
              readOnly
            />
          </div>

          <button className="Form-Btn" type="submit">確認</button>
        </div>
      </form>

      {/* ▼ 自作キーボード（対象フィールドに応じて表示） */}
      {keyboardTarget && (
        <Keyboard
          value={formData[keyboardTarget]}
          onInput={handleKeyboardInput}
          onClose={() => setKeyboardTarget(null)}
        />
      )}

      {/* ▼ 確認モーダル */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content-confirmation">
            <h3>確認画面</h3>
            <p><strong>担当者 :</strong>{selectedStaff}</p>
            <p><strong>会社名：</strong>{formData.company}</p>
            <p><strong>氏名：</strong>{formData.name}</p>
            <p><strong>来訪目的：</strong>{formData.purpose}</p>
            <p><strong>同行人数：</strong>{formData.persons || 'なし'}</p>
            <button onClick={() => setShowModal(false)}>戻　る</button>
            <button onClick={handleCall}>呼び出し</button>
          </div>
        </div>
      )}
    </>
  );
};

export default InputForm;
