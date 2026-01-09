import { ResumeContent, TemplateType } from '@/types/resume';
import { MinimalProfessionalTemplate } from './templates/MinimalProfessionalTemplate';
import { ModernCleanTemplate } from './templates/ModernCleanTemplate';
import { TechDeveloperTemplate } from './templates/TechDeveloperTemplate';
import { StudentFresherTemplate } from './templates/StudentFresherTemplate';
import { ExecutiveTemplate } from './templates/ExecutiveTemplate';

interface ResumePreviewProps {
  content: ResumeContent;
  template: TemplateType;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ content, template }) => {
  const TemplateComponent = {
    'minimal-professional': MinimalProfessionalTemplate,
    'modern-clean': ModernCleanTemplate,
    'tech-developer': TechDeveloperTemplate,
    'student-fresher': StudentFresherTemplate,
    'executive': ExecutiveTemplate,
  }[template];

  return (
    <div className="bg-[#ffffff] min-h-[1100px] w-[850px] mx-auto" style={{ fontFamily: 'Inter, Arial, sans-serif' }}>
      <TemplateComponent content={content} />
    </div>
  );
};
