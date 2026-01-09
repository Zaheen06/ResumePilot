import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useResume } from '@/contexts/ResumeContext';
import { Plus, FileText, Edit, Copy, Trash2, Download, MoreVertical } from 'lucide-react';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { TEMPLATE_OPTIONS } from '@/types/resume';

const Dashboard = () => {
  const navigate = useNavigate();
  const { resumes, loading, fetchResumes, createResume, deleteResume, duplicateResume, setCurrentResume } = useResume();

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  const handleCreateResume = async () => {
    const newResume = await createResume();
    if (newResume) {
      setCurrentResume(newResume);
      navigate(`/builder/${newResume.id}`);
    }
  };

  const handleEditResume = (resume: typeof resumes[0]) => {
    setCurrentResume(resume);
    navigate(`/builder/${resume.id}`);
  };

  const handleDuplicateResume = async (id: string) => {
    await duplicateResume(id);
  };

  const handleDeleteResume = async (id: string) => {
    await deleteResume(id);
  };

  const handleDownloadPdf = (resume: typeof resumes[0]) => {
    setCurrentResume(resume);
    navigate(`/builder/${resume.id}?download=true`);
  };

  const getTemplateLabel = (template: string) => {
    return TEMPLATE_OPTIONS.find(t => t.value === template)?.label || template;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Resumes</h1>
            <p className="text-muted-foreground mt-1">
              Create and manage your professional resumes
            </p>
          </div>
          <Button onClick={handleCreateResume} className="gap-2">
            <Plus className="w-4 h-4" />
            Create New Resume
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : resumes.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No resumes yet</h3>
              <p className="text-muted-foreground text-center mb-6 max-w-sm">
                Create your first resume and start building your professional profile.
              </p>
              <Button onClick={handleCreateResume} className="gap-2">
                <Plus className="w-4 h-4" />
                Create Your First Resume
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <Card key={resume.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-semibold line-clamp-1">
                      {resume.title}
                    </CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditResume(resume)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicateResume(resume.id)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownloadPdf(resume)}>
                          <Download className="mr-2 h-4 w-4" />
                          Download PDF
                        </DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Resume</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{resume.title}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteResume(resume.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="w-full h-32 bg-secondary rounded-md flex items-center justify-center mb-3">
                    <FileText className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Template: {getTemplateLabel(resume.template)}
                  </p>
                </CardContent>
                <CardFooter className="pt-0 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Updated {format(new Date(resume.updated_at), 'MMM d, yyyy')}
                  </span>
                  <Button variant="outline" size="sm" onClick={() => handleEditResume(resume)}>
                    Edit
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
