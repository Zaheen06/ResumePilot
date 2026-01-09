import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Sparkles, RefreshCw } from 'lucide-react';
import { PersonalDetails } from '@/types/resume';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SummaryFormProps {
  data: string;
  onChange: (data: string) => void;
  personalDetails: PersonalDetails;
}

export const SummaryForm: React.FC<SummaryFormProps> = ({ data, onChange, personalDetails }) => {
  const [generating, setGenerating] = useState(false);
  const [improving, setImproving] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const { data: result, error } = await supabase.functions.invoke('generate-resume-content', {
        body: {
          type: 'summary',
          context: {
            name: personalDetails.fullName,
            currentContent: data,
          },
        },
      });

      if (error) throw error;
      
      if (result?.content) {
        onChange(result.content);
        toast.success('Summary generated successfully');
      }
    } catch (error) {
      console.error('Error generating summary:', error);
      toast.error('Failed to generate summary. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleImprove = async () => {
    if (!data.trim()) {
      toast.error('Please write some content first');
      return;
    }

    setImproving(true);
    try {
      const { data: result, error } = await supabase.functions.invoke('generate-resume-content', {
        body: {
          type: 'improve',
          context: {
            section: 'summary',
            currentContent: data,
          },
        },
      });

      if (error) throw error;
      
      if (result?.content) {
        onChange(result.content);
        toast.success('Summary improved successfully');
      }
    } catch (error) {
      console.error('Error improving summary:', error);
      toast.error('Failed to improve summary. Please try again.');
    } finally {
      setImproving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Professional Summary</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerate}
              disabled={generating || improving}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {generating ? 'Generating...' : 'AI Generate'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleImprove}
              disabled={generating || improving || !data.trim()}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              {improving ? 'Improving...' : 'AI Improve'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Textarea
          value={data}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Write a compelling professional summary that highlights your key achievements and career goals..."
          rows={6}
        />
        <p className="text-sm text-muted-foreground mt-2">
          A strong summary should be 2-4 sentences highlighting your experience, key skills, and career goals.
        </p>
      </CardContent>
    </Card>
  );
};
