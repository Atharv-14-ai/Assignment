import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import '../styles/MainLayout.css';

const MainLayout = ({ 
  children, 
  title,
  searchValue, 
  onSearchChange, 
  onRefresh, 
  onExport, 
  loading, 
  exporting, 
  dataLength 
}) => {
  return (
    <div className="main-layout">
      <Sidebar />
      <div className="main-content">
        {title && <h1 className="dashboard-title">{title}</h1>} 
        
        <Header 
          searchValue={searchValue}
          onSearchChange={onSearchChange}
          onRefresh={onRefresh}
          onExport={onExport}
          loading={loading}
          exporting={exporting}
          dataLength={dataLength}
        />
        <main className="main-container">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;