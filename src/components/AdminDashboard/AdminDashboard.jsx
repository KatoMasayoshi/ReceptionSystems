import React, { useState } from 'react';
// import EmployeeManagement from '../EmployeeManagement/EmployeeManagement';
// import VisitorLogs from '../VisitorLog/VisitorLogs';
// import AccountSettings from '../AccountSettings/AccountSettings'; // 追加！
import {  NavLink, Outlet } from 'react-router-dom';

import './AdminDashboard.css';

const AdminDashboard = () => {
  const [isEditing, setIsEditing] = useState(false); // 編集状態を親に伝える
  
  // adminだったらアカウント管理画面を表示 staffだったら非表示
  const role = localStorage.getItem("role");

  return (
    <div className={`admin-dashboard ${isEditing ? 'full-screen' : ''}`}>
      {!isEditing && (
        <div className="sidebar">
          <NavLink to="/admin/visitors" className={({isActive}) => isActive ? 'active' : ''}>
            来訪者管理
          </NavLink>

          <NavLink to="/admin/employees" className={({isActive}) => isActive ? 'active' : ''}>
            社員管理
          </NavLink>

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
