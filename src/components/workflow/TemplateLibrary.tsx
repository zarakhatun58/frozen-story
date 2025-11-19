import { useTemplatesStore } from '@/stores/templatesStore';
import { useWorkflowStore } from '@/stores/workflowStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { FileCode, Sparkles, Zap } from 'lucide-react';
import { useState } from 'react';
import './TemplateLibrary.css';

interface TemplateLibraryProps {
  open: boolean;
  onClose: () => void;
}

export const TemplateLibrary = ({ open, onClose }: TemplateLibraryProps) => {
  const { templates } = useTemplatesStore();
  const { importWorkflow } = useWorkflowStore();
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  const handleApplyTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      const workflowJson = JSON.stringify({
        version: '1.0',
        timestamp: new Date().toISOString(),
        nodes: template.nodes,
        edges: template.edges,
      });
      importWorkflow(workflowJson);
      onClose();
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'ETL':
        return <FileCode size={20} />;
      case 'Machine Learning':
        return <Sparkles size={20} />;
      case 'Integration':
        return <Zap size={20} />;
      default:
        return <FileCode size={20} />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="template-library-dialog">
        <DialogHeader>
          <DialogTitle>Workflow Templates</DialogTitle>
          <DialogDescription>
            Choose a pre-configured workflow template to get started quickly
          </DialogDescription>
        </DialogHeader>

        <div className="templates-grid">
          {templates.map((template) => (
            <Card
              key={template.id}
              className={`template-card ${selectedTemplateId === template.id ? 'selected' : ''}`}
              onClick={() => setSelectedTemplateId(template.id)}
            >
              <div className="template-icon">
                {getCategoryIcon(template.category)}
              </div>
              <div className="template-content">
                <h3 className="template-name">{template.name}</h3>
                <p className="template-description">{template.description}</p>
                <div className="template-meta">
                  <Badge variant="secondary">{template.category}</Badge>
                  <span className="template-nodes">{template.nodes.length} nodes</span>
                </div>
              </div>
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleApplyTemplate(template.id);
                }}
              >
                Use Template
              </Button>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
