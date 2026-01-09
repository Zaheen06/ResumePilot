export interface PersonalDetails {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  website?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link?: string;
  highlights: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiryDate?: string;
  credentialId?: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  skills: string[];
}

export interface ResumeContent {
  personalDetails: PersonalDetails;
  summary: string;
  skills: SkillCategory[];
  experience: Experience[];
  education: Education[];
  projects: Project[];
  certifications: Certification[];
}

export interface Resume {
  id: string;
  user_id: string;
  title: string;
  template: TemplateType;
  content: ResumeContent;
  created_at: string;
  updated_at: string;
}

export type TemplateType = 
  | 'minimal-professional'
  | 'modern-clean'
  | 'tech-developer'
  | 'student-fresher'
  | 'executive';

export const TEMPLATE_OPTIONS: { value: TemplateType; label: string; description: string }[] = [
  { value: 'minimal-professional', label: 'Minimal Professional', description: 'Clean and simple design for any industry' },
  { value: 'modern-clean', label: 'Modern Clean', description: 'Contemporary layout with clear sections' },
  { value: 'tech-developer', label: 'Tech Developer', description: 'Optimized for technical roles and skills' },
  { value: 'student-fresher', label: 'Student / Fresher', description: 'Perfect for entry-level candidates' },
  { value: 'executive', label: 'Executive', description: 'Sophisticated design for senior roles' },
];

export const DEFAULT_RESUME_CONTENT: ResumeContent = {
  personalDetails: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: '',
  },
  summary: '',
  skills: [],
  experience: [],
  education: [],
  projects: [],
  certifications: [],
};
