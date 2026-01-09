import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { TEMPLATE_OPTIONS, TemplateType } from '@/types/resume';
import { Check } from 'lucide-react';

interface TemplateSelectorProps {
  selected: TemplateType;
  onChange: (template: TemplateType) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ selected, onChange }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Choose Template</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selected}
          onValueChange={(value) => onChange(value as TemplateType)}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {TEMPLATE_OPTIONS.map((template) => (
            <div key={template.value} className="relative">
              <RadioGroupItem
                value={template.value}
                id={template.value}
                className="peer sr-only"
              />
              <Label
                htmlFor={template.value}
                className="flex flex-col gap-3 p-4 border border-border rounded-lg cursor-pointer hover:border-primary/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 transition-all"
              >
                <div className="w-full h-24 bg-secondary rounded flex items-center justify-center">
                  <div className="w-16 h-20 bg-card border border-border rounded shadow-sm flex flex-col p-2">
                    <div className="h-1.5 w-3/4 bg-muted-foreground/30 rounded mb-1"></div>
                    <div className="h-1 w-1/2 bg-muted-foreground/20 rounded mb-2"></div>
                    <div className="space-y-0.5 flex-1">
                      <div className="h-0.5 w-full bg-muted-foreground/10 rounded"></div>
                      <div className="h-0.5 w-5/6 bg-muted-foreground/10 rounded"></div>
                      <div className="h-0.5 w-4/6 bg-muted-foreground/10 rounded"></div>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="font-medium text-foreground">{template.label}</p>
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                </div>
                {selected === template.value && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                )}
              </Label>
            </div>
          ))}
        </RadioGroup>
        
        <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
          <h4 className="font-medium text-foreground mb-2">ATS-Friendly Features</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>✓ Single-column layout for optimal parsing</li>
            <li>✓ Standard fonts (Inter, Arial, Times New Roman)</li>
            <li>✓ Proper heading hierarchy (H1, H2, H3)</li>
            <li>✓ No images, icons, or graphics</li>
            <li>✓ Print-friendly formatting</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
