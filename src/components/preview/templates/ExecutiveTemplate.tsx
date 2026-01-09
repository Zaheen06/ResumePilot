import { ResumeContent } from '@/types/resume';

interface TemplateProps {
  content: ResumeContent;
}

export const ExecutiveTemplate: React.FC<TemplateProps> = ({ content }) => {
  const { personalDetails, summary, skills, experience, education, projects, certifications } = content;

  return (
    <div className="p-12 text-[#2d2d2d]" style={{ fontSize: '11px', lineHeight: '1.7', fontFamily: 'Georgia, serif' }}>
      {/* Header */}
      <header className="mb-8 pb-6 border-b-2 border-[#8b7355]">
        <h1 className="text-3xl mb-3 tracking-wide" style={{ fontWeight: 400, letterSpacing: '0.1em' }}>
          {(personalDetails.fullName || 'Your Name').toUpperCase()}
        </h1>
        <div className="flex flex-wrap gap-6 text-[10px] tracking-wider">
          {personalDetails.email && <span>{personalDetails.email}</span>}
          {personalDetails.phone && <span>{personalDetails.phone}</span>}
          {personalDetails.location && <span>{personalDetails.location}</span>}
          {personalDetails.linkedin && <span>{personalDetails.linkedin}</span>}
        </div>
      </header>

      {/* Executive Summary */}
      {summary && (
        <section className="mb-8">
          <h2 className="text-sm tracking-widest mb-3 text-[#8b7355]" style={{ fontWeight: 400 }}>
            EXECUTIVE SUMMARY
          </h2>
          <p className="text-justify leading-relaxed">{summary}</p>
        </section>
      )}

      {/* Core Competencies */}
      {skills.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm tracking-widest mb-3 text-[#8b7355]" style={{ fontWeight: 400 }}>
            CORE COMPETENCIES
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {skills.flatMap((category) => 
              category.skills.map((skill, i) => (
                <span key={`${category.id}-${i}`} className="text-center py-1">
                  {skill}
                </span>
              ))
            )}
          </div>
        </section>
      )}

      {/* Professional Experience */}
      {experience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm tracking-widest mb-4 text-[#8b7355]" style={{ fontWeight: 400 }}>
            PROFESSIONAL EXPERIENCE
          </h2>
          {experience.map((exp) => (
            <div key={exp.id} className="mb-6">
              <div className="mb-2">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-base font-semibold">{exp.position}</h3>
                  <span className="text-[10px] tracking-wider">
                    {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <p className="italic text-[#666]">{exp.company}{exp.location && ` | ${exp.location}`}</p>
              </div>
              {exp.description.length > 0 && (
                <ul className="ml-4">
                  {exp.description.map((bullet, i) => (
                    <li key={i} className="mb-1 pl-2" style={{ listStyleType: '•', textIndent: '-0.5em', paddingLeft: '1em' }}>
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Education & Credentials */}
      <div className="grid grid-cols-2 gap-8">
        {/* Education */}
        {education.length > 0 && (
          <section className="mb-6">
            <h2 className="text-sm tracking-widest mb-3 text-[#8b7355]" style={{ fontWeight: 400 }}>
              EDUCATION
            </h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-3">
                <p className="font-semibold">{edu.degree}</p>
                <p className="text-[#666]">{edu.field}</p>
                <p className="text-[10px]">{edu.institution}, {edu.endDate}</p>
              </div>
            ))}
          </section>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <section className="mb-6">
            <h2 className="text-sm tracking-widest mb-3 text-[#8b7355]" style={{ fontWeight: 400 }}>
              CERTIFICATIONS
            </h2>
            {certifications.map((cert) => (
              <div key={cert.id} className="mb-2 text-[10px]">
                <p className="font-semibold">{cert.name}</p>
                <p className="text-[#666]">{cert.issuer}, {cert.date}</p>
              </div>
            ))}
          </section>
        )}
      </div>

      {/* Notable Projects */}
      {projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm tracking-widest mb-3 text-[#8b7355]" style={{ fontWeight: 400 }}>
            NOTABLE INITIATIVES
          </h2>
          {projects.slice(0, 3).map((project) => (
            <div key={project.id} className="mb-3">
              <h3 className="font-semibold">{project.name}</h3>
              <p className="text-[#555]">{project.description}</p>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};
