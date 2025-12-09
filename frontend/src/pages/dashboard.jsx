import React from 'react';
import { BarChart3, TrendingUp, Users, DollarSign } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import '../assets/styles/pages.css';

const Dashboard = () => {
  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Analytics Dashboard</h1>
          <p className="page-subtitle">Sales performance insights and metrics</p>
        </div>
        <div className="header-actions">
          <Button variant="primary">
            <BarChart3 size={16} />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <Card className="stat-card">
          <div className="stat-content">
            <div className="stat-icon revenue" style={{ background: 'rgba(34, 197, 94, 0.1)' }}>
              <DollarSign size={20} />
            </div>
            <div>
              <div className="stat-value">$124,580</div>
              <div className="stat-label">Total Revenue</div>
              <div className="stat-trend positive">+12.5%</div>
            </div>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-content">
            <div className="stat-icon orders" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
              <BarChart3 size={20} />
            </div>
            <div>
              <div className="stat-value">1,248</div>
              <div className="stat-label">Total Orders</div>
              <div className="stat-trend positive">+8.2%</div>
            </div>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-content">
            <div className="stat-icon customers" style={{ background: 'rgba(168, 85, 247, 0.1)' }}>
              <Users size={20} />
            </div>
            <div>
              <div className="stat-value">342</div>
              <div className="stat-label">Active Customers</div>
              <div className="stat-trend positive">+5.3%</div>
            </div>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-content">
            <div className="stat-icon growth" style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
              <TrendingUp size={20} />
            </div>
            <div>
              <div className="stat-value">24.8%</div>
              <div className="stat-label">Growth Rate</div>
              <div className="stat-trend positive">+3.1%</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Coming Soon Message */}
      <Card className="coming-soon-card">
        <div className="coming-soon-content">
          <BarChart3 size={48} className="coming-soon-icon" />
          <h3>Advanced Analytics Coming Soon</h3>
          <p>We're working on detailed charts, graphs, and insights for your sales data.</p>
          <div className="features-list">
            <div className="feature-item">📊 Sales Trends Analysis</div>
            <div className="feature-item">👥 Customer Segmentation</div>
            <div className="feature-item">🏪 Store Performance</div>
            <div className="feature-item">📈 Predictive Analytics</div>
          </div>
        </div>
      </Card>

      <div className="dashboard-footer">
        <p className="note">Note: This is a placeholder dashboard. Full analytics features will be implemented based on the assignment extension requirements.</p>
      </div>
    </div>
  );
};

export default Dashboard;