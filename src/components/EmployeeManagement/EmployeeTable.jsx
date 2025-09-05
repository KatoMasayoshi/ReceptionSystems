// EmployeeTable.jsx
import React, { useEffect, useState } from 'react';
import './EmployeeTable.css';
import axios from 'axios';

const EmployeeTable = () => {
  // オブジェクト配列 const[現在の状態を保持する変数, 状態を更新するための関数] = useState(状態の初期値で、文字列、数値、配列、オブジェクトなど、任意のデータ型を指定)
  // 従業員のオブジェクト配列
  const [employees, setEmployees] = useState([]);
  const [editingId, setEditingId] = useState(null);
  // 編集ボタン押下時に使用するオブジェクト配列
  const [editFormData, setEditFormData] = useState({ name: '', department: '', image_path: '' });
  // 追加ボタンを押下時に使用するオブジェクト配列
  const [newEmployee, setNewEmployee] = useState({ name: '', department: '', image_path: '' });
  const [showModal, setShowModal] = useState(false);
  // アップロード中のローディング(今は使用していない)
  // const [uploading, setUploading] = useState(false);
  // const [progress, setProgress] = useState(0);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = () => {
    // axios.get('/api/employees')
    axios.get('http://192.168.1.5:8000/employees')
    .then((res) => setEmployees(res.data))
      .catch((err) => console.error(err));
  };

  // 編集ボタンが押下されたときの処理
  const handleEditClick = (employee) => {
    setEditingId(employee.id);
    setEditFormData({
      name: employee.name,
      department: employee.department,
      image_path: employee.image_path || ''
    });
  };

  // 保存ボタンが押下されたときの処理
  const handleSaveClick = async (id) => {
    try{
      // await axios.put(`/api/employees/${id}`, {
      await axios.put(`http://192.168.1.5:8000/employees/${id}`, {
        name: editFormData.name,
        department: editFormData.department,
        image_path: editFormData.image_path
      });

      fetchEmployees();
      setEditingId(null);
    } catch(err){
      console.error("保存エラー:", err);
    }
  };


  // 削除確認で'はい'が押されたときの処理
  const handleDeleteClick = (id) => {
    // axios.delete(`/api/employees/${id}`)
    console.log(id)
    axios.delete(`http://192.168.1.5:8000/employees/${id}`)
      .then(() => {
        setEmployees(employees.filter(emp => emp.id !== id));
      })
      .catch(err => console.error(err));
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNewInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee(prev => ({ ...prev, [name]: value }));
  };

  // 画像を選択する処理
  // const handleImageSelect = (e, isEdit = false) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     const relativePath = `/image/${file.name}`; // public/image/ 配下前提
  //     console.log(relativePath);
  //     if (isEdit) {
  //       setEditFormData(prev => ({ ...prev, image_path: relativePath }));
  //     } else {
  //       setNewEmployee(prev => ({ ...prev, image_path: relativePath }));
  //     }
  //   }
  // };

  const handleImageSelect = async (e, isEdit = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const baseName = isEdit ? editFormData.name : newEmployee.name;

    const name = String(baseName || "").trim() || file.name.replace(/\.[^.]+$/, ''); // 拡張子除去


    // クライアント側で軽くバリデーション(任意)
    if(!/^image\/(png|jpe?g|gif|webp)$/.test(file.type)){
      alert("画像ファイル(png/jpg/jpeg/gif/webp)を選択してください");
      return;
    }
    if(file.size > 10 * 1024 * 1024){ // 10MB例
      alert("ファイルが大きすぎます(10MBまで)");
      return;
    }

    // サーバーに画像を送るためにFormDataを作成する
    const fd = new FormData();
    fd.append("file", file);    // ファイル本体
    fd.append("name", name);    // 任意の名前(社員名など)


    try{

      // const res = await axios.post('/api/upload-image', fd);
      const res = await axios.post('http://192.168.1.5:8000/upload-image', fd);

      console.log(res.data.image_path);
      // サーバーが返したURL(/images/xxx)をそのまま保持
      if (isEdit){
        setEditFormData(prev => ({...prev, image_path: res.data.image_path}));
      } else{
      setNewEmployee(prev => ({...prev, image_path: res.data.image_path }))
      }
    }catch (err){
      console.error("アップロード失敗:", err);
      alert("アップロード失敗");
    } finally {
      // setUploading(false);
    }
  };

  const handleAddEmployee = () => {
    // axios.post('/api/employees', newEmployee)
    axios.post('http://192.168.1.5:8000/employees', newEmployee)
      .then(() => {
        fetchEmployees();
        setNewEmployee({ name: '', department: '', image_path: '' });
        setShowModal(false);
      });
  };

  // 削除ボタン押下時に確認メッセージを出す処理
  const confirmDelete = (id) => {
    let checkSaveFlg = window.confirm('削除しますか？');
    if(checkSaveFlg){
      handleDeleteClick(id)
    } else{
      // 何もしない
      return;
    }
  }

  return (
    <div className="employee-table-container">
      <h2>社員管理</h2>

      <button className='add-button' onClick={() => setShowModal(true)}>追加</button>

      {showModal && (
        <div className="modal-overlay_employee">
          <div className="modal">
            <h3>新規社員追加</h3>
            <input
              type="text"
              name="name"
              placeholder="氏名"
              value={newEmployee.name}
              onChange={handleNewInputChange}
            />
            <input
              type="text"
              name="department"
              placeholder="所属部署"
              value={newEmployee.department}
              onChange={handleNewInputChange}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageSelect(e)}
              onClick={(e) => e.stopPropagation()}
            />
            {newEmployee.image_path && (
              <img src={newEmployee.image_path} alt="プレビュー" style={{ width: 80, height: 80 }} />
            )}
            <div className="modal-buttons">
              <button onClick={handleAddEmployee}>保存</button>
              <button onClick={() => setShowModal(false)}>キャンセル</button>
            </div>
          </div>
        </div>
      )}

      <div className='employee-table-wrapper'>
        <table className="employee-table">
          <thead>
            <tr>
              <th>氏名</th>
              <th>所属部署</th>
              <th>画像</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id}>
                <td>
                  {editingId === emp.id ? (
                    <input
                      type="text"
                      name="name"
                      value={editFormData.name}
                      onChange={handleInputChange}
                    />
                  ) : emp.name}
                </td>
                <td>
                  {editingId === emp.id ? (
                    <input
                      type="text"
                      name="department"
                      value={editFormData.department}
                      onChange={handleInputChange}
                    />
                  ) : emp.department}
                </td>
                <td>
                  {editingId === emp.id ? (
                    <>
                      <input type="file" accept="image/*" onChange={(e) => handleImageSelect(e, true)} />
                      {editFormData.image_path && (
                        <img src={editFormData.image_path} alt="プレビュー" style={{ width: 60 }} />
                      )}
                    </>
                  ) : (
                    emp.image_path && <img src={emp.image_path} alt="社員画像" style={{ width: 60 }} />
                  )}
                </td>
                <td>
                  {editingId === emp.id ? (
                    <button onClick={() => handleSaveClick(emp.id)}>保存</button>
                  ) : (
                    <>
                      <button onClick={() => handleEditClick(emp)}>編集</button>
                      <button className='delete-button' onClick={() => confirmDelete(emp.id)}>削除</button>
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

export default EmployeeTable;
