import React, { useState } from 'react';
// import EmployeeManagement from '../EmployeeManagement/EmployeeManagement';
// import VisitorLogs from '../VisitorLog/VisitorLogs';
// import AccountSettings from '../AccountSettings/AccountSettings'; // 追加！
import {  NavLink, Outlet } from 'react-router-dom';

import './AdminDashboard.css';

const AdminDashboard = () => {
  // const [activeTab, setActiveTab] = useState('visitor');
  // const [isEditing, setIsEditing] = useState(false); // 編集状態を親に伝える

  // const handleTabChange = (tab) => {
  //   setActiveTab(tab);
  // };

  const [isEditing, setIsEditing] = useState(false); // 編集状態を親に伝える
  // const navigate = useNavigate();
  // console.log(localStorage.setItem("role"));
  const role = localStorage.getItem("role");



  return (
    <div className={`admin-dashboard ${isEditing ? 'full-screen' : ''}`}>
      {!isEditing && (
        <div className="sidebar">
          {/* <button
            className={activeTab === 'visitor' ? 'active' : ''}
            onClick={() => handleTabChange('visitor')}
          >
            来訪者管理
          </button> */}
          <NavLink to="/admin/visitors" className={({isActive}) => isActive ? 'active' : ''}>
            来訪者管理
          </NavLink>
          {/* <button
            className={activeTab === 'employee' ? 'active' : ''}
            onClick={() => handleTabChange('employee')}
          >
            社員管理
          </button> */}

          <NavLink to="/admin/employees" className={({isActive}) => isActive ? 'active' : ''}>
            社員管理
          </NavLink>
          {/* <button
            className={activeTab === 'setting' ? 'active' : ''}
            onClick={() => handleTabChange('setting')}
          >
            アカウント管理
          </button> */}
          {role === 'admin' &&(
            <NavLink to="/admin/accounts" className={({isActive}) => isActive ? 'active' : ''}>
              アカウント管理
            </NavLink>
          )}
          <button className="logout" onClick={() => window.location.href = '/'}>
            ログアウト
          </button>
        </div>
      )}
      <main className="main-content">
        {/* 子ルートをここに描画 */}
        <Outlet context={{ isEditing, setIsEditing }} />
      </main>
    </div>
  );
};

export default AdminDashboard;
