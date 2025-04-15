// src/pages/InputForm.jsx
// InputForm.jsx の先頭で追加
// import { useLocation } from 'react-router-dom';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import '../css/inputform2.css';

// const location = useLocation();
// const selectedStaff = location.state?.staffName || '未選択';


const InputForm = () => {
  const [formData, setFormData] = useState({
    company: '',
    name: '',
    purpose: '新規打ち合わせ',
    persons: ''
  });
  
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  

  const navigate = useNavigate();

  return (
    <>
    <form onSubmit={handleSubmit}>
      <h2 className="header-text">会社名・氏名・来訪目的を記入してください</h2>

      <div className="Form">
        {/* 会社名 */}
        <div className="Form-Item">
          <p className="Form-Item-Label">
            <span className="Form-Item-Label-Required">必須</span>会社名
          </p>
          <input
            type="text"
            id="company"
            className="Form-Item-Input"
            placeholder="例）株式会社○○"
            value={formData.company}
            onChange={handleChange}
            required
          />
        </div>

        {/* 氏名 */}
        <div className="Form-Item">
          <p className="Form-Item-Label">
            <span className="Form-Item-Label-Required">必須</span>氏名
          </p>
          <input
            type="text"
            id="name"
            className="Form-Item-Input"
            placeholder="例）山田太郎"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* 来訪目的 */}
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

        {/* 同行人数 */}
        <div className="Form-Item">
          <p className="Form-Item-Label">
            <span className="Form-Item-Label-Optional">任意</span>同行人数
          </p>
          <input
            type="text"
            id="persons"
            className="Form-Item-Input"
            placeholder="例）1人"
            value={formData.persons}
            onChange={handleChange}
          />
        </div>

        <button className="Form-Btn" type="submit">確認</button>
      </div>
    </form>

    {showModal && (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>確認画面</h3>
        <p><strong>会社名：</strong>{formData.company}</p>
        <p><strong>氏名：</strong>{formData.name}</p>
        <p><strong>来訪目的：</strong>{formData.purpose}</p>
        <p><strong>同行人数：</strong>{formData.persons || 'なし'}</p>
        
        <button onClick={() => setShowModal(false)}>戻　る</button>
        <button onClick={() => navigate('/calling', { state: { staffName: formData.name} })}>呼び出し</button>
      </div>
    </div>
  )}
    </>
  );
};

export default InputForm;
