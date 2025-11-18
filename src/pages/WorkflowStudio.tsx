import { useEffect, useState } from 'react';
import { WorkflowCanvas } from '@/components/workflow/WorkflowCanvas';
import { NodeDetailsPanel } from '@/components/workflow/NodeDetailsPanel';
import { useWorkflowStore } from '@/stores/workflowStore';
import { Play, Pause, RefreshCw } from 'lucide-react';
import './WorkflowStudio.css';

const WorkflowStudio = () => {
  const { selectedNode, updateNodeStatus, nodes } = useWorkflowStore();
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isSimulating) {
      interval = setInterval(() => {
        const pendingNodes = nodes.filter((n) => n.status === 'pending');
        const runningNodes = nodes.filter((n) => n.status === 'running');

        // Complete running nodes
        if (runningNodes.length > 0) {
          const randomNode = runningNodes[Math.floor(Math.random() * runningNodes.length)];
          updateNodeStatus(randomNode.id, Math.random() > 0.15 ? 'completed' : 'failed');
        }

        // Start pending nodes
        if (pendingNodes.length > 0 && runningNodes.length < 2) {
          const randomNode = pendingNodes[Math.floor(Math.random() * pendingNodes.length)];
          updateNodeStatus(randomNode.id, 'running');
        }
      }, 2000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSimulating, nodes, updateNodeStatus]);

  const handleReset = () => {
    setIsSimulating(false);
    nodes.forEach((node) => {
      updateNodeStatus(node.id, 'pending');
    });
  };

  return (
    <div className="workflow-studio-page">
      <div className="studio-header">
        <div>
          <h1 className="page-title">Workflow Studio</h1>
          <p className="page-description">Design and monitor distributed validation pipelines</p>
        </div>
        <div className="studio-actions">
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`action-button ${isSimulating ? 'active' : ''}`}
          >
            {isSimulating ? (
              <>
                <Pause size={18} />
                Pause Simulation
              </>
            ) : (
              <>
                <Play size={18} />
                Start Simulation
              </>
            )}
          </button>
          <button onClick={handleReset} className="action-button secondary">
            <RefreshCw size={18} />
            Reset
          </button>
        </div>
      </div>

      <div className="studio-content">
        <WorkflowCanvas />
        {selectedNode && <NodeDetailsPanel />}
      </div>
    </div>
  );
};

export default WorkflowStudio;
