import React from 'react';
import { FileText } from 'lucide-react';
import './EmptyState.css';

const EmptyState = ({ 
  icon: Icon = FileText, 
  title = 'No Data Found',
  message = 'No records match your current filters.',
  actionText,
  onAction 
}) => {
  return (
    <div className="empty-state">
      <Icon size={48} className="empty-state-icon" />
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-message">{message}</p>
      {actionText && onAction && (
        <button onClick={onAction} className="empty-state-action">
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;