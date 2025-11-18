import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Workflow, Shield, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import './Sidebar.css';

export const Sidebar = () => {
  const { user, logout, permissions } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <Workflow className="logo-icon" />
          <span className="logo-text">Perceive Now</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink
          to="/"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/workflow"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <Workflow size={20} />
          <span>Workflow Studio</span>
        </NavLink>

        {permissions.admin && (
          <NavLink
            to="/admin"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <Shield size={20} />
            <span>Admin Console</span>
          </NavLink>
        )}
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">{user?.name.charAt(0)}</div>
          <div className="user-details">
            <div className="user-name">{user?.name}</div>
            <div className="user-role">{user?.role}</div>
          </div>
        </div>
        <button onClick={logout} className="logout-button" title="Logout">
          <LogOut size={20} />
        </button>
      </div>
    </aside>
  );
};
