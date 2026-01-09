import { ResumeContent } from '@/types/resume';

interface TemplateProps {
  content: ResumeContent;
}

export const ModernCleanTemplate: React.FC<TemplateProps> = ({ content }) => {
  const { personalDetails, summary, skills, experience, education, projects, certifications } = content;

  return (
    <div className="p-10 text-[#333]" style={{ fontSize: '11px', lineHeight: '1.6' }}>
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-[#2c3e50] mb-3">
          {personalDetails.fullName || 'Your Name'}
        </h1>
        <div className="flex flex-wrap gap-4 text-[10px] text-[#666]">
          {personalDetails.email && <span>{personalDetails.email}</span>}
          {personalDetails.phone && <span>{personalDetails.phone}</span>}
          {personalDetails.location && <span>{personalDetails.location}</span>}
          {personalDetails.linkedin && <span>{personalDetails.linkedin}</span>}
          {personalDetails.website && <span>{personalDetails.website}</span>}
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className="mb-6">
          <h2 className="text-base font-semibold text-[#2c3e50] mb-2 uppercase tracking-wide">
            About Me
          </h2>
          <div className="w-12 h-0.5 bg-[#3498db] mb-3"></div>
          <p className="text-[#555]">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-base font-semibold text-[#2c3e50] mb-2 uppercase tracking-wide">
            Experience
          </h2>
          <div className="w-12 h-0.5 bg-[#3498db] mb-3"></div>
          {experience.map((exp) => (
            <div key={exp.id} className="mb-4 pl-4 border-l-2 border-[#e0e0e0]">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h3 className="font-semibold text-[#2c3e50]">{exp.position}</h3>
                  <p className="text-[#3498db]">{exp.company}</p>
                </div>
                <span className="text-[10px] text-[#888] bg-[#f5f5f5] px-2 py-0.5 rounded">
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              {exp.location && <p className="text-[10px] text-[#888] mb-2">{exp.location}</p>}
              {exp.description.length > 0 && (
                <ul className="ml-4 list-disc text-[#555]">
                  {exp.description.map((bullet, i) => (
                    <li key={i}>{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-base font-semibold text-[#2c3e50] mb-2 uppercase tracking-wide">
            Skills
          </h2>
          <div className="w-12 h-0.5 bg-[#3498db] mb-3"></div>
          <div className="flex flex-wrap gap-2">
            {skills.flatMap((category) => 
              category.skills.map((skill, i) => (
                <span key={`${category.id}-${i}`} className="bg-[#f0f4f8] text-[#2c3e50] px-2 py-1 rounded text-[10px]">
                  {skill}
                </span>
              ))
            )}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-base font-semibold text-[#2c3e50] mb-2 uppercase tracking-wide">
            Education
          </h2>
          <div className="w-12 h-0.5 bg-[#3498db] mb-3"></div>
          {education.map((edu) => (
            <div key={edu.id} className="mb-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-[#2c3e50]">{edu.degree} in {edu.field}</h3>
                  <p className="text-[#3498db]">{edu.institution}</p>
                </div>
                <span className="text-[10px] text-[#888]">
                  {edu.startDate} - {edu.endDate}
                </span>
              </div>
              {edu.gpa && <p className="text-[10px] text-[#888]">GPA: {edu.gpa}</p>}
            </div>
          ))}
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-base font-semibold text-[#2c3e50] mb-2 uppercase tracking-wide">
            Projects
          </h2>
          <div className="w-12 h-0.5 bg-[#3498db] mb-3"></div>
          {projects.map((project) => (
            <div key={project.id} className="mb-3">
              <h3 className="font-semibold text-[#2c3e50]">{project.name}</h3>
              <p className="text-[#555] mb-1">{project.description}</p>
              {project.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-1">
                  {project.technologies.map((tech, i) => (
                    <span key={i} className="bg-[#e8f4fc] text-[#3498db] px-1.5 py-0.5 rounded text-[9px]">
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <section className="mb-6">
          <h2 className="text-base font-semibold text-[#2c3e50] mb-2 uppercase tracking-wide">
            Certifications
          </h2>
          <div className="w-12 h-0.5 bg-[#3498db] mb-3"></div>
          <div className="grid grid-cols-2 gap-2">
            {certifications.map((cert) => (
              <div key={cert.id} className="text-[10px]">
                <span className="font-medium">{cert.name}</span>
                <span className="text-[#888]"> • {cert.issuer} ({cert.date})</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
