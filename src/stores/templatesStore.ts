import { create } from 'zustand';
import { WorkflowNode, WorkflowEdge } from './workflowStore';

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  thumbnail?: string;
}

interface TemplatesState {
  templates: WorkflowTemplate[];
  selectedTemplate: WorkflowTemplate | null;
  selectTemplate: (template: WorkflowTemplate | null) => void;
}

const TEMPLATES: WorkflowTemplate[] = [
  {
    id: 'data-pipeline',
    name: 'Data Processing Pipeline',
    description: 'Standard ETL workflow for data processing',
    category: 'ETL',
    nodes: [
      {
        id: 't1-1',
        name: 'Data Source',
        type: 'source',
        status: 'pending',
        lastUpdated: new Date().toISOString(),
      },
      {
        id: 't1-2',
        name: 'Transform',
        type: 'transform',
        status: 'pending',
        lastUpdated: new Date().toISOString(),
      },
      {
        id: 't1-3',
        name: 'Validate',
        type: 'validator',
        status: 'pending',
        lastUpdated: new Date().toISOString(),
      },
      {
        id: 't1-4',
        name: 'Export',
        type: 'sink',
        status: 'pending',
        lastUpdated: new Date().toISOString(),
      },
    ],
    edges: [
      { id: 't1-e1', source: 't1-1', target: 't1-2' },
      { id: 't1-e2', source: 't1-2', target: 't1-3' },
      { id: 't1-e3', source: 't1-3', target: 't1-4' },
    ],
  },
  {
    id: 'ml-inference',
    name: 'ML Inference Pipeline',
    description: 'Machine learning model inference workflow',
    category: 'Machine Learning',
    nodes: [
      {
        id: 't2-1',
        name: 'Input Data',
        type: 'source',
        status: 'pending',
        lastUpdated: new Date().toISOString(),
      },
      {
        id: 't2-2',
        name: 'Preprocessing',
        type: 'transform',
        status: 'pending',
        lastUpdated: new Date().toISOString(),
      },
      {
        id: 't2-3',
        name: 'ML Model',
        type: 'ml-model',
        status: 'pending',
        lastUpdated: new Date().toISOString(),
        config: { model: 'inference-model-v1' },
      },
      {
        id: 't2-4',
        name: 'Post-process',
        type: 'transform',
        status: 'pending',
        lastUpdated: new Date().toISOString(),
      },
      {
        id: 't2-5',
        name: 'Results',
        type: 'sink',
        status: 'pending',
        lastUpdated: new Date().toISOString(),
      },
    ],
    edges: [
      { id: 't2-e1', source: 't2-1', target: 't2-2' },
      { id: 't2-e2', source: 't2-2', target: 't2-3' },
      { id: 't2-e3', source: 't2-3', target: 't2-4' },
      { id: 't2-e4', source: 't2-4', target: 't2-5' },
    ],
  },
  {
    id: 'api-integration',
    name: 'API Integration Flow',
    description: 'Workflow for API data integration and transformation',
    category: 'Integration',
    nodes: [
      {
        id: 't3-1',
        name: 'API Request',
        type: 'api',
        status: 'pending',
        lastUpdated: new Date().toISOString(),
        config: { endpoint: '/api/fetch', method: 'GET' },
      },
      {
        id: 't3-2',
        name: 'Parse Response',
        type: 'transform',
        status: 'pending',
        lastUpdated: new Date().toISOString(),
      },
      {
        id: 't3-3',
        name: 'Validate Data',
        type: 'validator',
        status: 'pending',
        lastUpdated: new Date().toISOString(),
      },
      {
        id: 't3-4',
        name: 'Store Results',
        type: 'sink',
        status: 'pending',
        lastUpdated: new Date().toISOString(),
      },
    ],
    edges: [
      { id: 't3-e1', source: 't3-1', target: 't3-2' },
      { id: 't3-e2', source: 't3-2', target: 't3-3' },
      { id: 't3-e3', source: 't3-3', target: 't3-4' },
    ],
  },
];

export const useTemplatesStore = create<TemplatesState>((set) => ({
  templates: TEMPLATES,
  selectedTemplate: null,
  selectTemplate: (template) => set({ selectedTemplate: template }),
}));
