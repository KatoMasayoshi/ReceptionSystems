import React, { useState } from 'react';
import EmployeeManagement from '../EmployeeManagement/EmployeeManagement';
import VisitorLogs from '../VisitorLog/VisitorLogs';
import AccountSettings from '../AccountSettings/AccountSettings'; // 追加！
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('visitor');
  const [isEditing, setIsEditing] = useState(false); // 編集状態を親に伝える

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className={`admin-dashboard ${isEditing ? 'full-screen' : ''}`}>
      {!isEditing && (
        <div className="sidebar">
          <button
            className={activeTab === 'visitor' ? 'active' : ''}
            onClick={() => handleTabChange('visitor')}
          >
            来訪者管理
          </button>
          <button
            className={activeTab === 'employee' ? 'active' : ''}
            onClick={() => handleTabChange('employee')}
          >
            社員管理
          </button>
          <button
            className={activeTab === 'setting' ? 'active' : ''}
            onClick={() => handleTabChange('setting')}
          >
            アカウント管理
          </button>
          <button className="logout" onClick={() => window.location.href = '/'}>
            ログアウト
          </button>
        </div>
      )}
      <main className="main-content">
        {activeTab === 'visitor' && (
          <VisitorLogs isEditing={isEditing} setIsEditing={setIsEditing} />
        )}
        {activeTab === 'employee' && <EmployeeManagement />}
        {activeTab === 'setting' && <AccountSettings />} {/* 新しく追加！ */}
      </main>
    </div>
  );
};

export default AdminDashboard;
