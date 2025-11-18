import { Activity, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { MetricsCard } from '@/components/admin/MetricsCard';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-description">Real-time overview of your automation workflows</p>
        </div>
      </div>

      <div className="metrics-grid">
        <MetricsCard
          title="Active Workflows"
          value={12}
          change={8.2}
          trend="up"
          icon={Activity}
        />
        <MetricsCard
          title="Completed Today"
          value={247}
          change={15.3}
          trend="up"
          icon={CheckCircle2}
        />
        <MetricsCard
          title="Failed Jobs"
          value={3}
          change={-25}
          trend="down"
          icon={AlertCircle}
        />
        <MetricsCard
          title="Avg. Duration"
          value="2.4s"
          change={-12}
          trend="down"
          icon={Clock}
        />
      </div>

      <div className="dashboard-content">
        <div className="content-card">
          <h2 className="card-title">Recent Activity</h2>
          <div className="activity-list">
            {[
              { id: 1, workflow: 'Data Validation Pipeline', status: 'completed', time: '2 minutes ago' },
              { id: 2, workflow: 'Customer Onboarding Flow', status: 'running', time: '5 minutes ago' },
              { id: 3, workflow: 'Report Generation', status: 'completed', time: '12 minutes ago' },
              { id: 4, workflow: 'Email Notification Service', status: 'failed', time: '18 minutes ago' },
              { id: 5, workflow: 'Data Backup Process', status: 'completed', time: '25 minutes ago' },
            ].map((item) => (
              <div key={item.id} className="activity-item">
                <div className="activity-info">
                  <span className="activity-name">{item.workflow}</span>
                  <span className="activity-time">{item.time}</span>
                </div>
                <span className={`activity-status status-${item.status}`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="content-card">
          <h2 className="card-title">System Health</h2>
          <div className="health-metrics">
            <div className="health-item">
              <span className="health-label">CPU Usage</span>
              <div className="health-bar">
                <div className="health-progress" style={{ width: '45%' }}></div>
              </div>
              <span className="health-value">45%</span>
            </div>
            <div className="health-item">
              <span className="health-label">Memory</span>
              <div className="health-bar">
                <div className="health-progress" style={{ width: '62%' }}></div>
              </div>
              <span className="health-value">62%</span>
            </div>
            <div className="health-item">
              <span className="health-label">Storage</span>
              <div className="health-bar">
                <div className="health-progress" style={{ width: '38%' }}></div>
              </div>
              <span className="health-value">38%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
