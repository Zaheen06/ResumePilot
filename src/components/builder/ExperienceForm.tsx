import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { Experience } from '@/types/resume';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface ExperienceFormProps {
  data: Experience[];
  onChange: (data: Experience[]) => void;
}

export const ExperienceForm: React.FC<ExperienceFormProps> = ({ data, onChange }) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [generatingId, setGeneratingId] = useState<string | null>(null);

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
    const newExperience: Experience = {
      id: crypto.randomUUID(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: [],
    };
    onChange([...data, newExperience]);
    setExpandedIds(prev => new Set(prev).add(newExperience.id));
  };

  const handleRemove = (id: string) => {
    onChange(data.filter(exp => exp.id !== id));
  };

  const handleUpdate = (id: string, updates: Partial<Experience>) => {
    onChange(data.map(exp => (exp.id === id ? { ...exp, ...updates } : exp)));
  };

  const handleDescriptionChange = (id: string, value: string) => {
    const lines = value.split('\n').filter(line => line.trim());
    handleUpdate(id, { description: lines });
  };

  const handleGenerateBullets = async (experience: Experience) => {
    if (!experience.position || !experience.company) {
      toast.error('Please enter position and company first');
      return;
    }

    setGeneratingId(experience.id);
    try {
      const { data: result, error } = await supabase.functions.invoke('generate-resume-content', {
        body: {
          type: 'experience',
          context: {
            position: experience.position,
            company: experience.company,
            currentBullets: experience.description,
          },
        },
      });

      if (error) throw error;
      
      if (result?.content) {
        const bullets = result.content.split('\n').filter((line: string) => line.trim());
        handleUpdate(experience.id, { description: bullets });
        toast.success('Bullet points generated successfully');
      }
    } catch (error) {
      console.error('Error generating bullets:', error);
      toast.error('Failed to generate bullet points. Please try again.');
    } finally {
      setGeneratingId(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Work Experience</CardTitle>
          <Button onClick={handleAdd} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Experience
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No work experience added yet. Click "Add Experience" to get started.
          </p>
        ) : (
          data.map((experience) => (
            <Collapsible
              key={experience.id}
              open={expandedIds.has(experience.id)}
              onOpenChange={() => toggleExpanded(experience.id)}
            >
              <div className="border border-border rounded-lg">
                <CollapsibleTrigger asChild>
                  <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-secondary/50">
                    <div className="flex-1">
                      <p className="font-medium">
                        {experience.position || 'New Position'} 
                        {experience.company && ` at ${experience.company}`}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {experience.startDate} - {experience.current ? 'Present' : experience.endDate}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove(experience.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                      {expandedIds.has(experience.id) ? (
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
                        <Label>Position</Label>
                        <Input
                          value={experience.position}
                          onChange={(e) => handleUpdate(experience.id, { position: e.target.value })}
                          placeholder="Software Engineer"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Company</Label>
                        <Input
                          value={experience.company}
                          onChange={(e) => handleUpdate(experience.id, { company: e.target.value })}
                          placeholder="Tech Company Inc."
                        />
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Location</Label>
                        <Input
                          value={experience.location}
                          onChange={(e) => handleUpdate(experience.id, { location: e.target.value })}
                          placeholder="San Francisco, CA"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Start Date</Label>
                        <Input
                          value={experience.startDate}
                          onChange={(e) => handleUpdate(experience.id, { startDate: e.target.value })}
                          placeholder="Jan 2020"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>End Date</Label>
                        <Input
                          value={experience.endDate}
                          onChange={(e) => handleUpdate(experience.id, { endDate: e.target.value })}
                          placeholder="Dec 2023"
                          disabled={experience.current}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`current-${experience.id}`}
                        checked={experience.current}
                        onCheckedChange={(checked) =>
                          handleUpdate(experience.id, { current: checked as boolean })
                        }
                      />
                      <Label htmlFor={`current-${experience.id}`}>I currently work here</Label>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Responsibilities & Achievements</Label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleGenerateBullets(experience)}
                          disabled={generatingId === experience.id}
                        >
                          <Sparkles className="w-4 h-4 mr-2" />
                          {generatingId === experience.id ? 'Generating...' : 'AI Generate'}
                        </Button>
                      </div>
                      <Textarea
                        value={experience.description.join('\n')}
                        onChange={(e) => handleDescriptionChange(experience.id, e.target.value)}
                        placeholder="• Led development of new features...&#10;• Improved performance by 50%...&#10;• Collaborated with cross-functional teams..."
                        rows={6}
                      />
                      <p className="text-sm text-muted-foreground">
                        Enter each bullet point on a new line. Start with action verbs.
                      </p>
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
