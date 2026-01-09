import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Education } from '@/types/resume';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface EducationFormProps {
  data: Education[];
  onChange: (data: Education[]) => void;
}

export const EducationForm: React.FC<EducationFormProps> = ({ data, onChange }) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

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
    const newEducation: Education = {
      id: crypto.randomUUID(),
      institution: '',
      degree: '',
      field: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: '',
    };
    onChange([...data, newEducation]);
    setExpandedIds(prev => new Set(prev).add(newEducation.id));
  };

  const handleRemove = (id: string) => {
    onChange(data.filter(edu => edu.id !== id));
  };

  const handleUpdate = (id: string, updates: Partial<Education>) => {
    onChange(data.map(edu => (edu.id === id ? { ...edu, ...updates } : edu)));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Education</CardTitle>
          <Button onClick={handleAdd} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Education
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No education added yet. Click "Add Education" to get started.
          </p>
        ) : (
          data.map((education) => (
            <Collapsible
              key={education.id}
              open={expandedIds.has(education.id)}
              onOpenChange={() => toggleExpanded(education.id)}
            >
              <div className="border border-border rounded-lg">
                <CollapsibleTrigger asChild>
                  <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-secondary/50">
                    <div className="flex-1">
                      <p className="font-medium">
                        {education.degree || 'New Degree'} 
                        {education.field && ` in ${education.field}`}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {education.institution || 'Institution'} • {education.startDate} - {education.endDate}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove(education.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                      {expandedIds.has(education.id) ? (
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
                        <Label>Institution</Label>
                        <Input
                          value={education.institution}
                          onChange={(e) => handleUpdate(education.id, { institution: e.target.value })}
                          placeholder="University of California"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Degree</Label>
                        <Input
                          value={education.degree}
                          onChange={(e) => handleUpdate(education.id, { degree: e.target.value })}
                          placeholder="Bachelor of Science"
                        />
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Field of Study</Label>
                        <Input
                          value={education.field}
                          onChange={(e) => handleUpdate(education.id, { field: e.target.value })}
                          placeholder="Computer Science"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Location</Label>
                        <Input
                          value={education.location}
                          onChange={(e) => handleUpdate(education.id, { location: e.target.value })}
                          placeholder="Berkeley, CA"
                        />
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Start Date</Label>
                        <Input
                          value={education.startDate}
                          onChange={(e) => handleUpdate(education.id, { startDate: e.target.value })}
                          placeholder="Aug 2016"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>End Date</Label>
                        <Input
                          value={education.endDate}
                          onChange={(e) => handleUpdate(education.id, { endDate: e.target.value })}
                          placeholder="May 2020"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>GPA (optional)</Label>
                        <Input
                          value={education.gpa || ''}
                          onChange={(e) => handleUpdate(education.id, { gpa: e.target.value })}
                          placeholder="3.8"
                        />
                      </div>
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
