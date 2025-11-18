import { create } from 'zustand';

export type NodeStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface WorkflowNode {
  id: string;
  name: string;
  type: string;
  status: NodeStatus;
  lastUpdated: string;
  logs?: string[];
  metrics?: {
    duration?: number;
    cpu?: number;
    memory?: number;
  };
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
}

interface WorkflowState {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  selectedNode: WorkflowNode | null;
  updateNodeStatus: (nodeId: string, status: NodeStatus) => void;
  selectNode: (node: WorkflowNode | null) => void;
  initializeWorkflow: () => void;
}

const MOCK_NODES: WorkflowNode[] = [
  {
    id: '1',
    name: 'Data Ingestion',
    type: 'source',
    status: 'completed',
    lastUpdated: new Date().toISOString(),
    logs: ['Started data ingestion', 'Connected to source', 'Data fetched successfully'],
    metrics: { duration: 2300, cpu: 45, memory: 512 },
  },
  {
    id: '2',
    name: 'Data Validation',
    type: 'processor',
    status: 'running',
    lastUpdated: new Date().toISOString(),
    logs: ['Validating schema', 'Running quality checks'],
    metrics: { cpu: 67, memory: 768 },
  },
  {
    id: '3',
    name: 'Transform A',
    type: 'processor',
    status: 'pending',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Transform B',
    type: 'processor',
    status: 'pending',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Data Merge',
    type: 'processor',
    status: 'pending',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Quality Check',
    type: 'validator',
    status: 'pending',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '7',
    name: 'Data Export',
    type: 'sink',
    status: 'pending',
    lastUpdated: new Date().toISOString(),
  },
];

const MOCK_EDGES: WorkflowEdge[] = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
  { id: 'e2-4', source: '2', target: '4' },
  { id: 'e3-5', source: '3', target: '5' },
  { id: 'e4-5', source: '4', target: '5' },
  { id: 'e5-6', source: '5', target: '6' },
  { id: 'e6-7', source: '6', target: '7' },
];

export const useWorkflowStore = create<WorkflowState>((set) => ({
  nodes: [],
  edges: [],
  selectedNode: null,
  updateNodeStatus: (nodeId, status) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId
          ? { ...node, status, lastUpdated: new Date().toISOString() }
          : node
      ),
    })),
  selectNode: (node) => set({ selectedNode: node }),
  initializeWorkflow: () => set({ nodes: MOCK_NODES, edges: MOCK_EDGES }),
}));
