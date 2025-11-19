import { useEffect, useState } from 'react';
import { useWorkflowStore } from '@/stores/workflowStore';
import { Card } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Activity, CheckCircle2, XCircle, Clock } from 'lucide-react';
import './WorkflowAnalytics.css';

const WorkflowAnalytics = () => {
  const { nodes, metrics, addMetrics } = useWorkflowStore();
  const [performanceData, setPerformanceData] = useState<any[]>([]);

  useEffect(() => {
    // Collect metrics periodically
    const interval = setInterval(() => {
      const completedNodes = nodes.filter(n => n.status === 'completed').length;
      const failedNodes = nodes.filter(n => n.status === 'failed').length;
      const avgDuration = nodes
        .filter(n => n.metrics?.duration)
        .reduce((acc, n) => acc + (n.metrics?.duration || 0), 0) / nodes.length || 0;

      addMetrics({
        timestamp: new Date().toISOString(),
        totalNodes: nodes.length,
        completedNodes,
        failedNodes,
        avgDuration,
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [nodes, addMetrics]);

  useEffect(() => {
    // Transform metrics for charts
    const data = metrics.slice(-10).map((m, idx) => ({
      time: `T${idx + 1}`,
      completed: m.completedNodes,
      failed: m.failedNodes,
      duration: Math.round(m.avgDuration),
    }));
    setPerformanceData(data);
  }, [metrics]);

  const statusData = [
    { name: 'Completed', value: nodes.filter(n => n.status === 'completed').length, color: 'hsl(var(--status-completed))' },
    { name: 'Running', value: nodes.filter(n => n.status === 'running').length, color: 'hsl(var(--status-running))' },
    { name: 'Failed', value: nodes.filter(n => n.status === 'failed').length, color: 'hsl(var(--status-failed))' },
    { name: 'Pending', value: nodes.filter(n => n.status === 'pending').length, color: 'hsl(var(--status-pending))' },
  ];

  const nodeTypeData = [
    { type: 'API', count: nodes.filter(n => n.type === 'api').length },
    { type: 'Transform', count: nodes.filter(n => n.type === 'transform').length },
    { type: 'ML Model', count: nodes.filter(n => n.type === 'ml-model').length },
    { type: 'Validator', count: nodes.filter(n => n.type === 'validator').length },
    { type: 'Source', count: nodes.filter(n => n.type === 'source').length },
    { type: 'Sink', count: nodes.filter(n => n.type === 'sink').length },
  ];

  const completedCount = nodes.filter(n => n.status === 'completed').length;
  const failedCount = nodes.filter(n => n.status === 'failed').length;
  const runningCount = nodes.filter(n => n.status === 'running').length;
  const avgDuration = nodes
    .filter(n => n.metrics?.duration)
    .reduce((acc, n) => acc + (n.metrics?.duration || 0), 0) / nodes.length || 0;

  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <h1 className="page-title">Workflow Analytics</h1>
        <p className="page-description">Real-time performance metrics and insights</p>
      </div>

      <div className="metrics-grid">
        <Card className="metric-card">
          <div className="metric-icon completed">
            <CheckCircle2 size={24} />
          </div>
          <div className="metric-content">
            <div className="metric-value">{completedCount}</div>
            <div className="metric-label">Completed</div>
          </div>
        </Card>

        <Card className="metric-card">
          <div className="metric-icon running">
            <Activity size={24} />
          </div>
          <div className="metric-content">
            <div className="metric-value">{runningCount}</div>
            <div className="metric-label">Running</div>
          </div>
        </Card>

        <Card className="metric-card">
          <div className="metric-icon failed">
            <XCircle size={24} />
          </div>
          <div className="metric-content">
            <div className="metric-value">{failedCount}</div>
            <div className="metric-label">Failed</div>
          </div>
        </Card>

        <Card className="metric-card">
          <div className="metric-icon duration">
            <Clock size={24} />
          </div>
          <div className="metric-content">
            <div className="metric-value">{Math.round(avgDuration)}ms</div>
            <div className="metric-label">Avg Duration</div>
          </div>
        </Card>
      </div>

      <div className="charts-grid">
        <Card className="chart-card">
          <h3 className="chart-title">Performance Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="time" stroke="hsl(var(--foreground))" />
              <YAxis stroke="hsl(var(--foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="completed" stroke="hsl(var(--status-completed))" strokeWidth={2} />
              <Line type="monotone" dataKey="failed" stroke="hsl(var(--status-failed))" strokeWidth={2} />
              <Line type="monotone" dataKey="duration" stroke="hsl(var(--primary))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="chart-card">
          <h3 className="chart-title">Node Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => entry.name}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="chart-card full-width">
          <h3 className="chart-title">Node Types Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={nodeTypeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="type" stroke="hsl(var(--foreground))" />
              <YAxis stroke="hsl(var(--foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="count" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default WorkflowAnalytics;
