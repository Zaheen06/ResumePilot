import { ResumeContent } from '@/types/resume';

interface TemplateProps {
  content: ResumeContent;
}

export const TechDeveloperTemplate: React.FC<TemplateProps> = ({ content }) => {
  const { personalDetails, summary, skills, experience, education, projects, certifications } = content;

  return (
    <div className="p-10 text-[#333] font-mono" style={{ fontSize: '10px', lineHeight: '1.6' }}>
      {/* Header */}
      <header className="mb-6 pb-4 border-b border-[#444]">
        <h1 className="text-2xl font-bold text-[#1a1a1a] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
          {personalDetails.fullName || 'Your Name'}
        </h1>
        <div className="flex flex-wrap gap-3 text-[10px]">
          {personalDetails.email && <span className="text-[#0066cc]">{personalDetails.email}</span>}
          {personalDetails.phone && <span>{personalDetails.phone}</span>}
          {personalDetails.location && <span>{personalDetails.location}</span>}
          {personalDetails.linkedin && <span className="text-[#0066cc]">{personalDetails.linkedin}</span>}
          {personalDetails.website && <span className="text-[#0066cc]">{personalDetails.website}</span>}
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className="mb-5">
          <h2 className="text-xs font-bold text-[#1a1a1a] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            {'// SUMMARY'}
          </h2>
          <p>{summary}</p>
        </section>
      )}

      {/* Skills - Emphasized for Tech */}
      {skills.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold text-[#1a1a1a] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            {'// TECH STACK'}
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {skills.map((category) => (
              <div key={category.id} className="bg-[#f5f5f5] p-2 rounded">
                <span className="font-bold text-[#0066cc]">{category.name}:</span>
                <div className="mt-1">
                  {category.skills.map((skill, i) => (
                    <span key={i} className="inline-block mr-2 mb-1">
                      <span className="text-[#888]">&lt;</span>
                      {skill}
                      <span className="text-[#888]">/&gt;</span>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold text-[#1a1a1a] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            {'// EXPERIENCE'}
          </h2>
          {experience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold" style={{ fontFamily: 'Inter, sans-serif' }}>{exp.position}</h3>
                  <p className="text-[#0066cc]">{exp.company}</p>
                </div>
                <span className="text-[9px] bg-[#222] text-[#0f0] px-2 py-0.5 rounded font-mono">
                  {exp.startDate} → {exp.current ? 'present' : exp.endDate}
                </span>
              </div>
              {exp.description.length > 0 && (
                <ul className="mt-2 ml-4">
                  {exp.description.map((bullet, i) => (
                    <li key={i} className="mb-1">
                      <span className="text-[#888]">$</span> {bullet}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Projects - Emphasized for Tech */}
      {projects.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold text-[#1a1a1a] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            {'// PROJECTS'}
          </h2>
          {projects.map((project) => (
            <div key={project.id} className="mb-3 bg-[#fafafa] p-3 rounded border border-[#eee]">
              <div className="flex justify-between items-start">
                <h3 className="font-bold" style={{ fontFamily: 'Inter, sans-serif' }}>{project.name}</h3>
                {project.link && (
                  <span className="text-[9px] text-[#0066cc]">{project.link}</span>
                )}
              </div>
              <p className="my-1">{project.description}</p>
              {project.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {project.technologies.map((tech, i) => (
                    <span key={i} className="bg-[#222] text-[#0f0] px-1.5 py-0.5 rounded text-[9px]">
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold text-[#1a1a1a] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            {'// EDUCATION'}
          </h2>
          {education.map((edu) => (
            <div key={edu.id} className="mb-2">
              <div className="flex justify-between">
                <span className="font-bold" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {edu.degree} in {edu.field}
                </span>
                <span className="text-[9px]">{edu.startDate} - {edu.endDate}</span>
              </div>
              <p className="text-[#0066cc]">{edu.institution}</p>
            </div>
          ))}
        </section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold text-[#1a1a1a] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            {'// CERTIFICATIONS'}
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {certifications.map((cert) => (
              <div key={cert.id} className="text-[9px] bg-[#f5f5f5] p-2 rounded">
                <span className="font-bold">{cert.name}</span>
                <br />
                <span className="text-[#666]">{cert.issuer} • {cert.date}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
