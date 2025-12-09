import React, { useState } from 'react';
import {
  FileText as InvoiceIcon,
  LayoutDashboard as DashboardIcon,
  Users as NexusIcon,
  PlayCircle as IntakeIcon,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  FileText as ProformaIcon,
  FileText as FinalIcon,
  PlayCircle as PreActiveIcon,
  Monitor as ActiveIcon,
  XCircle as BlockedIcon,
  CheckCircle as ClosedIcon
} from 'lucide-react';
import '../styles/Sidebar.css';

const iconMap = {
  'Dashboard': DashboardIcon,
  'Nexus': NexusIcon,
  'Intake': IntakeIcon,
  'Services': InvoiceIcon,
  'Invoices': InvoiceIcon,
  'PreActive': PreActiveIcon,
  'Active': ActiveIcon,
  'Blocked': BlockedIcon,
  'Closed': ClosedIcon,
  'ProformaInvoices': ProformaIcon,
  'FinalInvoices': FinalIcon,
};

const sidebarItems = [
  { label: 'Dashboard', icon: 'Dashboard', type: 'single' },
  { label: 'Nexus', icon: 'Nexus', type: 'single' },
  { label: 'Intake', icon: 'Intake', type: 'single' },
  {
    label: 'Services',
    icon: 'Services',
    type: 'group',
    children: [
      { label: 'Pre-active', icon: 'PreActive' },
      { label: 'Active', icon: 'Active' },
      { label: 'Blocked', icon: 'Blocked' },
      { label: 'Closed', icon: 'Closed' },
    ],
    isOpen: true,
  },
  {
    label: 'Invoices',
    icon: 'Invoices',
    type: 'group',
    children: [
      { label: 'Proforma Invoices', icon: 'ProformaInvoices', bold: true },
      { label: 'Final Invoices', icon: 'FinalInvoices' },
    ],
    isOpen: true,
  },
];

const Sidebar = () => {
  const [menuState, setMenuState] = useState(
    sidebarItems.map(item => item.isOpen)
  );

  const toggleGroup = (index) => {
    setMenuState(prev => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
  };

  const renderSingleItem = (item, index) => {
    const IconComponent = iconMap[item.icon];
    return (
      <div key={index} className="sidebar-menu-item">
        {IconComponent && <IconComponent size={18} />}
        <span>{item.label}</span>
      </div>
    );
  };

  const renderGroupItem = (item, index) => {
    const IconComponent = iconMap[item.icon];
    const isOpen = menuState[index];
    const ToggleIcon = isOpen ? ChevronUp : ChevronDown;

    return (
      <div key={index} className="sidebar-group">
        <div className="sidebar-group-header" onClick={() => toggleGroup(index)}>
          <div className="sidebar-menu-item-content">
            {IconComponent && <IconComponent size={18} />}
            <span>{item.label}</span>
          </div>
          <ToggleIcon size={16} />
        </div>
        {isOpen && (
          <div className="sidebar-group-children">
            {item.children.map((child, childIndex) => {
              const ChildIcon = iconMap[child.icon];
              return (
                <div key={childIndex} className="sidebar-child-item">
                  {ChildIcon && <ChildIcon size={18} />}
                  <span className={child.bold ? 'bold-text' : ''}>{child.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="sidebar">
      <div className="sidebar-vault-header">
        <div className="vault-logo-container">
          <div className="vault-logo">V</div> 
          <div className="vault-info">
            <span className="vault-name">Vault</span>
            <span className="user-name">Shital Patil</span>
          </div>
        </div>
        <ChevronDown size={18} />
      </div>

      <nav className="sidebar-nav">
        {sidebarItems.map((item, index) => {
          if (item.type === 'single') {
            return renderSingleItem(item, index);
          } else if (item.type === 'group') {
            return renderGroupItem(item, index);
          }
          return null;
        })}
      </nav>
    </div>
  );
};

export default Sidebar;