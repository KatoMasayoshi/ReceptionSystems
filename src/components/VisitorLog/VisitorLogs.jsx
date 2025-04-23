import React from 'react';
import VisitorLogTable from './VisitorLogTable';

const VisitorLogs = ({ isEditing, setIsEditing }) => {
  return (
    <div className="visitor-logs">
      <VisitorLogTable isEditing={isEditing} setIsEditing={setIsEditing} />
    </div>
  );
};

export default VisitorLogs;
