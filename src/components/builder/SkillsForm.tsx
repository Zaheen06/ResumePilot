import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Trash2 } from 'lucide-react';
import { SkillCategory } from '@/types/resume';

interface SkillsFormProps {
  data: SkillCategory[];
  onChange: (data: SkillCategory[]) => void;
}

export const SkillsForm: React.FC<SkillsFormProps> = ({ data, onChange }) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSkills, setNewSkills] = useState<Record<string, string>>({});

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;

    const newCategory: SkillCategory = {
      id: crypto.randomUUID(),
      name: newCategoryName.trim(),
      skills: [],
    };

    onChange([...data, newCategory]);
    setNewCategoryName('');
  };

  const handleRemoveCategory = (categoryId: string) => {
    onChange(data.filter(c => c.id !== categoryId));
  };

  const handleAddSkill = (categoryId: string) => {
    const skillValue = newSkills[categoryId]?.trim();
    if (!skillValue) return;

    onChange(
      data.map(category =>
        category.id === categoryId
          ? { ...category, skills: [...category.skills, skillValue] }
          : category
      )
    );
    setNewSkills(prev => ({ ...prev, [categoryId]: '' }));
  };

  const handleRemoveSkill = (categoryId: string, skillIndex: number) => {
    onChange(
      data.map(category =>
        category.id === categoryId
          ? { ...category, skills: category.skills.filter((_, i) => i !== skillIndex) }
          : category
      )
    );
  };

  const handleCategoryNameChange = (categoryId: string, newName: string) => {
    onChange(
      data.map(category =>
        category.id === categoryId ? { ...category, name: newName } : category
      )
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {data.map((category) => (
          <div key={category.id} className="border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Input
                value={category.name}
                onChange={(e) => handleCategoryNameChange(category.id, e.target.value)}
                className="font-medium"
                placeholder="Category name"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveCategory(category.id)}
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-3">
              {category.skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="gap-1">
                  {skill}
                  <button
                    onClick={() => handleRemoveSkill(category.id, index)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Input
                value={newSkills[category.id] || ''}
                onChange={(e) => setNewSkills(prev => ({ ...prev, [category.id]: e.target.value }))}
                placeholder="Add a skill..."
                onKeyDown={(e) => e.key === 'Enter' && handleAddSkill(category.id)}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleAddSkill(category.id)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}

        <div className="flex gap-2">
          <Input
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="New category name (e.g., Programming Languages)"
            onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
          />
          <Button onClick={handleAddCategory}>
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
