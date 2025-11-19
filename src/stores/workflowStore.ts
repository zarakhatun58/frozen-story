import { create } from 'zustand';

export type NodeStatus = 'pending' | 'running' | 'completed' | 'failed';
export type NodeType = 'source' | 'processor' | 'validator' | 'sink' | 'api' | 'transform' | 'ml-model';

export interface WorkflowNode {
  id: string;
  name: string;
  type: NodeType;
  status: NodeStatus;
  lastUpdated: string;
  logs?: string[];
  metrics?: {
    duration?: number;
    cpu?: number;
    memory?: number;
  };
  config?: Record<string, any>;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
}

export interface WorkflowMetrics {
  timestamp: string;
  totalNodes: number;
  completedNodes: number;
  failedNodes: number;
  avgDuration: number;
}

interface WorkflowState {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  selectedNode: WorkflowNode | null;
  metrics: WorkflowMetrics[];
  wsConnected: boolean;
  updateNodeStatus: (nodeId: string, status: NodeStatus) => void;
  updateNode: (nodeId: string, updates: Partial<WorkflowNode>) => void;
  selectNode: (node: WorkflowNode | null) => void;
  initializeWorkflow: () => void;
  addNode: (node: WorkflowNode) => void;
  addEdge: (edge: WorkflowEdge) => void;
  removeNode: (nodeId: string) => void;
  exportWorkflow: () => string;
  importWorkflow: (json: string) => void;
  connectWebSocket: () => void;
  disconnectWebSocket: () => void;
  addMetrics: (metrics: WorkflowMetrics) => void;
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
    type: 'transform',
    status: 'pending',
    lastUpdated: new Date().toISOString(),
    config: { transformType: 'normalize' },
  },
  {
    id: '4',
    name: 'API Call',
    type: 'api',
    status: 'pending',
    lastUpdated: new Date().toISOString(),
    config: { endpoint: '/api/data', method: 'POST' },
  },
  {
    id: '5',
    name: 'ML Model',
    type: 'ml-model',
    status: 'pending',
    lastUpdated: new Date().toISOString(),
    config: { model: 'classification-v1' },
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
  { id: 'e3-4', source: '3', target: '4' },
  { id: 'e4-5', source: '4', target: '5' },
  { id: 'e5-6', source: '5', target: '6' },
  { id: 'e6-7', source: '6', target: '7' },
];

let ws: WebSocket | null = null;

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNode: null,
  metrics: [],
  wsConnected: false,
  
  updateNodeStatus: (nodeId, status) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId
          ? { ...node, status, lastUpdated: new Date().toISOString() }
          : node
      ),
    })),
  
  updateNode: (nodeId, updates) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId
          ? { ...node, ...updates, lastUpdated: new Date().toISOString() }
          : node
      ),
    })),
  
  selectNode: (node) => set({ selectedNode: node }),
  
  initializeWorkflow: () => set({ nodes: MOCK_NODES, edges: MOCK_EDGES }),
  
  addNode: (node) =>
    set((state) => ({
      nodes: [...state.nodes, node],
    })),
  
  addEdge: (edge) =>
    set((state) => ({
      edges: [...state.edges, edge],
    })),
  
  removeNode: (nodeId) =>
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== nodeId),
      edges: state.edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
    })),
  
  exportWorkflow: () => {
    const state = get();
    return JSON.stringify({
      version: '1.0',
      timestamp: new Date().toISOString(),
      nodes: state.nodes,
      edges: state.edges,
    }, null, 2);
  },
  
  importWorkflow: (json) => {
    try {
      const data = JSON.parse(json);
      if (data.nodes && data.edges) {
        set({ nodes: data.nodes, edges: data.edges });
      }
    } catch (error) {
      console.error('Failed to import workflow:', error);
    }
  },
  
  connectWebSocket: () => {
    console.log('Connecting to WebSocket...');
    set({ wsConnected: true });
    
    const interval = setInterval(() => {
      const state = get();
      const runningNodes = state.nodes.filter(n => n.status === 'running');
      const pendingNodes = state.nodes.filter(n => n.status === 'pending');
      
      if (runningNodes.length > 0) {
        const node = runningNodes[0];
        get().updateNodeStatus(node.id, Math.random() > 0.2 ? 'completed' : 'failed');
      } else if (pendingNodes.length > 0) {
        const node = pendingNodes[0];
        get().updateNodeStatus(node.id, 'running');
      }
    }, 3000);
    
    (ws as any) = { interval };
  },
  
  disconnectWebSocket: () => {
    if (ws && (ws as any).interval) {
      clearInterval((ws as any).interval);
    }
    ws = null;
    set({ wsConnected: false });
  },
  
  addMetrics: (metrics) =>
    set((state) => ({
      metrics: [...state.metrics.slice(-20), metrics],
    })),
}));
