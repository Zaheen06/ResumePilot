import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, ChevronDown, ChevronUp, X } from 'lucide-react';
import { Project } from '@/types/resume';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface ProjectsFormProps {
  data: Project[];
  onChange: (data: Project[]) => void;
}

export const ProjectsForm: React.FC<ProjectsFormProps> = ({ data, onChange }) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [newTech, setNewTech] = useState<Record<string, string>>({});

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  const handleAdd = () => {
    const newProject: Project = {
      id: crypto.randomUUID(),
      name: '',
      description: '',
      technologies: [],
      link: '',
      highlights: [],
    };
    onChange([...data, newProject]);
    setExpandedIds(prev => new Set(prev).add(newProject.id));
  };

  const handleRemove = (id: string) => {
    onChange(data.filter(proj => proj.id !== id));
  };

  const handleUpdate = (id: string, updates: Partial<Project>) => {
    onChange(data.map(proj => (proj.id === id ? { ...proj, ...updates } : proj)));
  };

  const handleAddTech = (projectId: string) => {
    const techValue = newTech[projectId]?.trim();
    if (!techValue) return;

    onChange(
      data.map(project =>
        project.id === projectId
          ? { ...project, technologies: [...project.technologies, techValue] }
          : project
      )
    );
    setNewTech(prev => ({ ...prev, [projectId]: '' }));
  };

  const handleRemoveTech = (projectId: string, techIndex: number) => {
    onChange(
      data.map(project =>
        project.id === projectId
          ? { ...project, technologies: project.technologies.filter((_, i) => i !== techIndex) }
          : project
      )
    );
  };

  const handleHighlightsChange = (id: string, value: string) => {
    const lines = value.split('\n').filter(line => line.trim());
    handleUpdate(id, { highlights: lines });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Projects</CardTitle>
          <Button onClick={handleAdd} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No projects added yet. Click "Add Project" to get started.
          </p>
        ) : (
          data.map((project) => (
            <Collapsible
              key={project.id}
              open={expandedIds.has(project.id)}
              onOpenChange={() => toggleExpanded(project.id)}
            >
              <div className="border border-border rounded-lg">
                <CollapsibleTrigger asChild>
                  <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-secondary/50">
                    <div className="flex-1">
                      <p className="font-medium">{project.name || 'New Project'}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {project.description || 'No description'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove(project.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                      {expandedIds.has(project.id) ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <div className="p-4 pt-0 space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Project Name</Label>
                        <Input
                          value={project.name}
                          onChange={(e) => handleUpdate(project.id, { name: e.target.value })}
                          placeholder="E-commerce Platform"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Link (optional)</Label>
                        <Input
                          value={project.link || ''}
                          onChange={(e) => handleUpdate(project.id, { link: e.target.value })}
                          placeholder="https://github.com/user/project"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={project.description}
                        onChange={(e) => handleUpdate(project.id, { description: e.target.value })}
                        placeholder="Brief description of the project..."
                        rows={2}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Technologies</Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {project.technologies.map((tech, index) => (
                          <Badge key={index} variant="secondary" className="gap-1">
                            {tech}
                            <button
                              onClick={() => handleRemoveTech(project.id, index)}
                              className="ml-1 hover:text-destructive"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          value={newTech[project.id] || ''}
                          onChange={(e) => setNewTech(prev => ({ ...prev, [project.id]: e.target.value }))}
                          placeholder="Add technology..."
                          onKeyDown={(e) => e.key === 'Enter' && handleAddTech(project.id)}
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleAddTech(project.id)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Key Highlights</Label>
                      <Textarea
                        value={project.highlights.join('\n')}
                        onChange={(e) => handleHighlightsChange(project.id, e.target.value)}
                        placeholder="• Built a scalable backend...&#10;• Implemented user authentication..."
                        rows={4}
                      />
                    </div>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          ))
        )}
      </CardContent>
    </Card>
  );
};
