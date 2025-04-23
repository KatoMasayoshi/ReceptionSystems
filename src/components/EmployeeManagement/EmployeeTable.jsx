// EmployeeTable.jsx
import React, { useEffect, useState } from 'react';
import './EmployeeTable.css';
import axios from 'axios';

const EmployeeTable = () => {
  const [employees, setEmployees] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', department: '', image_path: '' });
  const [newEmployee, setNewEmployee] = useState({ name: '', department: '', image_path: '' });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = () => {
    axios.get('http://localhost:8000/api/employees')
      .then((res) => setEmployees(res.data))
      .catch((err) => console.error(err));
  };

  const handleEditClick = (employee) => {
    setEditingId(employee.id);
    setEditFormData({
      name: employee.name,
      department: employee.department,
      image_path: employee.image_path || ''
    });
  };

  const handleSaveClick = async (id) => {
    try {
      // 名前と部署の更新
      await axios.put(`http://localhost:8000/api/employees/${id}`, {
        name: editFormData.name,
        department: editFormData.department
      });
  
      // 画像があれば画像パスも更新
      if (editFormData.imageFile) {
        const imagePath = `/image/${editFormData.imageFile.name}`;
        await axios.put(`http://localhost:8000/api/employees/${id}/select-image`, {
          image_path: imagePath
        });
      }
  
      fetchEmployees();
      setEditingId(null);
    } catch (err) {
      console.error("保存エラー:", err);
    }
  };

  const handleDeleteClick = (id) => {
    axios.delete(`http://localhost:8000/api/employees/${id}`)
      .then(() => {
        setEmployees(employees.filter(emp => emp.id !== id));
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNewInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee(prev => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = (e, isEdit = false) => {
    const file = e.target.files[0];
    if (file) {
      const relativePath = `/image/${file.name}`; // public/image/ 配下前提
      if (isEdit) {
        setEditFormData(prev => ({ ...prev, image_path: relativePath }));
      } else {
        setNewEmployee(prev => ({ ...prev, image_path: relativePath }));
      }
    }
  };

  const handleAddEmployee = () => {
    axios.post('http://localhost:8000/api/employees', newEmployee)
      .then(() => {
        fetchEmployees();
        setNewEmployee({ name: '', department: '', image_path: '' });
        setShowModal(false);
      });
  };

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
                      <button onClick={() => handleDeleteClick(emp.id)}>削除</button>
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
