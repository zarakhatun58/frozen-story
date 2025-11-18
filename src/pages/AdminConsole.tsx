import { useState, useEffect } from 'react';
import { MetricsCard } from '@/components/admin/MetricsCard';
import { PermissionGuard } from '@/components/admin/PermissionGuard';
import { Users, Server, Lock, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import './AdminConsole.css';

interface SystemMetrics {
  activeUsers: number;
  serverLoad: number;
  requestsPerMin: number;
  uptime: string;
}

const AdminConsole = () => {
  const { user, permissions } = useAuth();
  const [metrics, setMetrics] = useState<SystemMetrics>({
    activeUsers: 24,
    serverLoad: 45,
    requestsPerMin: 1247,
    uptime: '99.9%',
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        ...prev,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 3) - 1,
        serverLoad: Math.max(20, Math.min(80, prev.serverLoad + Math.floor(Math.random() * 10) - 5)),
        requestsPerMin: prev.requestsPerMin + Math.floor(Math.random() * 100) - 50,
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="admin-console-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Console</h1>
          <p className="page-description">
            Manage workflows, agents, policies, and access control
          </p>
        </div>
        <div className="user-badge">
          <span className="badge-label">Logged in as:</span>
          <span className="badge-role">{user?.role}</span>
        </div>
      </div>

      <div className="metrics-grid">
        <MetricsCard
          title="Active Users"
          value={metrics.activeUsers}
          icon={Users}
        />
        <MetricsCard
          title="Server Load"
          value={`${metrics.serverLoad}%`}
          icon={Server}
        />
        <MetricsCard
          title="Requests/min"
          value={metrics.requestsPerMin.toLocaleString()}
          icon={TrendingUp}
        />
        <MetricsCard
          title="Uptime"
          value={metrics.uptime}
          icon={Lock}
        />
      </div>

      <div className="admin-sections">
        <PermissionGuard requires="view">
          <div className="admin-section">
            <h2 className="section-title">System Overview</h2>
            <div className="section-content">
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Database Status</span>
                  <span className="info-value status-healthy">Healthy</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Cache Status</span>
                  <span className="info-value status-healthy">Healthy</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Queue Status</span>
                  <span className="info-value status-healthy">Healthy</span>
                </div>
                <div className="info-item">
                  <span className="info-label">API Status</span>
                  <span className="info-value status-healthy">Healthy</span>
                </div>
              </div>
            </div>
          </div>
        </PermissionGuard>

        <PermissionGuard requires="edit">
          <div className="admin-section">
            <h2 className="section-title">Workflow Management</h2>
            <div className="section-content">
              <div className="action-grid">
                <button className="action-card">
                  <span className="action-title">Create Workflow</span>
                  <span className="action-description">Design a new automation pipeline</span>
                </button>
                <button className="action-card">
                  <span className="action-title">Manage Agents</span>
                  <span className="action-description">Configure agent behavior and policies</span>
                </button>
                <button className="action-card">
                  <span className="action-title">View Logs</span>
                  <span className="action-description">Access system and workflow logs</span>
                </button>
                <PermissionGuard requires="admin">
                  <button className="action-card admin-only">
                    <span className="action-title">System Settings</span>
                    <span className="action-description">Configure advanced system options</span>
                  </button>
                </PermissionGuard>
              </div>
            </div>
          </div>
        </PermissionGuard>

        <PermissionGuard
          requires="admin"
          fallback={
            <div className="permission-notice">
              <Lock size={24} />
              <p>Admin access required to view additional sections</p>
            </div>
          }
        >
          <div className="admin-section">
            <h2 className="section-title">Access Control</h2>
            <div className="section-content">
              <div className="permissions-info">
                <h3>Current Permissions:</h3>
                <ul className="permissions-list">
                  <li className={permissions.view ? 'enabled' : 'disabled'}>
                    View: {permissions.view ? 'Enabled' : 'Disabled'}
                  </li>
                  <li className={permissions.edit ? 'enabled' : 'disabled'}>
                    Edit: {permissions.edit ? 'Enabled' : 'Disabled'}
                  </li>
                  <li className={permissions.delete ? 'enabled' : 'disabled'}>
                    Delete: {permissions.delete ? 'Enabled' : 'Disabled'}
                  </li>
                  <li className={permissions.admin ? 'enabled' : 'disabled'}>
                    Admin: {permissions.admin ? 'Enabled' : 'Disabled'}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </PermissionGuard>
      </div>
    </div>
  );
};

export default AdminConsole;
