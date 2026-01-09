import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Certification } from '@/types/resume';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface CertificationsFormProps {
  data: Certification[];
  onChange: (data: Certification[]) => void;
}

export const CertificationsForm: React.FC<CertificationsFormProps> = ({ data, onChange }) => {
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
    const newCert: Certification = {
      id: crypto.randomUUID(),
      name: '',
      issuer: '',
      date: '',
      expiryDate: '',
      credentialId: '',
    };
    onChange([...data, newCert]);
    setExpandedIds(prev => new Set(prev).add(newCert.id));
  };

  const handleRemove = (id: string) => {
    onChange(data.filter(cert => cert.id !== id));
  };

  const handleUpdate = (id: string, updates: Partial<Certification>) => {
    onChange(data.map(cert => (cert.id === id ? { ...cert, ...updates } : cert)));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Certifications</CardTitle>
          <Button onClick={handleAdd} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Certification
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No certifications added yet. Click "Add Certification" to get started.
          </p>
        ) : (
          data.map((cert) => (
            <Collapsible
              key={cert.id}
              open={expandedIds.has(cert.id)}
              onOpenChange={() => toggleExpanded(cert.id)}
            >
              <div className="border border-border rounded-lg">
                <CollapsibleTrigger asChild>
                  <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-secondary/50">
                    <div className="flex-1">
                      <p className="font-medium">{cert.name || 'New Certification'}</p>
                      <p className="text-sm text-muted-foreground">
                        {cert.issuer || 'Issuer'} • {cert.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove(cert.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                      {expandedIds.has(cert.id) ? (
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
                        <Label>Certification Name</Label>
                        <Input
                          value={cert.name}
                          onChange={(e) => handleUpdate(cert.id, { name: e.target.value })}
                          placeholder="AWS Solutions Architect"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Issuing Organization</Label>
                        <Input
                          value={cert.issuer}
                          onChange={(e) => handleUpdate(cert.id, { issuer: e.target.value })}
                          placeholder="Amazon Web Services"
                        />
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Issue Date</Label>
                        <Input
                          value={cert.date}
                          onChange={(e) => handleUpdate(cert.id, { date: e.target.value })}
                          placeholder="Jan 2023"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Expiry Date (optional)</Label>
                        <Input
                          value={cert.expiryDate || ''}
                          onChange={(e) => handleUpdate(cert.id, { expiryDate: e.target.value })}
                          placeholder="Jan 2026"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Credential ID (optional)</Label>
                        <Input
                          value={cert.credentialId || ''}
                          onChange={(e) => handleUpdate(cert.id, { credentialId: e.target.value })}
                          placeholder="ABC123XYZ"
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
