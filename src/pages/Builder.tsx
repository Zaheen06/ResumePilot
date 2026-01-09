import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useResume } from '@/contexts/ResumeContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Save, 
  Download, 
  Eye, 
  Edit, 
  Layout,
  Pencil
} from 'lucide-react';
import { ResumeContent, TemplateType, Resume } from '@/types/resume';
import { PersonalDetailsForm } from '@/components/builder/PersonalDetailsForm';
import { SummaryForm } from '@/components/builder/SummaryForm';
import { SkillsForm } from '@/components/builder/SkillsForm';
import { ExperienceForm } from '@/components/builder/ExperienceForm';
import { EducationForm } from '@/components/builder/EducationForm';
import { ProjectsForm } from '@/components/builder/ProjectsForm';
import { CertificationsForm } from '@/components/builder/CertificationsForm';
import { TemplateSelector } from '@/components/builder/TemplateSelector';
import { ResumePreview } from '@/components/preview/ResumePreview';
import { exportToPdf } from '@/lib/pdfExport';
import { Json } from '@/integrations/supabase/types';

const Builder = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentResume, setCurrentResume, updateContent, updateTemplate, saveCurrentResume } = useResume();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [title, setTitle] = useState('');
  const [activeTab, setActiveTab] = useState('personal');
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadResume = async () => {
      if (!id) {
        navigate('/dashboard');
        return;
      }

      if (currentResume?.id === id) {
        setTitle(currentResume.title);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('resumes')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        const resume: Resume = {
          id: data.id,
          user_id: data.user_id,
          title: data.title,
          template: data.template as TemplateType,
          content: data.content as unknown as ResumeContent,
          created_at: data.created_at,
          updated_at: data.updated_at,
        };

        setCurrentResume(resume);
        setTitle(resume.title);
      } catch (error) {
        console.error('Error loading resume:', error);
        toast.error('Failed to load resume');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadResume();
  }, [id, currentResume, setCurrentResume, navigate]);

  useEffect(() => {
    if (searchParams.get('download') === 'true' && currentResume && !loading) {
      handleExportPdf();
      navigate(`/builder/${id}`, { replace: true });
    }
  }, [searchParams, currentResume, loading]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updateData: Record<string, unknown> = {
        title,
        template: currentResume?.template,
        content: currentResume?.content as unknown as Json,
      };

      const { error } = await supabase
        .from('resumes')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      if (currentResume) {
        setCurrentResume({ ...currentResume, title });
      }
      toast.success('Resume saved successfully');
    } catch (error) {
      console.error('Error saving resume:', error);
      toast.error('Failed to save resume');
    } finally {
      setSaving(false);
    }
  };

  const handleExportPdf = async () => {
    if (!previewRef.current || !currentResume) return;
    
    setExporting(true);
    try {
      await exportToPdf(previewRef.current, title || 'resume');
      toast.success('PDF exported successfully');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('Failed to export PDF');
    } finally {
      setExporting(false);
    }
  };

  const handleTitleSave = () => {
    setEditingTitle(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!currentResume) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      {/* Builder Header */}
      <div className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            <div className="flex items-center gap-2">
              {editingTitle ? (
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={handleTitleSave}
                  onKeyDown={(e) => e.key === 'Enter' && handleTitleSave()}
                  className="h-8 w-64"
                  autoFocus
                />
              ) : (
                <button
                  onClick={() => setEditingTitle(true)}
                  className="flex items-center gap-2 hover:bg-secondary px-2 py-1 rounded"
                >
                  <span className="font-medium">{title}</span>
                  <Pencil className="w-3 h-3 text-muted-foreground" />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-secondary rounded-lg p-1">
              <Button
                variant={viewMode === 'edit' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('edit')}
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button
                variant={viewMode === 'preview' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('preview')}
              >
                <Eye className="w-4 h-4 mr-1" />
                Preview
              </Button>
            </div>
            
            <Button variant="outline" size="sm" onClick={handleSave} disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save'}
            </Button>
            
            <Button size="sm" onClick={handleExportPdf} disabled={exporting}>
              <Download className="w-4 h-4 mr-2" />
              {exporting ? 'Exporting...' : 'Export PDF'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Editor Section */}
          <div className={`space-y-6 ${viewMode === 'preview' ? 'hidden lg:block' : ''}`}>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 lg:grid-cols-8 w-full">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="certifications">Certs</TabsTrigger>
                <TabsTrigger value="template">
                  <Layout className="w-4 h-4" />
                </TabsTrigger>
              </TabsList>

              <div className="mt-6">
                <TabsContent value="personal">
                  <PersonalDetailsForm
                    data={currentResume.content.personalDetails}
                    onChange={(personalDetails) => updateContent({ personalDetails })}
                  />
                </TabsContent>
                <TabsContent value="summary">
                  <SummaryForm
                    data={currentResume.content.summary}
                    onChange={(summary) => updateContent({ summary })}
                    personalDetails={currentResume.content.personalDetails}
                  />
                </TabsContent>
                <TabsContent value="skills">
                  <SkillsForm
                    data={currentResume.content.skills}
                    onChange={(skills) => updateContent({ skills })}
                  />
                </TabsContent>
                <TabsContent value="experience">
                  <ExperienceForm
                    data={currentResume.content.experience}
                    onChange={(experience) => updateContent({ experience })}
                  />
                </TabsContent>
                <TabsContent value="education">
                  <EducationForm
                    data={currentResume.content.education}
                    onChange={(education) => updateContent({ education })}
                  />
                </TabsContent>
                <TabsContent value="projects">
                  <ProjectsForm
                    data={currentResume.content.projects}
                    onChange={(projects) => updateContent({ projects })}
                  />
                </TabsContent>
                <TabsContent value="certifications">
                  <CertificationsForm
                    data={currentResume.content.certifications}
                    onChange={(certifications) => updateContent({ certifications })}
                  />
                </TabsContent>
                <TabsContent value="template">
                  <TemplateSelector
                    selected={currentResume.template}
                    onChange={updateTemplate}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Preview Section */}
          <div className={`${viewMode === 'edit' ? 'hidden lg:block' : ''}`}>
            <div className="sticky top-24">
              <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
                <h3 className="text-sm font-medium text-muted-foreground mb-4">Preview</h3>
                <div className="bg-background border border-border rounded overflow-auto max-h-[calc(100vh-200px)]">
                  <div ref={previewRef}>
                    <ResumePreview
                      content={currentResume.content}
                      template={currentResume.template}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Builder;
