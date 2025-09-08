import React, { useState , useEffect} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Keyboard from '../components/common/Keyboard';
import '../css/inputform2.css';

// クリック時に音を出す
import { useSound } from '../utils/sound';
import BackNavButton from '../components/common/BackNavButton';
// import { flushSync } from 'react-dom';

const InputForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedStaff = location.state?.staffName || '未選択';
  const selectedImage = location.state?.staffImage || '/image/default.png';
  const { playNav } = useSound();
  const [formData, setFormData] = useState({
    company: '',
    name: '',
    purpose: '新規打ち合わせ',
    persons: ''
  });
  // 自作キーボードの対象フィールド
  const [keyboardTarget, setKeyboardTarget] = useState(null); 
  // キーボードオープン時に矢印を非表示にする(画面遷移)
  const [kbOpen, setKbOpen] = useState(false);

  // キーボードを開く/閉じるタイミングでtrue/falseをセット
  const onFocus = () => setKbOpen(true);
  const onBlur = ()  => setKbOpen(false);

  useEffect(() => {
    document.body.classList.toggle('kb-open', kbOpen);
    return () => document.body.classList.remove('kb-open');
  }, [kbOpen]);

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
    playNav();
    requestAnimationFrame(() => {
      e.preventDefault();
    })
  };

  const handleCall = () => {
    playNav();
    requestAnimationFrame(() => {
      // 🔍 バリデーション：必須項目チェック
      if (!formData.company || !formData.name || !formData.purpose) {
        alert("⚠️ 必須項目がすべて入力されているか確認してください！");
        return; // ⛔ 処理を中断
      }    
    })

    // DBに来訪者情報を登録
    // axios.post('/api/visitors', formData)
    axios.post('http://192.168.1.7:8000/visitors', formData)
      .then(() => {
        // 登録が成功したら、LINE通知用にデータを整形して送信！
        const notifyData = {
          employee_name: selectedStaff,       // 担当者名（事前に選ばれている）
          purpose: formData.purpose,          // 来訪目的
          company: formData.company,          // 会社名
          name: formData.name,                // 来訪者の氏名
          companions: formData.persons        // 同行人数
        };

        // axios.post('/api/notify', notifyData)
        axios.post('http://192.168.1.7:8000/notify', notifyData)
          .then(() => {
            // 通知成功したら「呼び出し中」画面へ遷移
            navigate('/calling', { state: { staffName: selectedStaff, staffImage: selectedImage } });
          })
          .catch((err) => {
            console.error('LINE通知に失敗しました:', err);
            alert("通知に送信に失敗しました");
          });
      })
      .catch((err) => {
        console.error('来訪者の登録に失敗しました:', err);
      });
  };




  // const handleBack = () => {
  //   navigate('/select-staff');
  // };

  return (
    <div className='input-screen'>
      <form onSubmit={handleSubmit}>
        <h2 className="header-text">来訪目的・会社名・氏名を記入してください</h2>

        <div className="Form">
          <BackNavButton to="/select-staff" />

          {/* ▼ 来訪目的（先頭に移動） */}
          <div className="Form-Item">
            <p className="Form-Item-Label isMsg">
              <span className="Form-Item-Label-Required">必須</span>来訪目的
            </p>
            <select id="purpose" value={formData.purpose} onChange={handleChange} className='select-purpose'>
              <option value="新規打ち合わせ">新規打ち合わせ</option>
              <option value="既存打ち合わせ">既存打ち合わせ</option>
              <option value="面接">面接</option>
            </select>
          </div>

          {/* ▼ 会社名（面接の場合は自動入力＆入力不可） */}
          <div className="Form-Item">
            <p className="Form-Item-Label">
              <span className="Form-Item-Label-Required-company">必須</span>会社名
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
                setKbOpen(true);
              }}
              readOnly
              disabled={formData.purpose === '面接'} // 面接時は入力無効
              required
            />
          </div>

          {/* ▼ 氏名 */}
          <div className="Form-Item">
            <p className="Form-Item-Label">
              <span className="Form-Item-Label-Required-name">必須</span>氏　名
            </p>
            <input
              type="text"
              id="name"
              className="Form-Item-Input"
              placeholder="例）山田太郎"
              autoComplete="off"
              value={formData.name}
              onClick={() => {setKeyboardTarget('name'); setKbOpen(true); }}
              readOnly
              required
            />
          </div>

          {/* ▼ 同行人数 */}
          <div className="Form-Item">
            <p className="Form-Item-Label">
              <span className="Form-Item-Label-Optional">任意</span>同行人数
            </p>
            <select
              id="persons"
              className="Form-Item-Input"
              value={formData.persons}
              onChange={handleChange}
            >
              <option value="0人">0人</option>
              <option value="1人">1人</option>
              <option value="2人">2人</option>
              <option value="3人">3人</option>
            </select>
          </div>

          <button className="Form-Btn" type="button" onClick={handleCall}>呼び出し</button>
        </div>
      </form>

      {/* ▼ 自作キーボード（対象フィールドに応じて表示） */}
      {keyboardTarget && (
        <Keyboard
          value={formData[keyboardTarget]}
          onInput={handleKeyboardInput}
          onClose={() => {setKeyboardTarget(null); setKbOpen(false);}}
          placeholder={
            keyboardTarget === 'company'
              ? 'あなたの会社名'
              : keyboardTarget === 'name'
                ? 'あなたのお名前'
                : '入力してください'
          }
        />
      )}
    </div>
  );
};

export default InputForm;
