import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { NodeStatus, WorkflowNode as WorkflowNodeType } from '@/stores/workflowStore';
import { CheckCircle2, Circle, XCircle, Loader2 } from 'lucide-react';
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

export const WorkflowNode = memo(({ data }: WorkflowNodeProps) => {
  const { label, status } = data;

  return (
    <div className={`workflow-node workflow-node-${status}`}>
      <Handle type="target" position={Position.Top} className="node-handle" />
      
      <div className="node-content">
        <div className="node-status">
          <StatusIcon status={status} />
        </div>
        <div className="node-label">{label}</div>
      </div>
      
      <Handle type="source" position={Position.Bottom} className="node-handle" />
    </div>
  );
});

WorkflowNode.displayName = 'WorkflowNode';
