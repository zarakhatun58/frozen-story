import { X, Clock, Cpu, HardDrive, Terminal } from 'lucide-react';
import { useWorkflowStore } from '@/stores/workflowStore';
import './NodeDetailsPanel.css';

export const NodeDetailsPanel = () => {
  const { selectedNode, selectNode } = useWorkflowStore();

  if (!selectedNode) return null;

  return (
    <div className="node-details-panel">
      <div className="panel-header">
        <h3 className="panel-title">Node Details</h3>
        <button 
          onClick={() => selectNode(null)} 
          className="panel-close"
          aria-label="Close panel"
        >
          <X size={20} />
        </button>
      </div>

      <div className="panel-content">
        <div className="detail-section">
          <h4 className="detail-label">Name</h4>
          <p className="detail-value">{selectedNode.name}</p>
        </div>

        <div className="detail-section">
          <h4 className="detail-label">Type</h4>
          <p className="detail-value type-badge">{selectedNode.type}</p>
        </div>

        <div className="detail-section">
          <h4 className="detail-label">Status</h4>
          <p className={`detail-value status-badge status-${selectedNode.status}`}>
            {selectedNode.status}
          </p>
        </div>

        <div className="detail-section">
          <h4 className="detail-label">
            <Clock size={16} />
            Last Updated
          </h4>
          <p className="detail-value">
            {new Date(selectedNode.lastUpdated).toLocaleString()}
          </p>
        </div>

        {selectedNode.metrics && (
          <div className="metrics-section">
            <h4 className="section-title">Metrics</h4>
            <div className="metrics-grid">
              {selectedNode.metrics.duration && (
                <div className="metric-card">
                  <Clock size={18} />
                  <div className="metric-info">
                    <span className="metric-label">Duration</span>
                    <span className="metric-value">{selectedNode.metrics.duration}ms</span>
                  </div>
                </div>
              )}
              {selectedNode.metrics.cpu && (
                <div className="metric-card">
                  <Cpu size={18} />
                  <div className="metric-info">
                    <span className="metric-label">CPU</span>
                    <span className="metric-value">{selectedNode.metrics.cpu}%</span>
                  </div>
                </div>
              )}
              {selectedNode.metrics.memory && (
                <div className="metric-card">
                  <HardDrive size={18} />
                  <div className="metric-info">
                    <span className="metric-label">Memory</span>
                    <span className="metric-value">{selectedNode.metrics.memory}MB</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {selectedNode.logs && selectedNode.logs.length > 0 && (
          <div className="logs-section">
            <h4 className="section-title">
              <Terminal size={16} />
              Logs
            </h4>
            <div className="logs-container">
              {selectedNode.logs.map((log, index) => (
                <div key={index} className="log-entry">
                  <span className="log-timestamp">
                    {new Date().toLocaleTimeString()}
                  </span>
                  <span className="log-message">{log}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
