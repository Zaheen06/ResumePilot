import React, { createContext, useContext, useState, useCallback } from 'react';
import { Resume, ResumeContent, DEFAULT_RESUME_CONTENT, TemplateType } from '@/types/resume';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';
import { Json } from '@/integrations/supabase/types';

interface ResumeContextType {
  resumes: Resume[];
  currentResume: Resume | null;
  loading: boolean;
  fetchResumes: () => Promise<void>;
  createResume: (title?: string) => Promise<Resume | null>;
  updateResume: (id: string, updates: Partial<Resume>) => Promise<void>;
  deleteResume: (id: string) => Promise<void>;
  duplicateResume: (id: string) => Promise<Resume | null>;
  setCurrentResume: (resume: Resume | null) => void;
  updateContent: (content: Partial<ResumeContent>) => void;
  updateTemplate: (template: TemplateType) => void;
  saveCurrentResume: () => Promise<void>;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const ResumeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [currentResume, setCurrentResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchResumes = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      
      const mappedResumes: Resume[] = (data || []).map(item => ({
        id: item.id,
        user_id: item.user_id,
        title: item.title,
        template: item.template as TemplateType,
        content: item.content as unknown as ResumeContent,
        created_at: item.created_at,
        updated_at: item.updated_at,
      }));
      
      setResumes(mappedResumes);
    } catch (error) {
      console.error('Error fetching resumes:', error);
      toast.error('Failed to load resumes');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createResume = async (title?: string): Promise<Resume | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('resumes')
        .insert([{
          user_id: user.id,
          title: title || 'Untitled Resume',
          template: 'minimal-professional',
          content: DEFAULT_RESUME_CONTENT as unknown as Json,
        }])
        .select()
        .single();

      if (error) throw error;

      const newResume: Resume = {
        id: data.id,
        user_id: data.user_id,
        title: data.title,
        template: data.template as TemplateType,
        content: data.content as unknown as ResumeContent,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };

      setResumes(prev => [newResume, ...prev]);
      toast.success('Resume created successfully');
      return newResume;
    } catch (error) {
      console.error('Error creating resume:', error);
      toast.error('Failed to create resume');
      return null;
    }
  };

  const updateResume = async (id: string, updates: Partial<Resume>) => {
    try {
      const updateData: Record<string, unknown> = {};
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.template !== undefined) updateData.template = updates.template;
      if (updates.content !== undefined) updateData.content = updates.content as unknown as Json;

      const { error } = await supabase
        .from('resumes')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      setResumes(prev =>
        prev.map(r => (r.id === id ? { ...r, ...updates, updated_at: new Date().toISOString() } : r))
      );

      if (currentResume?.id === id) {
        setCurrentResume(prev => prev ? { ...prev, ...updates, updated_at: new Date().toISOString() } : null);
      }
    } catch (error) {
      console.error('Error updating resume:', error);
      toast.error('Failed to update resume');
    }
  };

  const deleteResume = async (id: string) => {
    try {
      const { error } = await supabase
        .from('resumes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setResumes(prev => prev.filter(r => r.id !== id));
      if (currentResume?.id === id) {
        setCurrentResume(null);
      }
      toast.success('Resume deleted successfully');
    } catch (error) {
      console.error('Error deleting resume:', error);
      toast.error('Failed to delete resume');
    }
  };

  const duplicateResume = async (id: string): Promise<Resume | null> => {
    if (!user) return null;

    const resumeToDuplicate = resumes.find(r => r.id === id);
    if (!resumeToDuplicate) return null;

    try {
      const { data, error } = await supabase
        .from('resumes')
        .insert([{
          user_id: user.id,
          title: `${resumeToDuplicate.title} (Copy)`,
          template: resumeToDuplicate.template,
          content: resumeToDuplicate.content as unknown as Json,
        }])
        .select()
        .single();

      if (error) throw error;

      const newResume: Resume = {
        id: data.id,
        user_id: data.user_id,
        title: data.title,
        template: data.template as TemplateType,
        content: data.content as unknown as ResumeContent,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };

      setResumes(prev => [newResume, ...prev]);
      toast.success('Resume duplicated successfully');
      return newResume;
    } catch (error) {
      console.error('Error duplicating resume:', error);
      toast.error('Failed to duplicate resume');
      return null;
    }
  };

  const updateContent = (content: Partial<ResumeContent>) => {
    if (!currentResume) return;
    setCurrentResume(prev => prev ? {
      ...prev,
      content: { ...prev.content, ...content },
    } : null);
  };

  const updateTemplate = (template: TemplateType) => {
    if (!currentResume) return;
    setCurrentResume(prev => prev ? { ...prev, template } : null);
  };

  const saveCurrentResume = async () => {
    if (!currentResume) return;
    await updateResume(currentResume.id, {
      title: currentResume.title,
      template: currentResume.template,
      content: currentResume.content,
    });
    toast.success('Resume saved successfully');
  };

  return (
    <ResumeContext.Provider
      value={{
        resumes,
        currentResume,
        loading,
        fetchResumes,
        createResume,
        updateResume,
        deleteResume,
        duplicateResume,
        setCurrentResume,
        updateContent,
        updateTemplate,
        saveCurrentResume,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};
