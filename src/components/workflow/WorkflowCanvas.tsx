import { useCallback, useEffect, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useWorkflowStore, NodeStatus } from '@/stores/workflowStore';
import { WorkflowNode } from './WorkflowNode';
import './WorkflowCanvas.css';

const nodeTypes = {
  custom: WorkflowNode,
};

const getNodeColor = (status: NodeStatus) => {
  switch (status) {
    case 'running':
      return 'hsl(var(--status-running))';
    case 'completed':
      return 'hsl(var(--status-completed))';
    case 'failed':
      return 'hsl(var(--status-failed))';
    case 'pending':
    default:
      return 'hsl(var(--status-pending))';
  }
};

export const WorkflowCanvas = () => {
  const { nodes: storeNodes, edges: storeEdges, initializeWorkflow, selectNode } = useWorkflowStore();
  
  const initialNodes: Node[] = useMemo(() => {
    return storeNodes.map((node, index) => ({
      id: node.id,
      type: 'custom',
      position: { x: 250 + (index % 3) * 300, y: 100 + Math.floor(index / 3) * 150 },
      data: { 
        label: node.name, 
        status: node.status,
        node: node,
      },
    }));
  }, [storeNodes]);

  const initialEdges = useMemo(() => {
    return storeEdges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      animated: true,
      style: { stroke: 'hsl(var(--border))' },
    }));
  }, [storeEdges]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    initializeWorkflow();
  }, [initializeWorkflow]);

  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [storeNodes, storeEdges, setNodes, setEdges, initialNodes, initialEdges]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const workflowNode = storeNodes.find((n) => n.id === node.id);
      if (workflowNode) {
        selectNode(workflowNode);
      }
    },
    [storeNodes, selectNode]
  );

  return (
    <div className="workflow-canvas">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.5}
        maxZoom={1.5}
      >
        <Background />
        <Controls />
        <MiniMap
          nodeColor={(node: Node) => {
            const status = node.data.status as NodeStatus;
            return getNodeColor(status);
          }}
          style={{
            backgroundColor: 'hsl(var(--card))',
          }}
        />
      </ReactFlow>
    </div>
  );
};
