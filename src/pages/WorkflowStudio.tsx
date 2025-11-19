import { useEffect, useState } from 'react';
import { WorkflowCanvas } from '@/components/workflow/WorkflowCanvas';
import { NodeDetailsPanel } from '@/components/workflow/NodeDetailsPanel';
import { TemplateLibrary } from '@/components/workflow/TemplateLibrary';
import { useWorkflowStore } from '@/stores/workflowStore';
import { Play, Pause, RefreshCw, Download, Upload, Radio, Layout } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import './WorkflowStudio.css';

const WorkflowStudio = () => {
  const { selectedNode, updateNodeStatus, nodes, exportWorkflow, importWorkflow, connectWebSocket, disconnectWebSocket, wsConnected } = useWorkflowStore();
  const [isSimulating, setIsSimulating] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const { toast } = useToast();

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

  const handleExport = () => {
    const json = exportWorkflow();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workflow-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: 'Workflow Exported',
      description: 'Your workflow has been exported successfully',
    });
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const json = event.target?.result as string;
          importWorkflow(json);
          toast({
            title: 'Workflow Imported',
            description: 'Your workflow has been imported successfully',
          });
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleToggleWebSocket = () => {
    if (wsConnected) {
      disconnectWebSocket();
      setIsSimulating(false);
      toast({
        title: 'Disconnected',
        description: 'WebSocket connection closed',
      });
    } else {
      connectWebSocket();
      toast({
        title: 'Connected',
        description: 'WebSocket connection established',
      });
    }
  };

  return (
    <div className="workflow-studio-page">
      <div className="studio-header">
        <div>
          <h1 className="page-title">Workflow Studio</h1>
          <p className="page-description">Design and monitor distributed validation pipelines</p>
        </div>
        <div className="studio-actions">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTemplates(true)}
          >
            <Layout size={18} />
            Templates
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleImport}
          >
            <Upload size={18} />
            Import
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
          >
            <Download size={18} />
            Export
          </Button>
          <Button
            variant={wsConnected ? 'default' : 'outline'}
            size="sm"
            onClick={handleToggleWebSocket}
          >
            <Radio size={18} />
            {wsConnected ? 'Connected' : 'Connect WS'}
          </Button>
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`action-button ${isSimulating ? 'active' : ''}`}
          >
            {isSimulating ? (
              <>
                <Pause size={18} />
                Pause
              </>
            ) : (
              <>
                <Play size={18} />
                Simulate
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

      <TemplateLibrary open={showTemplates} onClose={() => setShowTemplates(false)} />
    </div>
  );
};

export default WorkflowStudio;
