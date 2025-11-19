import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { NodeStatus, NodeType, WorkflowNode as WorkflowNodeType } from '@/stores/workflowStore';
import { CheckCircle2, Circle, XCircle, Loader2, Database, Zap, Brain, CheckSquare, FileInput, FileOutput } from 'lucide-react';
import './WorkflowNode.css';

interface WorkflowNodeProps {
  data: {
    label: string;
    status: NodeStatus;
    node: WorkflowNodeType;
  };
}

const StatusIcon = ({ status }: { status: NodeStatus }) => {
  switch (status) {
    case 'running':
      return <Loader2 className="status-icon spinning" size={16} />;
    case 'completed':
      return <CheckCircle2 className="status-icon" size={16} />;
    case 'failed':
      return <XCircle className="status-icon" size={16} />;
    case 'pending':
    default:
      return <Circle className="status-icon" size={16} />;
  }
};

const TypeIcon = ({ type }: { type: NodeType }) => {
  switch (type) {
    case 'api':
      return <Zap className="type-icon" size={14} />;
    case 'transform':
      return <Database className="type-icon" size={14} />;
    case 'ml-model':
      return <Brain className="type-icon" size={14} />;
    case 'validator':
      return <CheckSquare className="type-icon" size={14} />;
    case 'source':
      return <FileInput className="type-icon" size={14} />;
    case 'sink':
      return <FileOutput className="type-icon" size={14} />;
    default:
      return <Database className="type-icon" size={14} />;
  }
};

export const WorkflowNode = memo(({ data }: WorkflowNodeProps) => {
  const { label, status, node } = data;

  return (
    <div className={`workflow-node workflow-node-${status} workflow-node-type-${node.type}`}>
      <Handle type="target" position={Position.Top} className="node-handle" />
      
      <div className="node-content">
        <div className="node-header">
          <TypeIcon type={node.type} />
          <div className="node-status">
            <StatusIcon status={status} />
          </div>
        </div>
        <div className="node-label">{label}</div>
        {node.config && (
          <div className="node-config">
            {Object.keys(node.config).slice(0, 1).map(key => (
              <span key={key} className="config-badge">{node.config![key]}</span>
            ))}
          </div>
        )}
      </div>
      
      <Handle type="source" position={Position.Bottom} className="node-handle" />
    </div>
  );
});

WorkflowNode.displayName = 'WorkflowNode';
